const User = require("../models/user");
const sendOtpEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body; // email or mobile

    if (!identifier) {
      return res.status(400).json({ message: "Email or Mobile is required" });
    }

    const isEmail = identifier.includes("@");
    let user;
    let username = "";

    if (isEmail) {
      user = await User.findOne({ email: identifier });
      if (!user) {
        username = identifier.split("@")[0]; // before @
        user = new User({ email: identifier, username });
      }
    } else {
      const normalizedMobile = String(identifier).replace(/\D/g, ""); // digits only
      if (!normalizedMobile || normalizedMobile.length !== 10) {
        return res.status(400).json({ message: "Valid 10-digit mobile number is required" });
      }
      user = await User.findOne({ mobile: normalizedMobile });
      if (!user) {
        username = normalizedMobile.slice(0, 2) + "XXXXXXXX"; // e.g. 72XXXXXXXX
        user = new User({ mobile: normalizedMobile, username });
      }
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP
    if (isEmail) {
      await sendOtpEmail(user.email, otp);
    } else {
      if (!twilioClient) {
        return res.status(500).json({ message: "SMS service not configured" });
      }
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      const toNumber = user.mobile.startsWith("+") ? user.mobile : `+91${user.mobile}`; // ensure country code
      await twilioClient.messages.create({
        body: `Your Snapdeal OTP is ${otp}. It is valid for 5 minutes.`,
        from: fromNumber,
        to: toNumber,
      });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in sendOtp:", err);
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

const loginWithOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: "Email/Mobile and OTP required" });
    }

    const isEmail = identifier.includes("@");
    const query = isEmail
      ? { email: identifier }
      : { mobile: String(identifier).replace(/\D/g, "") };

    let user = await User.findOne(query);

    // If user does not exist, create one (fallback username)
    if (!user) {
      const newUserData = {
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
        username: isEmail
          ? identifier.split("@")[0]
          : `user_${String(identifier).slice(-4)}`,
      };
      if (isEmail) newUserData.email = identifier;
      else newUserData.mobile = String(identifier).replace(/\D/g, "");

      user = await User.create(newUserData);
    }

    // Validate OTP
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || 'user'},
      process.env.JWTSECRET,
      { expiresIn: "7d" }
    );

    // ✅ Use stored username if available
    const username = user.username
      ? user.username
      : isEmail
        ? identifier.split("@")[0]
        : `user_${String(identifier).slice(-4)}`;

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username,
        email: user.email,
        role: user.role || 'user', 
      },
    });
  } catch (err) {
    console.error("Error in loginWithOtp:", err);
    res.status(500).json({ message: "Error during login", error: err.message });
  }
};
const sendOtpLoggedIn = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    if (user.email) {
      await sendOtpEmail(user.email, otp);
    } else if (user.mobile) {
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      const toNumber = user.mobile.startsWith("+") ? user.mobile : `+91${user.mobile}`;
      await twilioClient.messages.create({
        body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        from: fromNumber,
        to: toNumber,
      });
    } else {
      return res.status(400).json({ message: "No email or mobile available to send OTP" });
    }

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = { sendOtp, loginWithOtp,sendOtpLoggedIn};