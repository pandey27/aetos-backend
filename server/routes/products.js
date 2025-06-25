const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/products - Add new product
router.post('/', async (req, res) => {
  try {
    const { name, price, category, image, slug } = req.body;
    const newProduct = new Product({ name, price, category, image, slug });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/products - List all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/products/slug/:slug - Get product by slug
router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
