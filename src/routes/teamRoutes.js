const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Middleware de autenticación
const Team = require("../models/teamModel");

const router = express.Router();

// Obtener todos los equipos
router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find().populate("participants", "username"); // Obtener equipos con participantes
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los equipos" });
  }
});

// Crear un equipo
router.post("/", protect, async (req, res) => {
  const { name, maxParticipants } = req.body;

  try {
    // Crear nuevo equipo
    const team = new Team({ name, maxParticipants });
    await team.save();
    res.status(201).json(team); // Respuesta con el equipo creado
  } catch (error) {
    res.status(400).json({ error: "Error al crear el equipo" });
  }
});

// Unirse a un equipo
router.put("/:id/join", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    if (team.participants.length >= team.maxParticipants) {
      return res.status(400).json({ error: "El equipo está lleno" });
    }

    if (team.participants.includes(req.user._id)) {
      return res.status(400).json({ error: "Ya estás en este equipo" });
    }

    team.participants.push(req.user._id);
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Error al unirse al equipo" });
  }
});


// Buscar equipos por nombre o participante
// Buscar equipos por nombre o participante
router.get("/search", protect, async (req, res) => {
  const { name } = req.query;

  try {
    // Si no hay término de búsqueda, devolver todos los equipos
    if (!name) {
      const allTeams = await Team.find().populate("participants", "username");
      return res.json(allTeams);
    }

    // Realizar búsqueda con agregación para incluir nombres de participantes
    const teams = await Team.aggregate([
      {
        $lookup: {
          from: "users", // Nombre de la colección de usuarios en MongoDB
          localField: "participants",
          foreignField: "_id",
          as: "participantsData",
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: name, $options: "i" } }, // Coincidencia en el nombre del equipo
            { "participantsData.username": { $regex: name, $options: "i" } }, // Coincidencia en nombre del participante
          ],
        },
      },
      {
        $project: {
          name: 1,
          maxParticipants: 1,
          participants: "$participantsData",
        },
      },
    ]);

    res.json(teams);
  } catch (error) {
    console.error("Error al buscar equipos:", error);
    res.status(500).json({ error: "Error al buscar equipos" });
  }
});

module.exports = router;
