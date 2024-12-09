const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const path = require("path"); // Para servir archivos estáticos
const cors = require("cors");
const teamRoutes = require("./src/routes/teamRoutes");
const userRoutes = require("./src/routes/userRoutes");


const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/miBaseDeDatos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// Rutas
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);

// Servir archivos estáticos desde la carpeta "frontend"
app.use(express.static(path.join(__dirname, "frontend")));

// Ruta para servir el archivo principal del frontend (index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
