
const express = require('express');
const router = express.Router();
const Review = require('../models/ProductReview');

// GET /api/reviews/:productId - fetch reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reviews - submit a new review
router.post('/', async (req, res) => {
  const { productId, name, rating, comment } = req.body;

  if (!productId || !rating) {
    return res.status(400).json({ error: 'Product ID and rating are required' });
  }

  try {
    const review = new Review({ productId, name, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
