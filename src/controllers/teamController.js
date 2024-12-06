const Team = require('../models/teamModel');

// Obtener todos los equipos
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("participants", "username");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron cargar los equipos' });
  }
};

// Crear un equipo
const createTeam = async (req, res) => {
  const { name, maxParticipants } = req.body;
  try {
    const team = new Team({ name, maxParticipants });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear el equipo' });
  }
};

// Unirse a un equipo
const joinTeam = async (req, res) => {
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
};

module.exports = { getTeams, createTeam, joinTeam };
