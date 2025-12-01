// ============================================
// scripts/initSuperAdmin.js
// Script para inicializar el rol de superadmin
// ============================================
const mongoose = require('mongoose');
const Role = require('../models/role');
const User = require('../models/user');
require('dotenv').config();

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foo-talent', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function initializeSuperAdmin() {
    try {
        console.log('🔧 Inicializando rol de superadmin...');

        // Crear el rol de superadmin si no existe
        let superAdminRole = await Role.findOne({ name: 'SuperAdministrador' });
        
        if (!superAdminRole) {
            superAdminRole = new Role({
                name: 'SuperAdministrador',
                permission: [
                    'user:read',
                    'user:create', 
                    'user:update',
                    'user:delete',
                    'role:read',
                    'role:create',
                    'role:update',
                    'role:delete',
                    'log:read',
                    'log:create',
                    'log:update',
                    'log:delete'
                ]
            });
            await superAdminRole.save();
            console.log('✅ Rol SuperAdministrador creado exitosamente');
        } else {
            console.log('ℹ️  Rol SuperAdministrador ya existe');
        }

        // Verificar si ya existe un usuario superadmin
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
        
        if (!existingSuperAdmin) {
            console.log('⚠️  No se encontró ningún usuario superadmin');
            console.log('💡 Para crear un usuario superadmin, usa el endpoint de registro con role: "superadmin"');
        } else {
            console.log('✅ Usuario superadmin encontrado:', existingSuperAdmin.email);
        }

        console.log('🎯 Inicialización completada');
        
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Conexión a la base de datos cerrada');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initializeSuperAdmin();
}

module.exports = { initializeSuperAdmin };
