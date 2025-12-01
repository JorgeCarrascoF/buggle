const Boom = require('@hapi/boom');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: errorMessages.join(', ')
            });
        }
        next();
    };
};

module.exports = validate;