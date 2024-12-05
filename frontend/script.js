const BASE_URL = "http://localhost:3000/api/users"; // Backend URL

// Registro de usuario
const registerForm = document.getElementById("registerForm");
registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  // Validar contraseña en el frontend (sin caracteres especiales)
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
  if (specialCharRegex.test(password)) {
    alert("La contraseña no puede incluir caracteres especiales.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Usuario registrado exitosamente!");
      registerForm.reset();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    alert("No se pudo registrar el usuario.");
  }
});

// Login de usuario
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Login exitoso!");
      localStorage.setItem("token", data.token); // Guardar el token en localStorage
      loginForm.reset();
      window.location.href = "teams.html"; // Redirige a la página de gestión de equipos
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    alert("No se pudo iniciar sesión.");
  }
});

// Botón de prueba para una ruta protegida (opcional)
const protectedButton = document.getElementById("protectedButton");
protectedButton?.addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/protected-route`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert(`Acceso exitoso: ${JSON.stringify(data)}`);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    alert("No se pudo acceder a la ruta protegida.");
  }
});
