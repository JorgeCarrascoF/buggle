const fetch = require('node-fetch');

async function isUrlValid(url) {
    try {
        // Solo verificar si la URL tiene un formato válido y es accesible
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual', // No seguir redirecciones automáticamente
            timeout: 3000,     // Timeout de 3 segundos
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

module.exports = { isUrlValid };
