const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const productRoutes = require('./routes/products');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /uploads (for images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === ROUTES ===
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/userRoutes')); // e.g. /api/profile
app.use('/api/upload', require('./routes/upload')); // image upload
app.use('/api/reviews', require('./routes/reviews')); // product reviews
app.use('/api/products', productRoutes);
// === DATABASE CONNECTION ===
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aetos-orders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
