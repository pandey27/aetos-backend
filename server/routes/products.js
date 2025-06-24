const express = require('express');
const router = express.Router();

// Sample route
router.get('/', (req, res) => {
  res.send('Products route is working');
});

module.exports = router;
