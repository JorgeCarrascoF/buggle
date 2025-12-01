const Boom = require('@hapi/boom');
const urlService = require('../services/urlService');
const { checkUrlSchema } = require('../validations/urlSchema');

const checkUrl = async (req, res, next) => {
    console.log('Solicitud recibida en checkUrl'); // Depuración
    try {
        const { error } = checkUrlSchema.validate(req.body);
        if (error) {
            throw Boom.badRequest(error.details[0].message);
        }

        const { url } = req.body;
        console.log(`Verificando URL: ${url}`); // Depuración
        const isValid = await urlService.isUrlValid(url);

        res.json({
            success: true,
            isValid
        });
    } catch (err) {
        next(err);
    }
};


module.exports = { checkUrl };
