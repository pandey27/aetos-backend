const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Normalize mobile number to 10-digit Indian number.
 */
function normalizeMobile(mobile) {
  return mobile.replace(/\D/g, '').slice(-10); // returns "9619032068"
}

/**
 * GET /api/profile?mobile=...
 * Returns user profile by normalized mobile
 */
router.get('/profile', async (req, res) => {
  const { mobile } = req.query;
  if (!mobile) return res.status(400).json({ message: "Mobile number required" });

  const normalized = normalizeMobile(mobile);
  console.log("🔍 Looking for mobile ending in:", normalized);

  try {
    const user = await User.findOne({
      mobile: { $regex: new RegExp(`${normalized}$`) }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("❌ Error in GET /profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/mobile-login
 * Creates or updates a user and returns profile + token
 */
router.post('/mobile-login', async (req, res) => {
  const { mobile, name, address } = req.body;
  console.log("📥 POST /mobile-login payload:", { mobile, name, address });

  if (!mobile || !name || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const normalized = normalizeMobile(mobile);
  const formattedMobile = `+91${normalized}`;

  try {
    let user = await User.findOne({
      mobile: { $regex: new RegExp(`${normalized}$`) }
    });

    if (!user) {
      user = new User({
        mobile: formattedMobile,
        name,
        address
      });
    } else {
      user.name = name;
      user.address = address;
    }

    await user.save();

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

    res.json({ message: "User saved", user, token });
  } catch (err) {
    console.error("❌ Error in POST /mobile-login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
