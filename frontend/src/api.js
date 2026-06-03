const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : ''; // Ruta relativa para producción

export async function getAvailability(date, duration) {
  // Al usar la cadena vacía en producción, la petición será dirigida a /api/...
  const res = await fetch(`${API_BASE_URL}/api/availability?date=${date}&duration=${duration}`);
  // ... resto del código
}