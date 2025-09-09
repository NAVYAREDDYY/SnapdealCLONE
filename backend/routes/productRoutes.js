const express = require("express");
const { protect, adminOnly } = require("../middleware/authmiddleware")
const Product = require('../models/product')

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

router.post("/add", protect, adminOnly, async (req, res) => {
  try {
    const { name, price, description, image, stock, category } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price are required" });
    }
    const product = new Product({ name,price,description,image,stock,category });
    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });
  } catch (error) {
    res.status(500).json({ message: " Error adding product", error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/:id/rate",protect,async (req, res) => {
  try {
    const { rating } = req.body; 
      const userId = req.user._id;
    
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.ratings) product.ratings = [];
    
    const existing = product.ratings.find((r) => r.userId?.toString() === userId.toString());
    
    if (existing) {
      return res.status(400).json({ message: "You already rated this product" });
    } 
    product.ratings.push({ userId, rating });
    await product.save();
    res.json({ message: "Thanks for Rating" });
  } catch (err) {
    console.error("Error in /rate:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
