// ============================================
// routes/index.js (SIMPLIFICADO)
// ============================================
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Página principal
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Página principal
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API Equipo 2 Tarde' });
});

module.exports = router;