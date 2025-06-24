const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products — Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('❌ Product fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id — Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error('❌ Single product fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products — Add new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Product save error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
