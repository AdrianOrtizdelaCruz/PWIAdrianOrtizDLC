const jwt = require("jsonwebtoken");

// Middleware para autenticar rutas protegidas
const authenticateToken = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar el usuario decodificado al objeto `req` para uso posterior
    req.user = decoded;
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { authenticateToken };
