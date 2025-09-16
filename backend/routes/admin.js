// backend/routes/admin.js
const express = require("express");
const { protect, adminOnly } = require("../middleware/authmiddleware");
const Product = require("../models/product"); // assuming you have a product model
const Order = require("../models/order");
const User = require("../models/user");

const router = express.Router();

// Get all products (Admin only)
router.get("/products", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Example: Get all users (Admin only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
// Product edit and delete routes have been moved to productRoutes.js

// Get all orders (Admin only)
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId', 'name image price')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});


module.exports = router;
