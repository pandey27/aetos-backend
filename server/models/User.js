const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, required: true }, // this is your actual login identifier
  address: String
});

module.exports = mongoose.model('User', userSchema);
