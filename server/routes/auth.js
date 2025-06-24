const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/mobile-login
router.post('/mobile-login', async (req, res) => {
  const { mobile, name, address } = req.body;

  if (!mobile || !name || !address) {
    return res.status(400).json({ message: "Missing mobile, name, or address" });
  }

  try {
    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ mobile, name, address });
    } else {
      user.name = name;
      user.address = address;
    }

    await user.save();

    // Optionally generate a JWT if needed
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

    res.json({ message: "User saved", user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
