const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { vendorOnly } = require('../middleware/authmiddleware');
const Product = require('../models/product');
const Order = require('../models/order');

// GET /api/vendor/:id/products → fetch products of that vendor (admin can fetch any)
router.get('/:id/products', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'admin' || req.user?.isAdmin;
    if (!isAdmin && req.user._id.toString() !== id.toString()) {
      return res.status(403).json({ message: 'Cannot view other vendors\' products' });
    }
    const products = await Product.find({ vendorId: id }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET /api/vendor/:id/orders → fetch only orders containing that vendor’s products, with filters/search/sort
router.get('/:id/orders', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, q, sort = 'desc' } = req.query; // status: pending|processing|shipped|delivered|cancelled|all
    const isAdmin = req.user?.role === 'admin' || req.user?.isAdmin;
    if (!isAdmin && req.user._id.toString() !== id.toString()) {
      return res.status(403).json({ message: 'Cannot view other vendors\' orders' });
    }
    // Base query: orders containing at least one item for this vendor
    let orders = await Order.find({ 'items.vendorId': id })
      .populate('userId', 'name email')
      .populate('items.productId', 'name image price')
      .select('-paymentInfo.razorpaySignature -paymentInfo.razorpayPaymentId')
      .sort({ createdAt: sort === 'asc' ? 1 : -1 });

    // Keep only vendor's items in each order
    orders = orders.map(o => ({
      _id: o._id,
      userId: o.userId,
      items: o.items.filter(it => String(it.vendorId) === String(id)),
      totalAmount: o.totalAmount,
      shippingAddress: o.shippingAddress,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      status: o.status,
      createdAt: o.createdAt
    }));

    // Status filter at item-level
    if (status && status !== 'all') {
      orders = orders.map(o => ({
        ...o,
        items: o.items.filter(it => String(it.itemStatus) === String(status))
      })).filter(o => o.items.length > 0);
    }

    // Search by order id suffix or customer name
    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      orders = orders.filter(o => {
        const orderIdSuffix = String(o._id).slice(-8).toLowerCase();
        const customer = (o.userId?.name || '').toLowerCase();
        return orderIdSuffix.includes(term) || customer.includes(term);
      });
    }

    res.json({ orders });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PATCH /api/vendor/orders/:orderId/status → vendor/admin updates an order item's status
router.patch('/orders/:orderId/status', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, status } = req.body; // status in ['pending','processing','shipped','delivered','cancelled']
    const allowed = ['pending','processing','shipped','delivered','cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Order item not found' });
    const isAdmin = req.user?.role === 'admin' || req.user?.isAdmin;
    if (!isAdmin && String(item.vendorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.itemStatus = status;

    // Optionally update overall orderStatus if all items delivered/cancelled etc.
    await order.save();
    res.json({ message: 'Item status updated', order });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


