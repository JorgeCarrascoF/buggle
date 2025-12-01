const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ msg: `Welcome ${req.user.userName}` });
});

module.exports = router;
