const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET; // Clave para firmar el token

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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: process.env.JWT_SECRET,
      });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };


module.exports = { registerUser, loginUser };
