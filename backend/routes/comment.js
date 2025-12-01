const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const {authMiddleware} = require('../middleware/auth'); 
//const authorizeAdmin = require('../middleware/authorizeAdmin'); 

// Aplicar los middlewares a todas las rutas de comments
router.post('/', authMiddleware, commentController.createComment);
router.get('/', authMiddleware,  commentController.getAllComments);
router.get('/log/:logId', authMiddleware,  commentController.getCommentsByLog);
router.get('/:id', authMiddleware,  commentController.getCommentById);
router.patch('/:id', authMiddleware,  commentController.updateComment);
router.delete('/:id', authMiddleware,  commentController.deleteComment);

module.exports = router;
