const express = require("express");
const { protect, adminOnly } = require("../middleware/authmiddleware")
const Product = require('../models/product')

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      // Create a case-insensitive search regex
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      };
    }

    if (category) {
      query.category = new RegExp(category, 'i');
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

router.post("/add", protect, adminOnly, async (req, res) => {
  try {
    const { name, price, description, image, stock, category, subCategory, subcategory, color, sizes, hasSizes } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price are required" });
    }
    // Normalize sizes: accept array of strings, array of objects, or CSV string
    let normalizedSizes = undefined;
    if (sizes) {
      if (Array.isArray(sizes)) {
        if (sizes.length > 0 && typeof sizes[0] === 'string') {
          normalizedSizes = sizes.map(s => ({ name: String(s).trim(), inStock: true }));
        } else {
          normalizedSizes = sizes;
        }
      } else if (typeof sizes === 'string') {
        normalizedSizes = sizes
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .map(name => ({ name, inStock: true }));
      }
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      stock,
      category,
      subcategory: subcategory || subCategory, // support both keys from client
      color,
      sizes: normalizedSizes,
      hasSizes: typeof hasSizes === 'boolean' ? hasSizes : undefined
    });
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
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    console.log("Update request received for product:", req.params.id);
    console.log("Update data:", req.body);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product updated successfully:", product);
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", product: result });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});



module.exports = router;
