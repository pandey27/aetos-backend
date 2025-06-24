const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders — Create a new order
router.post('/', async (req, res) => {
  try {
    const { mobile, items, fingerprint } = req.body;

    if (!mobile || !items || !fingerprint) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingOrder = await Order.findOne({ fingerprint });
    if (existingOrder) {
      console.warn('⚠️ Duplicate order blocked');
      return res.status(409).json({ message: 'Duplicate order' });
    }

    const createdAt = new Date(); // Indian local time
    const deliveryDate = new Date();
    deliveryDate.setDate(createdAt.getDate() + 5);

    const order = new Order({
      mobile,
      items,
      fingerprint,
      createdAt,
      deliveryDate
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Order save error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:mobile — Get orders by mobile number
router.get('/:mobile', async (req, res) => {
  try {
    const mobile = decodeURIComponent(req.params.mobile);
    const orders = await Order.find({ mobile }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (err) {
    console.error('❌ Order fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
