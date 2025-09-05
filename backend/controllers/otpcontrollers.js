const User = require("../models/user");
const sendOtpEmail = require("../utils/email"); 
const jwt = require("jsonwebtoken");

const sendOtp = async (req, res) => {
  const { emailOrMobile } = req.body;
 console.log("Sending OTP to:", emailOrMobile);

  try {
    if (!emailOrMobile || !emailOrMobile.includes("@")) {
      return res.status(400).json({ message: "Valid Email is required" });
    }
    
    let user = await User.findOne({ email: emailOrMobile });
    if (!user) user = new User({ email: emailOrMobile });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    
    await sendOtpEmail(emailOrMobile, otp);
    console.log(`✅ OTP sent to ${emailOrMobile}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error in sendOtp:", err);
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

const loginWithOtp = async (req, res) => {
  const { emailOrMobile, otp } = req.body;

  try {
    if (!emailOrMobile || !otp) {
      return res.status(400).json({ message: "Email/Mobile and OTP required" });
    }

    const user = await User.findOne({ email: emailOrMobile });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWTSECRET,               
      { expiresIn: "1h" }                  
    );
   const username = user.email.split("@")[0]; 
  res.status(200).json({ 
  message: "Login successful", 
  token,
   user: { username }  
});


  } catch (error) {
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

module.exports = { sendOtp, loginWithOtp };
