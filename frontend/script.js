const BASE_URL = "http://localhost:3000/api/users"; // Backend URL
const TEAM_URL = "http://localhost:3000/api/teams"; // Backend URL para equipos

// Registro de usuario
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  // Validar contraseña en el frontend para evitar caracteres no permitidos (opcional)
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

// Crear un equipo
const createTeamForm = document.getElementById("createTeamForm");
createTeamForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const teamName = document.getElementById("teamName").value;
  const maxParticipants = document.getElementById("maxParticipants").value;

  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  try {
    const response = await fetch(TEAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Incluir el token en la cabecera
      },
      body: JSON.stringify({
        name: teamName,
        maxParticipants: maxParticipants,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Equipo creado exitosamente!");
      createTeamForm.reset();
      window.location.href = "teams.html"; // Redirige a la página de equipos
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al crear el equipo:", error);
    alert("No se pudo crear el equipo.");
  }
});

// Ver equipos disponibles
const teamList = document.getElementById("teamList");
const fetchTeams = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  try {
    const response = await fetch(TEAM_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Incluir el token en la cabecera
      },
    });

    const teams = await response.json();

    if (response.ok) {
      // Mostrar los equipos en la interfaz
      if (teams.length === 0) {
        teamList.innerHTML = "<li>No hay equipos disponibles.</li>";
      } else {
        teamList.innerHTML = teams
          .map(
            (team) => `
              <li>
                <strong>${team.name}</strong> - ${team.participants.length}/${team.maxParticipants} participantes
                <button onclick="joinTeam('${team._id}')">Unirse</button>
              </li>
            `
          )
          .join("");
      }
    } else {
      alert("Error al cargar los equipos.");
    }
  } catch (error) {
    console.error("Error al cargar los equipos:", error);
    alert("No se pudieron cargar los equipos.");
  }
};

// Unirse a un equipo
const joinTeam = async (teamId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  try {
    const response = await fetch(`${TEAM_URL}/${teamId}/join`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Incluir el token en la cabecera
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Te has unido al equipo exitosamente.");
      fetchTeams(); // Actualiza la lista de equipos
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al unirse al equipo:", error);
    alert("No se pudo unir al equipo.");
  }
};

// Cerrar sesión
const logoutButton = document.getElementById("logoutButton");
logoutButton?.addEventListener("click", () => {
  localStorage.removeItem("token"); // Elimina el token almacenado
  window.location.href = "index.html"; // Redirige al login
});

// Inicializar la página de equipos si estamos en teams.html
if (window.location.pathname === "/teams.html") {
  fetchTeams();
}
