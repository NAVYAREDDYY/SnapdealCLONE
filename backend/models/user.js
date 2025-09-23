const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  mobile: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String }, // hashed, optional for OTP-only users until set
  isVerified: { type: Boolean, default: false },

  // OTP login/verification fields
  otp: { type: String },
  otpExpiry: { type: Date },

  // Backward-compat / roles
  role: { type: String, enum: ["user", "admin", "vendor"], default: "user" },
  
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
