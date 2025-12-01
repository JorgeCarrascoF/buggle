// ============================================
// middleware/auth.js (SOLUCIÓN)
// ============================================
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET = process.env.JWT_SECRET || 'clave_secreta';

async function authMiddleware(req, res, next) { // La función debe ser async
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ msg: 'Token not provided, access denied' });
    }

    try {
        // 1. Decodificar el token para obtener el ID del usuario
        const decoded = jwt.verify(token, SECRET);

        // 2. Buscar al usuario en la DB con el ID del token
        //    Se excluye la contraseña de la consulta por seguridad.
        const freshUser = await User.findById(decoded.id).select('-password');

        // 3. Verificar si el usuario todavía existe
        if (!freshUser) {
            return res.status(401).json({ msg: 'User not found, invalid token' });
        }

        // 4. Adjuntar el objeto de usuario FRESCO de la DB a la petición
        req.user = freshUser;
        
        next();

    } catch (err) {
        return res.status(403).json({ msg: 'Token invalid or expired' });
    }
}

// Middleware para verificar si el usuario tiene un rol específico
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                msg: 'Access denied. Unauthorized role.',
                requiredRoles: roles,
                currentRole: req.user.role
            });
        }

        next();
    };
}

// Middleware para verificar si el usuario es superadmin
function requireSuperAdmin(req, res, next) {
    return requireRole(['superadmin'])(req, res, next);
}

// Middleware para verificar si el usuario es admin o superadmin
function requireAdminOrSuper(req, res, next) {
    return requireRole(['admin', 'superadmin'])(req, res, next);
}

module.exports = {
    authMiddleware,
    requireRole,
    requireSuperAdmin,
    requireAdminOrSuper
};