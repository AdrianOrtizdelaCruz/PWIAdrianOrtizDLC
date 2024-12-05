require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // Para servir archivos estáticos desde frontend

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/miBaseDeDatos"; // Obtiene la URI de la DB desde el archivo .env o usa la URI por defecto
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Sale del proceso si no se puede conectar a la DB
  });

// Importar rutas
const userRoutes = require("./src/routes/userRoutes");
const teamRoutes = require("./src/routes/teamRoutes");

const app = express();

// Habilitar CORS para permitir peticiones desde diferentes dominios
app.use(cors());

// Middleware para procesar JSON
app.use(express.json());

// Rutas para la API de usuarios y equipos
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);

// Servir archivos estáticos desde la carpeta "frontend"
app.use(express.static(path.join(__dirname, "frontend")));

// Ruta para servir el archivo principal del frontend (index.html)
// Cualquier ruta no reconocida será redirigida a la página principal del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
