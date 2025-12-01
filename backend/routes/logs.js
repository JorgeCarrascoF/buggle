// ============================================
// routes/logs.js (ACTUALIZADO)
// ============================================
const express = require('express');
const { 
    getAllLogs, 
    getLogById, 
    updateLog,
    deleteLog,
    createLog,
} = require('../controllers/logController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

//Ruta para creación
router.post('/', authMiddleware, createLog);

// Rutas GET
router.get('/', authMiddleware, getAllLogs);
router.get('/:id', authMiddleware, getLogById);

// Nueva ruta PATCH para actualizar
router.patch('/:id', authMiddleware, updateLog);

// Nueva ruta DELETE para eliminar
router.delete('/:id', authMiddleware, deleteLog);

module.exports = router;