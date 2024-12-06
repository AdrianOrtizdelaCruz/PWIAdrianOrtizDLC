const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Team = require("../models/teamModel");

const router = express.Router();

// Obtener todos los equipos
router.get("/", protect, async (req, res) => {
  const teams = await Team.find().populate("participants", "username");
  res.json(teams);
});

// Crear un equipo
router.post("/", protect, async (req, res) => {
  const { name, maxParticipants } = req.body;
  try {
    const team = new Team({ name, maxParticipants });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el equipo" });
  }
});

// Unirse a un equipo
router.put("/:id/join", protect, async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (team.participants.length >= team.maxParticipants) {
    return res.status(400).json({ error: "El equipo está lleno" });
  }
  if (team.participants.includes(req.user._id)) {
    return res.status(400).json({ error: "Ya estás en este equipo" });
  }
  team.participants.push(req.user._id);
  await team.save();
  res.json(team);
});

module.exports = router;
