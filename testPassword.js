const bcryptjs = require("bcryptjs");

//Comprueba si el bcryptjs funciona correctamente
const testPassword = async () => {
  const plainPassword = "tutu1"; // Contraseña que intentas
  const hashedPassword = await bcryptjs.hash(plainPassword, 10); // Hash de la BD

  const isMatch = await bcryptjs.compare(plainPassword, hashedPassword);
  console.log("¿Coinciden las contraseñas?", isMatch);
};

testPassword();
