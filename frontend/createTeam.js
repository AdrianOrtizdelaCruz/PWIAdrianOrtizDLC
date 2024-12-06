const BASE_URL = "http://localhost:3000/api/teams"; // URL del backend
const token = localStorage.getItem("token");

if (!token) {
  alert("No estás autenticado. Inicia sesión para continuar.");
  window.location.href = "index.html"; // Redirigir al login
}

// Función para crear un nuevo equipo
const createTeam = async (event) => {
  event.preventDefault();

  const name = document.getElementById("teamName").value;
  const maxParticipants = document.getElementById("maxParticipants").value;

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
      alert("Equipo creado exitosamente!");
      window.location.href = "teams.html"; // Redirigir al listado de equipos
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error al crear el equipo:", error);
    alert("No se pudo crear el equipo.");
  }
};

// Función para regresar a la página de equipos
const goBack = () => {
  window.location.href = "teams.html";
};

// Agregar evento al formulario de creación
document.getElementById("createTeamForm").addEventListener("submit", createTeam);

// Agregar evento al botón de volver
document.getElementById("backButton").addEventListener("click", goBack);
