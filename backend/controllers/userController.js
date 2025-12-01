// controllers/userController.js
const userService = require("../services/userServices");
const { updateUserSchema } = require("../validations/userSchema");
const mongoose = require("mongoose");
const Boom = require("@hapi/boom");
const User = require("../models/user");

// Las definiciones de Swagger no cambian, por lo que se omiten por brevedad...
const Sentry = require("../instrument"); // Importar Sentry

const getUsersByFilter = async (req, res) => {
  try {
    // Solo superadmin, admin y usuarios pueden ver la lista de usuarios
    if (!["superadmin", "admin", "user"].includes(req.user.role)) {
      return res.status(403).json({
        msg: "Access denied. Unauthorized role.",
      });
    }

    const filters = {
      username: req.query.username,
      email: req.query.email,
      role: req.query.role,
      isActive: req.query.isActive ?? "true",
      search: req.query.search,
    };
    const pagination = {
      limit: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
    };

    const { data, total } = await userService.getUsersByFilter(
      filters,
      pagination
    );

    res.status(200).json({
      success: true,
      page: pagination.page,
      limit: pagination.limit,
      count: data.length,
      total: total,
      data: data,
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error in controller getUsersByFilter:", err);
    res
      .status(500)
      .json({
        msg: "Server error while filtering users",
        error: err.message,
      });
  }
};
// 
const getUserById = async (req, res) => {
  try {
    // Validar formato del ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }
    // Superadmin puede ver cualquier usuario
    // Admin puede ver cualquier usuario
    // Usuario normal solo puede verse a sí mismo
    if (req.user.role === "user" && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: "Access denied." });
    }

    const user = await userService.getUserById(req.params.id);
    // Enviar respuesta HTTP
    res.status(200).json(user);
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error in controller getUserById:", err);
    if (err.message === "User not found.") {
      return res.status(404).json({ msg: err.message });
    }
    res
      .status(500)
      .json({
        msg: "Server error while retrieving user",
        error: err.message,
      });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Solo superadmin puede actualizar cualquier usuario
    // Admin solo puede actualizar usuarios que no sean superadmin
    // Usuario normal solo puede actualizarse a sí mismo
    if (req.user.role === "user" || req.user.role === "admin" && req.user.id !== id) {
      return res
        .status(403)
        .json({ msg: "Access denied to update this user." });
    }

    if (req.user.role === "admin") {
      // Verificar que no esté intentando actualizar a un superadmin
      const targetUser = await userService.getUserById(id);
      if (targetUser.role === "superadmin") {
        return res
          .status(403)
          .json({
            msg: "Administrators cannot modify superadmin users.",
          });
      }
    }

    // Solo superadmin puede cambiar roles
    if (req.user.role !== "superadmin") {
      delete updateData.role;
      delete updateData.roleId;
    }

    const updatedUser = await userService.updateUser(id, updateData);

    res.status(200).json({
      msg: "User updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error in controller updateUser:", err);
    if (err.isBoom) {
      // Todos los errores ahora son Boom
      return res.status(err.output.statusCode).json({
        msg: err.output.payload.message,
        details: err.data?.details,
      });
    }
    // Error genérico (no debería ocurrir si todo está bien)
    res.status(500).json({
      msg: "Server error while updating user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Solo superadmin puede eliminar usuarios
    if (req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({
          msg: "Only superadmins can delete users.",
        });
    }

    // Verificar que no se esté eliminando a sí mismo
    if (req.user.id === req.params.id) {
      return res
        .status(400)
        .json({ msg: "You cannot delete your own account." });
    }

    const deletedUser = await userService.deleteUser(req.params.id);

    res.status(200).json({
      msg: "User deleted successfully.",
      deletedUser: deletedUser,
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error in controller deleteUser:", err);
    if (err.message === "User not found.") {
      return res.status(404).json({ msg: err.message });
    }
    res
      .status(500)
      .json({
        msg: "Server error while deleting user",
        error: err.message,
      });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    // Validar que se proporcionen las contraseñas
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          msg: "You must provide the current password and the new password.",
        });
    }

    // Validar que la nueva contraseña cumpla con los requisitos
    const { error } = updateUserSchema.validate({ password: newPassword });
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    // Verificar que la contraseña actual es correcta
    const user = await userService.getUserById(id);
    const isMatch = await userService.comparePassword(currentPassword, id);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Current password is incorrect." });
    }

    // Update the password
    await userService.updatePassword(id, newPassword);

    res.status(200).json({ msg: "Password changed successfully." });
  } catch (err) {
    console.error("Error in controller changePassword:", err);
    if (err.isBoom) {
      return res.status(err.output.statusCode).json({
        msg: err.output.payload.message,
        details: err.data?.details,
      });
    }
    res
      .status(500)
      .json({
        msg: "Server error while changing password",
        error: err.message,
      });
  }
};

const firstLoginWithoutProtection = async (req, res) => {
  try{
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await userService.FirstLoginStatus(id, status ?? false);

    if (!updatedUser){
      return res.status(404).json({message: "User not found"});
    }

    res.status(200).json({
      message: "First Login updated successfully",
      user: updatedUser
    });
  }
  catch(err){
    console.error("Error first login", err);
    res.status(500).json({message: "Server error", error: err.message});
  }
};

module.exports = {
  getUsersByFilter,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  firstLoginWithoutProtection
};
