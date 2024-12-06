const BASE_URL = "http://localhost:3000/api/users"; // Backend URL

// Registro de usuario
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  // Validar contraseña en el frontend (opcional, para mejorar UX)
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
      alert("Usuario registrado exitosamente. ¡Inicia sesión!");
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
loginForm.addEventListener("submit", async (event) => {
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

