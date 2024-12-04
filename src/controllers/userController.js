const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Controlador para registrar usuarios
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar que todos los campos estén presentes
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

// Controlador para iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar que los campos requeridos estén presentes
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Buscar al usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error during login" });
  }
};

module.exports = { registerUser, loginUser };
