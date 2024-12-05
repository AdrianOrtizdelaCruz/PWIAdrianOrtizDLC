const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  try {
    // Verifica si el token viene en el encabezado Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Obtiene el token (remueve el prefijo 'Bearer ')
      token = req.headers.authorization.split(" ")[1];

      // Verifica y decodifica el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca el usuario basado en el ID en el payload del token
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Continua con la siguiente función/middleware
    } else {
      return res.status(401).json({ error: "No autorizado, token faltante" });
    }
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(401).json({ error: "No autorizado, token inválido" });
  }

  if (!token) {
    return res.status(401).json({ error: "No autorizado, token faltante" });
  }
};

module.exports = { protect };
