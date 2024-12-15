const BASE_URL = "http://localhost:3000/api/teams"; // URL del backend
const token = localStorage.getItem("token"); // Obtener token del almacenamiento local

// Si no hay token, redirigir al login
if (!token) {
  alert("No estás autenticado. Inicia sesión para continuar.");
  window.location.href = "index.html"; // Redirigir al login
}

// Función para cargar los equipos desde la base de datos
const loadTeams = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
      },
    });

    const data = await response.json();

    // Si no se pueden cargar los equipos, mostrar mensaje
    if (!response.ok || !data || data.length === 0) {
      document.getElementById("teamsList").innerHTML = "<p>No se encontraron equipos. Crea uno o espera que se agreguen más.</p>";
      return;
    }

    // Mostrar los equipos en el DOM
    const teamsList = document.getElementById("teamsList");
    teamsList.innerHTML = ""; // Limpiar contenido previo
    data.forEach((team) => {
      const teamElement = document.createElement("div");
      teamElement.classList.add("team");

      const participants = team.participants.map((p) => p.username).join(", ");
      teamElement.innerHTML = `
        <h3>${team.name}</h3>
        <p>Capacidad: ${team.participants.length}/${team.maxParticipants}</p>
        <p>Participantes: ${participants || "Ninguno aún"}</p>
        <button class="joinTeamButton" data-id="${team._id}" 
        ${team.participants.length >= team.maxParticipants ? "disabled" : ""}>
          ${team.participants.length >= team.maxParticipants ? "Equipo lleno" : "Unirse al equipo"}
        </button>
      `;

      teamsList.appendChild(teamElement);
    });

    // Agregar evento a los botones de unirse al equipo
    document.querySelectorAll(".joinTeamButton").forEach((button) => {
      button.addEventListener("click", (e) => joinTeam(e.target.dataset.id));
    });
  } catch (error) {
    console.error("Error al cargar los equipos:", error);
    document.getElementById("teamsList").innerHTML = "<p>No se pudieron cargar los equipos, verifica tu conexión o tu token.</p>";
  }
};

// Función para unirse a un equipo
const joinTeam = async (teamId) => {
  try {
    const response = await fetch(`${BASE_URL}/${teamId}/join`, {
      method: "PUT", // Cambiado a PUT (verifica que coincida con tu backend)
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error del servidor:", data.error);
      alert(data.error || "Error al unirse al equipo");
      return;
    }

    alert("¡Te has unido al equipo exitosamente!");
    loadTeams(); // Recargar los equipos
  } catch (error) {
    console.error("Error al unirse al equipo:", error);
    alert("No se pudo unir al equipo, intenta de nuevo más tarde.");
  }
};


// Función para redirigir a la página de creación de equipos
const redirectToCreateTeam = () => {
  window.location.href = "createTeam.html"; // Redirige a la página de creación
};

// Agregar evento al botón de crear equipo
document.getElementById("createTeamButton").addEventListener("click", redirectToCreateTeam);

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem("token"); // Eliminar token del almacenamiento local
  window.location.href = "index.html"; // Redirigir al login
};

// Agregar evento al botón de cerrar sesión
document.getElementById("logoutButton").addEventListener("click", logout);

// Cargar equipos al iniciar la página
document.addEventListener("DOMContentLoaded", loadTeams);
