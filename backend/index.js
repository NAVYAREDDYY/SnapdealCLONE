const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors");
const connectDB = require('./db/config')
const authroutes = require('./routes/authroutes')
const otproutes = require('./routes/otproutes')
const productRoutes = require('./routes/productRoutes')
const adminRoutes = require('./routes/admin')
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
app.use("/api/admin", adminRoutes);
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

const PORT = process.env.PORT || 5001
app.listen(PORT,()=> console.log(`server connected on http://localhost:${PORT}`))