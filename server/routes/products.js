const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/products - Add new product
router.post('/', async (req, res) => {
  try {
    const { name, price, category, image } = req.body;
    const newProduct = new Product({ name, price, category, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/products - List all products (optional for display)
router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

module.exports = router;