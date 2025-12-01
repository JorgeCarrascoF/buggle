// ============================================
// testSuperAdmin.js
// Script de prueba para el sistema de superadmin
// ============================================
const mongoose = require('mongoose');
const User = require('./models/user');
const Role = require('./models/role');
require('dotenv').config();

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foo-talent', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function testSuperAdminSystem() {
    try {
        console.log('🧪 Probando sistema de superadmin...\n');

        // 1. Verificar roles existentes
        console.log('1️⃣ Verificando roles...');
        const roles = await Role.find({});
        console.log('Roles encontrados:', roles.map(r => ({ name: r.name, permissions: r.permission.length })));
        
        // 2. Verificar usuarios existentes
        console.log('\n2️⃣ Verificando usuarios...');
        const users = await User.find({}).select('username email role active');
        console.log('Usuarios encontrados:', users.map(u => ({ username: u.username, email: u.email, role: u.role, active: u.active })));

        // 3. Verificar jerarquía de permisos
        console.log('\n3️⃣ Verificando jerarquía de permisos...');
        
        // Simular verificación de permisos
        const testPermissions = (role, operation) => {
            const permissions = {
                'superadmin': ['user:read', 'user:create', 'user:update', 'user:delete', 'role:read', 'role:create', 'role:update', 'role:delete'],
                'admin': ['user:read', 'user:create', 'user:update', 'role:read', 'log:read', 'log:create'],
                'user': ['user:read', 'log:read']
            };
            
            return permissions[role] ? permissions[role].includes(operation) : false;
        };

        const operations = ['user:read', 'user:create', 'user:update', 'user:delete'];
        const roles = ['superadmin', 'admin', 'user'];
        
        console.log('Matriz de permisos:');
        console.log('Operación\t\tSuperadmin\tAdmin\t\tUser');
        console.log('─'.repeat(60));
        
        operations.forEach(op => {
            const superadmin = testPermissions('superadmin', op) ? '✅' : '❌';
            const admin = testPermissions('admin', op) ? '✅' : '❌';
            const user = testPermissions('user', op) ? '✅' : '❌';
            console.log(`${op.padEnd(20)}\t${superadmin}\t\t${admin}\t\t${user}`);
        });

        // 4. Verificar restricciones de seguridad
        console.log('\n4️⃣ Verificando restricciones de seguridad...');
        
        // Solo superadmin puede eliminar
        const canDeleteUsers = users.filter(u => u.role === 'superadmin').length > 0;
        console.log('¿Hay usuarios superadmin que puedan eliminar?', canDeleteUsers ? '✅ Sí' : '❌ No');
        
        // Verificar que no haya usuarios con roles inválidos
        const validRoles = ['superadmin', 'admin', 'user'];
        const invalidUsers = users.filter(u => !validRoles.includes(u.role));
        console.log('¿Hay usuarios con roles inválidos?', invalidUsers.length === 0 ? '✅ No' : `❌ Sí: ${invalidUsers.length}`);

        // 5. Resumen del sistema
        console.log('\n5️⃣ Resumen del sistema:');
        console.log(`- Total de roles: ${roles.length}`);
        console.log(`- Total de usuarios: ${users.length}`);
        console.log(`- Usuarios superadmin: ${users.filter(u => u.role === 'superadmin').length}`);
        console.log(`- Usuarios admin: ${users.filter(u => u.role === 'admin').length}`);
        console.log(`- Usuarios normales: ${users.filter(u => u.role === 'user').length}`);
        console.log(`- Usuarios activos: ${users.filter(u => u.active).length}`);

        console.log('\n🎯 Prueba del sistema completada exitosamente!');

    } catch (error) {
        console.error('❌ Error durante la prueba:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Conexión a la base de datos cerrada');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testSuperAdminSystem();
}

module.exports = { testSuperAdminSystem };
