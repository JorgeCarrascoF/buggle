// ============================================
// routes/roles.js (CORREGIDO)
// ============================================
const express = require('express');
const { createRole, getAllRoles } = require('../controllers/roleController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createRole);
router.get('/', getAllRoles);

module.exports = router;