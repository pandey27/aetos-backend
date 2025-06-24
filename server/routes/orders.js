const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Utility: normalize any mobile format to last 10 digits
const normalizeMobile = (raw) => raw.replace(/\D/g, '').slice(-10);

// 📦 POST /api/orders — Create a new order
router.post('/', async (req, res) => {
  try {
    const { mobile, items, createdAt, deliveryDate, fingerprint } = req.body;

    if (!mobile || !items || items.length === 0 || !fingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedMobile = normalizeMobile(mobile);

      const newOrder = new Order({
        mobile: normalizedMobile, // ✅ always save 10-digit format
        items,
        createdAt: createdAt || new Date(),
        deliveryDate,
        fingerprint,
      });

    const savedOrder = await newOrder.save();
    console.log('✅ Order saved for mobile:', normalizedMobile);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('❌ Failed to save order:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📥 GET /api/orders/:mobile — Get orders by normalized mobile number
router.get('/:mobile', async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.mobile);
    const mobile = normalizeMobile(raw);

    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number required' });
    }

    const orders = await Order.find({ mobile }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ error: 'No orders found for this number' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
