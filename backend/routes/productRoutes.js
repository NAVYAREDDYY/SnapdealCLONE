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
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = router;
