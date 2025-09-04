const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "Your OTP for Snapdeal Clone",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    });
    console.log("OTP email sent successfully to", to);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = sendOtpEmail;
