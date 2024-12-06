const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = "claveSuperSecreta"; // Clave para firmar el token

// Registrar un usuario
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar contraseña
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(password)) {
      return res.status(400).json({ error: "La contraseña no puede incluir caracteres especiales." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generar token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ message: "Usuario registrado exitosamente", token });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };


module.exports = { registerUser, loginUser };
