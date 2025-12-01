const Joi = require('joi');

const createDocumentSchema = Joi.object({
    title: Joi.string().required().max(5000).messages({
        'any.required': 'Document title is required.',
        'string.max': 'Document title cannot exceed 5000 characters.'
    }),
    content: Joi.string().required().messages({
        'any.required': 'Document content is required.'
    }),
    log: Joi.string().required().messages({
        'any.required': 'Log reference is required.',
        'string.base': 'Log ID must be a string.'
    })
});

const updateDocumentSchema = Joi.object({
    title: Joi.string().max(5000).optional().messages({
        'string.max': 'Document title cannot exceed 5000 characters.'
    }),
    content: Joi.string().optional(),
    log: Joi.string().optional().messages({
        'string.base': 'Log ID must be a string.'
    })
});

module.exports = {
    createDocumentSchema,
    updateDocumentSchema
};