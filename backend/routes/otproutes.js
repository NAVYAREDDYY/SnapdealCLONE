const express = require("express");
const { sendOtp, loginWithOtp } = require("../controllers/otpcontrollers")

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/login-otp", loginWithOtp);

module.exports = router;
