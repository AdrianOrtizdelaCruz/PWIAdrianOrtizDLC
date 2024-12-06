const BASE_URL = "http://localhost:3000/api/teams";
const token = localStorage.getItem("token"); // Obtén el token al cargar el archivo

// Verificar si hay token almacenado
if (!token) {
  alert("Debes iniciar sesión primero.");
  window.location.href = "index.html"; // Redirigir a la página de login si no hay token
}

// Cargar equipos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  loadTeams();
});

// Función para cargar equipos
async function loadTeams() {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const teams = await response.json();
    if (response.ok) {
      const teamsContainer = document.getElementById("teamsContainer");
      teamsContainer.innerHTML = "";

      teams.forEach((team) => {
        const teamElement = document.createElement("div");
        teamElement.className = "team";
        teamElement.innerHTML = `
          <h3>${team.name}</h3>
          <p>Capacidad: ${team.maxParticipants}</p>
          <p>Miembros actuales: ${team.participants.length}</p>
          <p>Puntuación: ${team.score}</p>
          <button onclick="joinTeam('${team._id}')">Unirse</button>
        `;
        teamsContainer.appendChild(teamElement);
      });
    } else {
      alert(`Error: ${teams.error}`);
    }
  } catch (error) {
    console.error("Error al cargar equipos:", error);
  }
}

// Función para unirse a un equipo
async function joinTeam(teamId) {
  try {
    const response = await fetch(`${BASE_URL}/${teamId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Te has unido al equipo exitosamente.");
      loadTeams();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al unirse al equipo:", error);
  }
}

// Función para crear un equipo
document.getElementById("createTeamForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("teamName").value;
  const maxParticipants = parseInt(document.getElementById("maxParticipants").value, 10);

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, maxParticipants }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Equipo creado exitosamente.");
      loadTeams();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al crear el equipo:", error);
  }
});

// Función para cerrar sesión
document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("token");
  alert("Has cerrado sesión.");
  window.location.href = "index.html";
});
