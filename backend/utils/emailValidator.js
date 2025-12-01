// utils/emailValidator.js
const dns = require('dns').promises;

const TEST_DOMAINS = new Set([
    'example.com',
    'example.org',
    'example.net',
    'test.com',
    'invalid.com',
]);

async function validateEmailDomain(email) {
    const domain = email.split('@')[1];
    if (!domain) {
        throw new Error('Invalid email format');
    }

    // Verifica si el dominio está en la lista de dominios de prueba
    if (TEST_DOMAINS.has(domain.toLowerCase())) {
        throw new Error(`Domain ${domain} is a test domain and does not accept emails`);
    }

    try {
        // Resuelve los registros MX del dominio con un tiempo de espera de 5 segundos
        const records = await Promise.race([
            dns.resolveMx(domain),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('DNS resolution timeout')), 5000)
            )
        ]);

        // Si no hay registros MX, el dominio no acepta correos
        if (!records || records.length === 0) {
            throw new Error(`Domain ${domain} does not accept emails`);
        }

        return true;
    } catch (error) {
        // Si hay un error al resolver el DNS, el dominio no es válido
        throw new Error(`Domain ${domain} is not a valid email domain: ${error.message}`);
    }
}

module.exports = { validateEmailDomain };