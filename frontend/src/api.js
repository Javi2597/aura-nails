// FORZAMOS LA RUTA RELATIVA
// Si detecta 'localhost' en la URL, usa el puerto 5000 (para tu desarrollo local)
// Si NO detecta 'localhost' (producción), usa una cadena vacía (ruta relativa)
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : '';

export async function getAvailability(date, duration) {
  // Al usar `${API_BASE_URL}/api/...`, si estamos en producción, 
  // esto se convierte simplemente en '/api/...'
  const res = await fetch(`${API_BASE_URL}/api/availability?date=${date}&duration=${duration}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al obtener la disponibilidad.');
  }
  return res.json();
}