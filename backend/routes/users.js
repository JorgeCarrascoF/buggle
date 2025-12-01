// ============================================
// routes/users.js (ACTUALIZADO)
// ============================================
const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUser,     // Importar nueva función
    deleteUser,      // Importar nueva función
    getUsersByFilter,
    changePassword,
    firstLoginWithoutProtection,
} = require('../controllers/userController');
const { authMiddleware, requireSuperAdmin, requireAdminOrSuper } = require('../middleware/auth');
const { userPermissions } = require('../middleware/permissions');

const router = express.Router();

//Ruta sin protección para el first login
router.patch("/first-login/:id", firstLoginWithoutProtection)

// Rutas GET
router.get('/', authMiddleware, userPermissions.canRead, getUsersByFilter);
router.get('/:id', authMiddleware, userPermissions.canRead, getUserById);

// Nueva ruta PATCH para actualizar
router.patch('/:id', authMiddleware, userPermissions.canUpdate, updateUser);

// Nueva ruta DELETE para eliminar - solo superadmin
router.delete('/:id', authMiddleware, requireSuperAdmin, deleteUser);

// Nueva ruta POST para cambiar contraseña
router.post('/change-password', authMiddleware, changePassword); 


module.exports = router;