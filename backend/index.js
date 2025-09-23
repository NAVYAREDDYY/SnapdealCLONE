const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors");
const connectDB = require('./db/config')
const authroutes = require('./routes/authroutes')
const otproutes = require('./routes/otproutes')
const productRoutes = require('./routes/productRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewRoutes = require('./routes/reviewRoutes')


const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cors({
origin: "http://localhost:3000", // your frontend
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]}));
app.use('/authroutes',authroutes)
app.use('/otproutes',otproutes)
app.use("/products", productRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Simple serviceable pincode list; expand or replace with DB as needed
const SERVICEABLE_PINCODES = new Set([
  "110001", "400001", "560001", "600001", "700001",
  "500001", "380001", "302001", "380015", "411001"
]);

// Pincode availability check endpoint
app.post("/api/pincode/check", (req, res) => {
  try {
    const { pincode } = req.body || {};
    const pin = String(pincode || "").trim();
    if (!/^\d{6}$/.test(pin)) {
      return res.status(400).json({ available: false, message: "Invalid pincode" });
    }
    const available = SERVICEABLE_PINCODES.has(pin);
    return res.json({ available });
  } catch (e) {
    return res.status(500).json({ available: false, message: "Server error" });
  }
});

// Admin-only: Get all orders
const { protect, adminOnly } = require('./middleware/authmiddleware');
const Order = require('./models/order');
app.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch orders', error: e.message });
  }
});

// Admin-only: Update order status
app.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body || {};
    const allowed = ['placed','processing','shipped','delivered','cancelled'];
    if (!allowed.includes(String(status || '').toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.orderStatus = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update order', error: e.message });
  }
});
// Example with Express
app.put("/api/orders/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send({ message: "Order not found" });

    order.orderStatus = "cancelled";
    await order.save();
    res.send({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


const PORT = process.env.PORT || 5001
app.listen(PORT,()=> console.log(`server connected on http://localhost:${PORT}`))