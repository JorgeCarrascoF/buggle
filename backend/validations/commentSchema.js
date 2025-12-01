const Joi = require('joi');

const createCommentSchema = Joi.object({
    text: Joi.string().required().max(5000).messages({
        'any.required': 'Comment text is required.',
        'string.max': 'Comment text cannot exceed 5000 characters.'
    }),
    logId: Joi.string().required().messages({
        'any.required': 'Log ID is required.',
        'string.base': 'Log ID must be a string.'
    }),
    pinned: Joi.boolean().optional()
});

const updateCommentSchema = Joi.object({
    text: Joi.string().max(5000).optional().messages({
        'string.max': 'Comment text cannot exceed 5000 characters.'
    }),
    logId: Joi.string().optional().messages({
        'string.base': 'Log ID must be a string.'
    }),
    pinned: Joi.boolean().optional()
});

module.exports = {
    createCommentSchema,
    updateCommentSchema
};