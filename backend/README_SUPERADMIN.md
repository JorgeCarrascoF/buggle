# Sistema de Superadmin - Foo Talent Backend

## 🚀 Implementación Completada

Se ha implementado exitosamente un sistema de roles jerárquico con el rol **superadmin** como el nivel más alto de privilegios.

## 🔐 Roles y Permisos

### Superadmin
- **Acceso completo** a todas las funcionalidades
- **Único rol** que puede eliminar usuarios
- **Único rol** que puede cambiar roles de otros usuarios
- **Puede modificar** cualquier usuario del sistema

### Admin
- **Acceso limitado** a funcionalidades de usuario
- **No puede** eliminar usuarios
- **No puede** modificar usuarios superadmin
- **Puede** crear, leer y actualizar usuarios normales

### User
- **Acceso básico** solo a su propia información
- **No puede** eliminar usuarios
- **No puede** modificar otros usuarios
- **Solo puede** actualizarse a sí mismo

## 🛠️ Instalación y Configuración

### 1. Inicializar el Rol Superadmin
```bash
npm run init-superadmin
```

### 2. Probar el Sistema
```bash
npm run test-superadmin
```

### 3. Crear un Usuario Superadmin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "email": "superadmin@example.com",
    "password": "password123",
    "role": "superadmin"
  }'
```

## 🔒 Seguridad Implementada

### Middleware de Autenticación
- Verificación de tokens JWT
- Validación de roles en cada operación
- Protección contra acceso no autorizado

### Middleware de Permisos
- Verificación granular de permisos
- Control de acceso basado en roles
- Prevención de escalación de privilegios

### Validaciones
- Verificación de roles antes de operaciones críticas
- Prevención de auto-eliminación
- Validación de jerarquía de roles

## 📋 Endpoints Protegidos

### Usuarios
- `GET /api/users` - Listar usuarios (todos los roles)
- `GET /api/users/:id` - Obtener usuario específico
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - **Solo superadmin**

### Roles
- `GET /api/roles` - Listar roles (público)
- `POST /api/roles` - Crear rol (autenticado)

### Logs
- `GET /api/logs` - Listar logs (autenticado)
- `POST /api/logs` - Crear log (autenticado)
- `PATCH /api/logs/:id` - Actualizar log (autenticado)
- `DELETE /api/logs/:id` - Eliminar log (autenticado)

## 🧪 Pruebas

### Script de Prueba Automatizado
```bash
npm run test-superadmin
```

Este script verifica:
- ✅ Existencia de roles
- ✅ Usuarios y sus roles
- ✅ Matriz de permisos
- ✅ Restricciones de seguridad
- ✅ Estado general del sistema

## 📚 Documentación

- **Documentación completa**: `docs/ROLES_AND_PERMISSIONS.md`
- **Scripts de inicialización**: `scripts/initSuperAdmin.js`
- **Pruebas del sistema**: `testSuperAdmin.js`

## 🚨 Operaciones Críticas

### Eliminación de Usuarios
- **Solo superadmin** puede eliminar usuarios
- **No se puede** eliminar la propia cuenta
- **Admin y user** no pueden eliminar usuarios

### Cambio de Roles
- **Solo superadmin** puede cambiar roles
- **Admin y user** no pueden modificar roles
- **Prevención** de escalación de privilegios

### Actualización de Usuarios
- **Superadmin**: Acceso completo
- **Admin**: Limitado (no superadmins)
- **User**: Solo propio perfil

## 🔍 Monitoreo y Logs

- Todas las operaciones sensibles son registradas
- Sistema de auditoría implementado
- Trazabilidad completa de cambios

## 🎯 Próximos Pasos

1. **Ejecutar** `npm run init-superadmin` para crear el rol
2. **Crear** un usuario superadmin usando el endpoint de registro
3. **Probar** el sistema con `npm run test-superadmin`
4. **Verificar** que las restricciones funcionen correctamente

## 📞 Soporte

Para dudas o problemas con la implementación, revisar:
- Logs del sistema
- Documentación en `docs/ROLES_AND_PERMISSIONS.md`
- Scripts de prueba y diagnóstico
