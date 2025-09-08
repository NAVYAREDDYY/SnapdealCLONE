const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  email: { type: String, unique: true, sparse: true },
  otp: { type: String }, 
  otpExpiry: { type: Date },
  isAdmin :{ type: Boolean, default: false }, 
});

module.exports = mongoose.model("User", userSchema);
