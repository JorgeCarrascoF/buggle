// ============================================
// services/authService.js
// ============================================
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");
const User = require("../models/user");
const { sendEmail } = require("../config/email");
const { registrationEmail } = require("../templates/registrationEmail");
const { recoveryPasswordEmail } = require("../templates/recoveryPasswordEmail");
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";
const { validateEmailDomain } = require("../utils/emailValidator");

class AuthService {
  async registerUser(userData) {
    const { fullName, username, email, password, role, roleId } = userData;

    // Validar el dominio del correo
    try {
      await validateEmailDomain(email);
    } catch (error) {
      throw boom.badRequest(error.message);
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ username }, { userName: username }, { email }],
    });

    if (existingUser) {
      if (
        existingUser.username === username ||
        existingUser.userName === username
      ) {
        throw boom.conflict("Username already exists");
      }
      if (existingUser.email === email) {
        throw boom.conflict("Email is already registered");
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validar y configurar el rol
    let finalRoleId = roleId;
    let finalRole = role || "user";

    if (roleId) {
      const Role = require("../models/role");
      const roleExists = await Role.findById(roleId);
      if (!roleExists) {
        throw boom.badRequest("The specified role does not exist");
      }
      // Mapear nombres de roles a códigos internos
      if (roleExists.name === "Administrador") {
        finalRole = "admin";
      } else if (roleExists.name === "SuperAdministrador") {
        finalRole = "superadmin";
      }
    }

    // Crear nuevo usuario
    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role: finalRole,
      roleId: finalRoleId,
      isFirstLogin: true
    });

    await user.save();
    await user.populate("roleId", "name permission");

    // Enviar correo con los datos de registro
    try {
      const emailHtml = registrationEmail({
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        password: password,
      });
      const emailSent = await sendEmail(
        email,
        "Welcome to Buggle!",
        emailHtml
      );
      if (!emailSent) {
        console.warn(`Failed to send welcome email to ${email}`);
      }
    } catch (error) {
      console.error(
        `Unexpected error sending welcome email to ${email}:`,
        error.message
      );
    }

    return {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      roleInfo: user.roleId,
      isFirstLogin: user.isFirstLogin
    };
  }

  async loginUser(identifier, password) {
    // Buscar usuario por username o email
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { userName: identifier },
        { email: identifier },
      ],
    });

    if (!user) {
      console.log("User not found during login attempt");
      throw boom.unauthorized("Authentication failed. Invalid credentials");
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      console.log("User account is inactive");
      throw boom.forbidden("User account is inactive. Please contact the administrator.");
    }


    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password attempt for user:");
      throw boom.unauthorized("Authentication failed. Invalid credentials.");
    }

    // Poblar información del rol
    await user.populate("roleId", "name permission");

    console.log("- User role:", user.role);

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username || user.userName,
        email: user.email,
        role: user.role || "user",
        roleId: user.roleId?._id,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username || user.userName,
        email: user.email,
        role: user.role || "user",
        roleInfo: user.roleId
          ? {
            id: user.roleId._id,
            name: user.roleId.name,
            permission: user.roleId.permission,
          }
          : null,
        isFirstLogin: user.isFirstLogin
      },
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw boom.notFound("User profile not found.");
    }
    return user;
  }

  async recoverPassword(email) {
    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: "No user account is associated with the provided email address." };
    }

    // Generar una nueva contraseña aleatoria
    const newPassword = this.generateRandomPassword();

    // Actualizar la contraseña del usuario
    user.password = await bcrypt.hash(newPassword, 10);
    user.isFirstLogin = true; // Forzar cambio de contraseña en el próximo inicio de sesión
    await user.save();

    // Enviar correo con la nueva contraseña
    try {
      const emailHtml = recoveryPasswordEmail({
        fullName: user.fullName,
        email: user.email,
        newPassword: newPassword,
      });

      const emailSent = await sendEmail(
        user.email,
        "Password Recovery",
        emailHtml
      );

      if (!emailSent) {
        console.warn(`Failed to send recovery email to ${user.email}`);
      }
    } catch (error) {
      console.error(`Unexpected error sending recovery email to ${user.email}:`, error.message);
    }

    return { success: true };
  }

  // Función para generar una contraseña aleatoria
  generateRandomPassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

}

module.exports = new AuthService();
