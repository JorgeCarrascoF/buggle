// ============================================
// middleware/permissions.js
// Middleware para verificar permisos específicos
// ============================================

// Verificar si el usuario tiene permisos para una operación específica
function hasPermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    // Superadmin tiene todos los permisos
    if (req.user.role === "superadmin") {
      return next();
    }

    // Permitir que un usuario se actualice a sí mismo
    if (
      permission === "user:update" &&
      req.params.id && // el id viene en la ruta, ej: PUT /users/:id
      req.user.id.toString() === req.params.id.toString()
    ) {
      return next();
    }

    // Verificar permisos específicos del rol
    if (req.user.roleId && req.user.roleId.permission) {
      if (req.user.roleId.permission.includes(permission)) {
        return next();
      }
    }

    // Verificar permisos basados en el rol string
    const rolePermissions = {
      admin: [
        "user:read",
        "user:create",
        "user:update",
        "role:read",
        "log:read",
        "log:create",
      ],
      user: ["user:read", "log:read"],
    };

    if (
      rolePermissions[req.user.role] &&
      rolePermissions[req.user.role].includes(permission)
    ) {
      return next();
    }

    return res.status(403).json({
      msg: "Insufficient permission to perform this operation",
      requiredPermission: permission,
      currentRole: req.user.role,
    });
  };
}

// Middleware para verificar permisos de usuario
const userPermissions = {
  canRead: hasPermission("user:read"),
  canCreate: hasPermission("user:create"),
  canUpdate: hasPermission("user:update"),
  canDelete: hasPermission("user:delete"),
};

// Middleware para verificar permisos de roles
const rolePermissions = {
  canRead: hasPermission("role:read"),
  canCreate: hasPermission("role:create"),
  canUpdate: hasPermission("role:update"),
  canDelete: hasPermission("role:delete"),
};

// Middleware para verificar permisos de logs
const logPermissions = {
  canRead: hasPermission("log:read"),
  canCreate: hasPermission("log:create"),
  canUpdate: hasPermission("log:update"),
  canDelete: hasPermission("log:delete"),
};

module.exports = {
  hasPermission,
  userPermissions,
  rolePermissions,
  logPermissions,
};
