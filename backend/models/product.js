const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
  title: { type: String },
  verifiedPurchase: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "S", "M", "L", "XL", "Default"
  inStock: { type: Boolean, default: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, 
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  reviews: [reviewSchema],
  description: { type: String },
  category: { type: String },
  subcategory: { type: String },
  stock: { type: Number },
  // Primary color for the product (optional)
  color: { type: String },
  sizes: [sizeSchema],
  hasSizes: { type: Boolean, default: true } // Set to false for products like electronics
});

module.exports = mongoose.model("Product", productSchema);
