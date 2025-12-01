// services/userService.js
const Boom = require('@hapi/boom');
const User = require('../models/user');
const { updateUserSchema } = require('../validations/userSchema');
const { validateEmailDomain } = require("../utils/emailValidator");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
// Opcional: para capturar errores en Sentry antes de forzar crash
// const Sentry = require('../instrument');

const _formatUserData = (user) => {
    if (!user) return null;
    return {
        id: user._id,
        fullName: user.fullName,
        username: user.username || user.userName,
        email: user.email,
        role: user.role || 'user',
        isActive: user.isActive,
        isFirstLogin: user.isFirstLogin,
        roleInfo: user.roleId ? {
            id: user.roleId._id,
            name: user.roleId.name,
            permission: user.roleId.permission
        } : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const getUsersByFilter = async (filters, pagination) => {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const { search, username, email, role, isActive } = filters;

    const query = {};
    if (search) {
        query.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
        ];
    }


    if (username) query.username = username;
    if (email) query.email = email;
    if (role) query.role = role;
    if (isActive !== undefined) {
        const activeValue = isActive === 'true' ? true : isActive === 'false' ? false : isActive;
        query.isActive = activeValue;
    }

    const users = await User.find(query)
        .populate('roleId', 'name permission')
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ lastSeen: -1 });

    const totalUsers = await User.countDocuments(query);

    const formattedUsers = users.map(_formatUserData);

    return { data: formattedUsers, total: totalUsers };
};

const getUserById = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw Boom.badRequest('The provided ID is not valid.');
    }

    const user = await User.findById(userId)
        .populate('roleId', 'name permission')
        .select('-password');

    if (!user) {
        throw Boom.notFound('The requested user could not be found in the system.');
    }

    return _formatUserData(user);
};

/* -------------------------
   VERSIÓN ORIGINAL (correcta)
   (Se deja comentada para referencia)
------------------------- */

const updateUser = async (userId, updateData) => {
    // Validar con Joi
    const { error } = updateUserSchema.validate(updateData);
    if (error) {
        throw Boom.badRequest('One or more fields failed validation.', {
            details: error.details.map((d) => ({
                message: d.message,
                path: d.path.join('.'),
                type: d.type,
            })),
        });
    }

    // Verificar email duplicado y dominio valido
    if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
            throw Boom.badRequest('Invalid email format. Please provide a valid email address.');
        }

        // Validar el dominio del correo
        try {
            await validateEmailDomain(updateData.email);
        } catch (error) {
            throw Boom.badRequest(error.message);
        }

        const emailExists = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
        if (emailExists) {
            throw Boom.conflict('The email address is already associated with another user account.');
        }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    })
        .populate('roleId', 'name permission')
        .select('-password');

    if (!user) {
        throw Boom.notFound('User not found.');
    }

    return _formatUserData(user);
};

/* -------------------------
   deleteUser (sin cambios)
------------------------- */
const deleteUser = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
    ).select('-password');

    if (!user) {
        throw Boom.notFound('User not found. The user may have been deleted or deactivated.');
    }

    return _formatUserData(user);
};

// Función para comparar contraseñas
const comparePassword = async (candidatePassword, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw Boom.notFound('User not found during password comparison.');
    }
    return await user.comparePassword(candidatePassword);
};

// Función para actualizar la contraseña
const updatePassword = async (userId, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw Boom.notFound('User not found. Cannot update password for non-existent user.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    //user.password = newPassword;

    await user.save();

    return _formatUserData(user);
};

const FirstLoginStatus = async (userId, status = false) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw Boom.badRequest('Invalid userID');
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { isFirstLogin: status },
        { new: true },

    )
        .populate('roleId', 'name permission')
        .select('-password');

    if (!user) {
        throw Boom.notFound('User not found');
    }
    return _formatUserData(user);
}

module.exports = {
    getUsersByFilter,
    getUserById,
    updateUser,
    deleteUser,
    comparePassword,
    updatePassword,
    FirstLoginStatus
};
