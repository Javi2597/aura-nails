// api.js
// Si estamos en localhost, usamos el puerto 5000, sino usamos la ruta relativa '/'
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : ''; 

export async function getAvailability(date, duration) {
  // Al usar API_BASE_URL (que será '' en producción), la URL resultante será /api/...
  const res = await fetch(`${API_BASE_URL}/api/availability?date=${date}&duration=${duration}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al obtener la disponibilidad.');
  }
  return res.json();
}