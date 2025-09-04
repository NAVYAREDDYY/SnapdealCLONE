const express = require("express");
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

module.exports = router;
