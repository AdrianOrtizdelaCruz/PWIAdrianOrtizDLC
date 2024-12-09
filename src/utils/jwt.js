const jwt = require("jsonwebtoken");

// Función para generar un token
const generateToken = (userId) => {
  // Verificar que la clave secreta está configurada
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno (.env)");
  }

  // Generar y devolver el token firmado con la clave secreta
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Función para verificar un token
const verifyToken = (token) => {
  // Verificar que el token fue proporcionado
  if (!token) {
    throw new Error("Token no proporcionado");
  }

  // Verificar y devolver el contenido decodificado del token
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Lanzar un error más descriptivo basado en la naturaleza del problema
    if (err.name === "TokenExpiredError") {
      throw new Error("El token ha expirado");
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("El token es inválido");
    } else {
      throw new Error("Error al verificar el token");
    }
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
