require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const connectDB = require("./src/config/db"); // Conexión a MongoDB

// Importar rutas
const userRoutes = require("./src/routes/userRoutes");
const teamRoutes = require("./src/routes/teamRoutes");

const app = express();
app.use(express.json()); // Middleware para procesar JSON

// Conectar a la base de datos
connectDB();

// Rutas públicas (registro y login)
app.use("/api/users", userRoutes);

// Rutas protegidas (equipos)
app.use("/api/teams", teamRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
