const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  contact: { type: String },
  address: { type: String },
  role: { type: String, enum: ["vendor"], default: "vendor" }
}, { timestamps: true });

module.exports = mongoose.model("Vendor", vendorSchema);


