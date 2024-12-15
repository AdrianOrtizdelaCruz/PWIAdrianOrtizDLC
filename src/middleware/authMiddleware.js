const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const env = require("dotenv").config(); // Esto debe estar al principio del archivo.

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET no está definido. Verifica el archivo .env.");
        return res.status(500).json({ error: "Error del servidor: clave secreta no definida" });
      }

      try {
        // Validación del token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Busca al usuario asociado al ID del token
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
          return res.status(401).json({ error: "Usuario no encontrado" });
        }

        next(); // El token es válido, continúa con la siguiente función
      } catch (error) {
        // Manejo de errores específicos de JWT
        if (error.name === "TokenExpiredError") {
          console.error("Token expirado");
          return res.status(401).json({ error: "Token expirado" });
        } else if (error.name === "JsonWebTokenError") {
          console.error("Token inválido");
          return res.status(401).json({ error: "Token inválido" });
        } else {
          console.error("Error al verificar el token:", error.message);
          return res.status(401).json({ error: "No autorizado" });
        }
      }
    } else {
      return res.status(401).json({ error: "No autorizado, token faltante" });
    }
  } catch (error) {
    console.error("Error de autenticación:", error.message);
    return res.status(401).json({ error: "No autorizado, token inválido" });
  }
};

module.exports = { protect };
