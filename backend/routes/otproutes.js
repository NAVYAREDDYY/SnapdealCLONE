const express = require("express");
const { sendOtp, loginWithOtp,sendOtpLoggedIn } = require("../controllers/otpcontrollers")
const{protect}= require("../middleware/authmiddleware")

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/login-otp", loginWithOtp);
router.post("/send-otp-loggedin", protect, sendOtpLoggedIn);


module.exports = router;
