// ============================================
// routes/auth.js
// ============================================
const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, recoverPassword } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/authSchema');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const { authMiddleware, requireAdminOrSuper }  = require('../middleware/auth');

router.post('/register', authMiddleware, requireAdminOrSuper, validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', getProfile);
router.post('/recover-password', recoverPassword);

module.exports = router;
