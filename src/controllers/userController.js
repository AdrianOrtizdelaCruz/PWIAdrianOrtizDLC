const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validación para contraseña sin caracteres especiales
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(password)) {
      return res.status(400).json({
        error: "La contraseña no puede incluir caracteres especiales.",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Ya existe un usuario registrado con este correo.",
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generar token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      "your_jwt_secret_key", // Usa una clave secreta real y segura
      { expiresIn: "1h" } // Expira en 1 hora
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "your_jwt_secret_key", // Usa una clave secreta real y segura
      { expiresIn: "1h" } // Expira en 1 hora
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };
