const express = require('express');
const router = express.Router();
const envelopeController = require('../controllers/envelope');
const bodyParser = require("body-parser");

router.post('/', bodyParser.text({ type: "*/*" }), envelopeController.handleSentryWebhook);

module.exports = router;
