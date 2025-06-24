const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/profile?mobile=+91XXXXXXXXXX
// Existing GET route (unchanged)
router.get('/profile', async (req, res) => {
  const { mobile } = req.query;

  if (!mobile) return res.status(400).json({ message: "Mobile number required" });

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ NEW POST /api/profile
// ✅ Add this just below the GET /profile route

router.post('/profile', async (req, res) => {
  const { name, address, mobile } = req.body;

  if (!name || !address || !mobile) {
    return res.status(400).json({ error: "Missing name, address, or mobile" });
  }

  const normalizedMobile = mobile.replace(/\D/g, '').slice(-10);

  try {
    const user = await User.findOneAndUpdate(
      { mobile: normalizedMobile },
      { name, address, mobile: normalizedMobile },
      { upsert: true, new: true }
    );

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
