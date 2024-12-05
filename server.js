const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // Importa path para manejar rutas de sistema

// Conexión a MongoDB
const MONGO_URI = "mongodb://localhost:27017/miBaseDeDatos";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

const userRoutes = require("./src/routes/userRoutes");
const teamRoutes = require("./src/routes/teamRoutes");

const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para procesar JSON
app.use(express.json());

// Rutas para API
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);

// Servir archivos estáticos desde la carpeta "frontend"
app.use(express.static(path.join(__dirname, "frontend")));

// Ruta para servir el archivo principal del frontend (index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
