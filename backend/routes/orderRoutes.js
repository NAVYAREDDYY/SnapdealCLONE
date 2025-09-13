const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { getUserOrders } = require('../controllers/paymentController');

// Get all orders for logged-in user
router.get('/', protect, getUserOrders);

module.exports = router;
