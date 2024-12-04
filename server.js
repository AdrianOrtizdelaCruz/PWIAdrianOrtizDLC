const express = require("express");
const mongoose = require("mongoose");

// URI de conexión a MongoDB
const MONGO_URI = "mongodb://localhost:27017/miBaseDeDatos"; // Para una base local
// const MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority"; // MongoDB Atlas

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Salir del proceso si falla la conexión
  }
};

// Importar rutas
const userRoutes = require("./src/routes/userRoutes");
const teamRoutes = require("./src/routes/teamRoutes");

const app = express();
app.use(express.json()); // Middleware para procesar JSON

// Conectar a la base de datos
connectDB();

// Ruta para la página principal
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Competiciones Académicas!");
});

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
const PORT = 3000; // Define el puerto directamente
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
