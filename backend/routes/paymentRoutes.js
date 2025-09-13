const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const {
  createOrder,
  verifyPayment,
  getOrderById,
  getUserOrders
} = require('../controllers/paymentController');

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/order/:id', protect, getOrderById);
router.get('/my-orders', protect, getUserOrders);

module.exports = router;