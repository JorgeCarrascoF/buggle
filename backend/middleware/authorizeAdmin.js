const boom = require('@hapi/boom');

function authorizeAdmin(req, res, next) {
    // Verificar si el usuario está autenticado y tiene el rol de admin
    if (!req.user || !["admin", "superadmin"].includes(req.user.role)) {
        return next(boom.forbidden('Access denied. Only admins can access this resource.'));
    }
    next();
}

module.exports = authorizeAdmin;
