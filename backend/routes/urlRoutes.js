const express = require('express');
const { checkUrl } = require('../controllers/urlController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/check-url', checkUrl);

module.exports = router;
