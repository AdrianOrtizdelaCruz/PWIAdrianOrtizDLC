const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

// Ruta para registrar usuarios
router.post("/register", registerUser);

// Ruta para iniciar sesión (debes implementar `loginUser` en el controlador)
router.post("/login", loginUser);

module.exports = router;
