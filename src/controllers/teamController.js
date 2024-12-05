const Team = require("../models/teamModel");

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre del equipo es requerido" });
    }

    const team = new Team({ name, owner: req.user.id });
    await team.save();

    res.status(201).json({ message: "Equipo creado exitosamente", team });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el equipo" });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ owner: req.user.id }); // Filtra equipos del usuario
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener equipos" });
  }
};

module.exports = { createTeam, getTeams };
