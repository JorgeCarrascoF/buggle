const Joi = require('joi');

const updateUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'Full name must be a text string.',
        'string.min': 'Full name must be at least 3 characters long.',
        'string.max': 'Full name cannot exceed 100 characters.'
    }),
    username: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'Username must be a string.',
        'string.min': 'Username must be at least 3 characters long.',
        'string.max': 'Username must be at most 50 characters long.'
    }),
    password: Joi.string().min(8).optional().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')).messages({
        'string.base': 'Password must be a string.',
        'string.min': 'Password must be at least 8 characters long.',
        'string.pattern.base': 'Password must include uppercase letters, lowercase letters, numbers, and symbols (!@#$%^&*).'
    }),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: false } // Permite dominios personalizados
    }).optional().messages({
        'string.email': 'Email address is not valid. Please enter a correct format.'
    }),
    role: Joi.string().valid('superadmin', 'admin', 'user').optional().messages({
        'any.only': 'Role must be one of the following: superadmin, admin, user.'
    }),
    isFirstLogin: Joi.boolean().optional(),
    roleId: Joi.string().optional(),
    isActive: Joi.boolean().optional()
});

module.exports = {
    updateUserSchema
};
