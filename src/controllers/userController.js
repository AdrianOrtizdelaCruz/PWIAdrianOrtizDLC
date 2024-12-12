const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // Para generar UUIDs únicos
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET; // Clave secreta para firmar el token

// Función para verificar contraseña
const verifyPassword = async (enteredPassword, storedHash) => {
  try {
    return await bcryptjs.compare(enteredPassword, storedHash);
  } catch (error) {
    console.error("Error al verificar la contraseña:", error);
    throw error;
  }
};

// Registrar un usuario
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Contraseña antes del hash:", password);
    console.log("Contraseña después del hash:", hashedPassword);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();

    console.log("Usuario registrado:", newUser);

    // Devolver una respuesta
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Intento de inicio de sesión:", { email, password });

    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("Usuario no encontrado con ese email:", email);
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    console.log("Usuario encontrado:", user);

    // Comparar la contraseña
    const isPasswordMatch = await verifyPassword(password, user.password);
    console.log("¿Contraseña correcta?:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar un token único para este inicio de sesión
    const token = jwt.sign(
      { id: user._id, jti: uuidv4() }, // Incluye un identificador único
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token generado:", token);

    // Devolver una respuesta con el token
    res.status(200).json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };
