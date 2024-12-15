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
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      console.log("Equipo no encontrado con ID:", req.params.id);
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    if (team.participants.length >= team.maxParticipants) {
      console.log("El equipo está lleno:", team.name);
      return res.status(400).json({ error: "El equipo está lleno" });
    }

    if (team.participants.some((participant) => participant.toString() === req.user._id.toString())) {
      console.log("Usuario ya está en el equipo:", req.user._id);
      return res.status(400).json({ error: "Ya estás en este equipo" });
    }

    // Agregar usuario al equipo
    team.participants.push(req.user._id);
    await team.save();

    console.log("Usuario añadido al equipo:", { userId: req.user._id, teamId: team._id });
    res.json(team);
  } catch (error) {
    console.error("Error en el backend al unirse al equipo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



module.exports = { getTeams, createTeam, joinTeam };
