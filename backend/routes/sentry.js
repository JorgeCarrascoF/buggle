const express = require('express');
const router = express.Router();
const sentryController = require('../controllers/sentryController');

router.post('/sentry', sentryController.handleSentryWebhook);

module.exports = router;
