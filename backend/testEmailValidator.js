// testEmailValidator.js
const { validateEmailDomain } = require('./utils/emailValidator');

async function test() {
    const testEmails = [
        'prueba@gmail.com',
        'prueba@example.com',
        'prueba@hotmail.com',
        'prueba@asdasd.com',
        'prueba@exampl123.com',
        'prueba@nonexistentdomain12345.com',
        'prueba@example.org',
        'prueba@test.com'
    ];

    for (const email of testEmails) {
        try {
            await validateEmailDomain(email);
            console.log(`✅ ${email} is valid`);
        } catch (error) {
            console.log(`❌ ${email} is invalid: ${error.message}`);
        }
    }
}

test();