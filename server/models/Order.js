
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Mobile number must be 10 digits']
  },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      size: String,
      quantity: Number,
      slug: String,
      image: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  fingerprint: {
    type: String,
    required: true
  }
});

// ✅ Auto-normalize mobile before saving
orderSchema.pre('save', function(next) {
  if (this.mobile) {
    this.mobile = this.mobile.replace(/\D/g, '').slice(-10);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
