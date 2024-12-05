const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createTeam, getTeams } = require("../controllers/teamController");

const router = express.Router();

router.route("/")
  .post(protect, createTeam)  // Crear equipo (requiere autenticación)
  .get(protect, getTeams);   // Listar equipos (requiere autenticación)

module.exports = router;
