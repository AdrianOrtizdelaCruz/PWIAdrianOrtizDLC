const Team = require("../models/teamModel");

// Controlador para crear un equipo
const createTeam = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Validar los datos de entrada
    if (!name || !members) {
      return res.status(400).json({ error: "Name and members are required" });
    }

    // Crear un nuevo equipo
    const newTeam = await Team.create({ name, members });
    res.status(201).json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    res.status(500).json({ error: "Error creating team" });
  }
};

// Controlador para listar equipos
const listTeams = async (req, res) => {
  try {
    const teams = await Team.find(); // Obtener todos los equipos
    res.status(200).json(teams);    // Responder con los equipos encontrados
  } catch (error) {
    res.status(500).json({ error: "Error listing teams" });
  }
};

module.exports = { createTeam, listTeams };
