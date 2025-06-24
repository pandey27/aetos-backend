// models/orderModel.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  items: [
    {
      id: Number,
      name: String,
      slug: String,
      price: Number,
      size: String,
      quantity: Number,
      image: String,
    }
  ],
  user: {
    name: String,
    address: String,
    mobile: String,
    token: String,
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'Placed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
