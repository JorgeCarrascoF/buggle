const Joi = require('joi');

const checkUrlSchema = Joi.object({
    url: Joi.string()
        .uri()
        .required()
        .messages({
            'string.base': 'URL must be a string',
            'string.uri': 'Invalid URL format',
            'any.required': 'URL is required'
        })
});

module.exports = { checkUrlSchema };
