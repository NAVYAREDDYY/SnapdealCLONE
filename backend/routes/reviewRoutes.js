const express = require("express");
const { protect } = require("../middleware/authmiddleware");
const Product = require("../models/product");
const User = require("../models/user");

const router = express.Router();

// Add a review
router.post("/:productId/reviews", protect, async (req, res) => {
  try {
    const { rating, review, title } = req.body;
    const { productId } = req.params;

    // Validate input
    if (!rating || !review) {
      return res.status(400).json({ message: "Rating and review are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Get user details
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has already reviewed
    const existingReview = product.reviews.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Add the review
    const newReview = {
      userId: req.user._id,
      userName: user.name || "Anonymous",
      rating,
      review,
      title,
      verifiedPurchase: false // You can update this based on order history
    };

    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
});

// Get reviews for a product
router.get("/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate("reviews.userId", "name");
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = product.reviews;
    
    // Calculate rating statistics
    const totalReviews = reviews.length;
    const ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    let totalRating = 0;

    reviews.forEach(review => {
      ratingCounts[review.rating]++;
      totalRating += review.rating;
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    res.json({
      reviews,
      statistics: {
        totalReviews,
        averageRating,
        ratingCounts
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});

module.exports = router;