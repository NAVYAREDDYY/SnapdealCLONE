const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  otp: { type: String },   // store OTP temporarily
  otpExpiry: { type: Date } // optional: to expire OTP after few minutes
});

module.exports = mongoose.model("User", userSchema);
