const express = require("express");
const { createTeam, listTeams } = require("../controllers/teamController.js");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Ruta para crear un equipo (requiere autenticación)
router.post("/create", authenticateToken, createTeam);

// Ruta para listar equipos (requiere autenticación)
router.get("/list", authenticateToken, listTeams);

module.exports = router;
