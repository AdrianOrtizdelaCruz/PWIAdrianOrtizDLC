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
      `;

      teamsList.appendChild(teamElement);
    });
  } catch (error) {
    console.error("Error al cargar los equipos:", error);
    document.getElementById("teamsList").innerHTML = "<p>No se pudieron cargar los equipos, verifica tu conexión o tu token.</p>";
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
