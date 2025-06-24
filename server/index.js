const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Route files
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/upload');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === ROUTES ===
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);            // e.g. /api/profile
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);

// === DATABASE CONNECTION ===
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aetos-orders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const timeIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`✅ Connected to MongoDB at ${timeIST}`);
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
