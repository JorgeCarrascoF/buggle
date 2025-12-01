const Joi = require("joi");

const registerSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "string.base": "Full name must be a string.",
    "any.required": "Full name is required.",
  }),
  username: Joi.string().required().regex(/^\S+$/).messages({
    'string.pattern.base': 'Username cannot contain spaces.',
    "string.base": "Username must be a string.",
    "any.required": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email format is invalid.",
    "any.required": "Email is required to register.",
  }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .messages({
      "string.base": "Password must be a string.",
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must include uppercase letters, lowercase letters, numbers, and symbols (!@#$%^&*).",
      "any.required": "Password is required to secure your account.",
    }),
  role: Joi.string().valid("admin", "user", "superadmin").optional().messages({
    "string.base": "Role must be a string.",
    "any.only": "Role is invalid.",
  }),
  roleId: Joi.string().optional().messages({
    "string.base": "Role ID must be a string.",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Email is required to log in.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required to log in.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
