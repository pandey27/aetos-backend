const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  size: [String],
  category: String,
  techTags: [String],
});

module.exports = mongoose.model('Product', productSchema);
