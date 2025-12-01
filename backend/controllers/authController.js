// ============================================
// controllers/authController.js
// ============================================
const boom = require('@hapi/boom');
const authService = require('../services/authService');
const { registerSchema } = require('../validations/authSchema');

const register = async (req, res, next) => {
    try {
        const roles = ['superadmin', 'admin'];
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                msg: 'Access denied. Superadmin or Admin role required.',
                userRole: req.user?.role,
                required: roles
            });
        }
        const { error } = registerSchema.validate(req.body, { abortEarly: false });

        if (error) {
            // Extraer los mensajes de error personalizados
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: errorMessages.join(', ')
            });
        }

        const { fullName, username, email, password, role, roleId } = req.body;

        const user = await authService.registerUser({
            fullName,
            username,
            email,
            password,
            role,
            roleId
        });

        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { email: identifier, password } = req.body;

    try {
        const { token, user } = await authService.loginUser(identifier, password);

        // Configurar cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getUserProfile(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const recoverPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: "Email is required to recover password."
            });
        }

        const result = await authService.recoverPassword(email);

        if (!result.success) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: result.message
            });
        }

        res.status(200).json({
            statusCode: 200,
            message: "If the email is registered, a new password has been sent."
        });

    } catch (err) {
        next(err);
    }
};


module.exports = {
    register,
    login,
    logout,
    getProfile,
    recoverPassword,
};