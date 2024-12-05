const BASE_URL = "http://localhost:3000/api/teams";

// Obtener el token del almacenamiento local
const token = localStorage.getItem("token");

if (!token) {
  alert("Debes iniciar sesión para acceder a esta página.");
  window.location.href = "index.html"; // Redirige al login si no hay token
}

// Función para cargar los equipos
const loadTeams = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      const teamsList = document.getElementById("teamsList");
      teamsList.innerHTML = ""; // Limpia la lista antes de cargar

      data.teams.forEach((team) => {
        const li = document.createElement("li");
        li.textContent = team.name;
        teamsList.appendChild(li);
      });
    } else {
      alert(`Error al cargar equipos: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al cargar equipos:", error);
    alert("Hubo un problema al cargar los equipos.");
  }
};

// Función para crear un equipo
const createTeamForm = document.getElementById("createTeamForm");
createTeamForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const teamName = document.getElementById("teamName").value;

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: teamName }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Equipo creado exitosamente!");
      createTeamForm.reset();
      loadTeams(); // Recargar la lista de equipos
    } else {
      alert(`Error al crear equipo: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al crear equipo:", error);
    alert("Hubo un problema al crear el equipo.");
  }
});

// Función para cerrar sesión
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token"); // Eliminar token del almacenamiento local
  window.location.href = "index.html"; // Redirigir al login
});

// Cargar equipos al cargar la página
loadTeams();
