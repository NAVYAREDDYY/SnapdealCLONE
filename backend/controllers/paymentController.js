const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order');
const Product = require('../models/product');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount, items, shippingAddress } = req.body;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: 'order_' + Date.now(),
      payment_capture: 1
    });

    // Enrich items with vendorId and default itemStatus
    const productIds = (items || []).map(i => i.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } }).select('_id vendorId name price');
    const productIdToVendor = new Map(products.map(p => [String(p._id), String(p.vendorId || '')]));

    const enrichedItems = (items || []).map(i => ({
      productId: i.productId,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      vendorId: productIdToVendor.get(String(i.productId)) || undefined,
      itemStatus: 'pending',
      selectedSize: i.selectedSize, // <<< ADD THIS
      color: i.color 
    }));

    // Create order in database
    const newOrder = new Order({
      userId: req.user._id,
      items: enrichedItems,
      totalAmount: amount,
      shippingAddress: shippingAddress,
      paymentInfo: {
        razorpayOrderId: order.id
      }
    });
    await newOrder.save();

    res.status(200).json({
      success: true,
      order: order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order in database and return updated order
      const updatedOrder = await Order.findOneAndUpdate(
        { 'paymentInfo.razorpayOrderId': razorpay_order_id },
        {
          'paymentInfo.razorpayPaymentId': razorpay_payment_id,
          'paymentInfo.razorpaySignature': razorpay_signature,
          paymentStatus: 'completed',
          orderStatus: 'processing',
          status: 'processing'
        },
        { new: true }
      );

      // Decrement stock for each product item in this order
      try {
        if (updatedOrder && Array.isArray(updatedOrder.items)) {
          const updates = updatedOrder.items.map(async (it) => {
            if (!it.productId || !it.quantity) return;
            await Product.updateOne(
              { _id: it.productId },
              { $inc: { stock: -Math.max(1, it.quantity) } }
            );
          });
          await Promise.all(updates);
        }
      } catch (stockErr) {
        // Log but do not fail the payment response
        console.error('Stock decrement failed:', stockErr);
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order: updatedOrder
      });
    } else {
      await Order.findOneAndUpdate(
        { 'paymentInfo.razorpayOrderId': razorpay_order_id },
        { paymentStatus: 'failed' }
      );

      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
};

// Get order details
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name image');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
};
module.exports={ createOrder, verifyPayment, getOrderById, getUserOrders };