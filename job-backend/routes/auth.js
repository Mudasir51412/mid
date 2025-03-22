const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Save user info on login
router.post('/login', async (req, res) => {
  const { name, email, photo } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, photo });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user' });
  }
});

module.exports = router;
