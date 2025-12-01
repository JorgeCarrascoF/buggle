const express = require('express');
const { getReportById, getReportByLog } = require('../controllers/suggestionController');

const router = express.Router();

router.post('/', getReportById)
router.get('/log/:logId', getReportByLog)


module.exports = router;