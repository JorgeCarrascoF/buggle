const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const {authMiddleware} = require('../middleware/auth'); 
const authorizeAdmin = require('../middleware/authorizeAdmin'); 


// Aplicar los middlewares a todas las rutas de documentos
router.post('/', authMiddleware, authorizeAdmin, documentController.createDocument);
router.get('/', authMiddleware, authorizeAdmin, documentController.getAllDocuments);
router.get('/:id', authMiddleware, authorizeAdmin, documentController.getDocumentById);
router.patch('/:id', authMiddleware, authorizeAdmin, documentController.updateDocument);
router.delete('/:id', authMiddleware, authorizeAdmin, documentController.deleteDocument);

module.exports = router;
