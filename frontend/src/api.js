// Simplificamos: Si estamos en Vercel, usamos '/api' como prefijo.
// Si estamos en local, usamos el puerto 5000.
const API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
  ? '/api' 
  : 'http://localhost:5000';

/**
 * Obtiene el estado del servidor y la conexión con Google Calendar.
 */
export async function getStatus() {
  // Nota: Al usar /api/status, Vercel lo redirigirá a tu backend
  const res = await fetch(`${API_BASE_URL}/status`); 
  if (!res.ok) throw new Error('Error al obtener el estado del servidor.');
  return res.json();
}

/**
 * Obtiene las horas disponibles.
 */
export async function getAvailability(date, duration) {
  const res = await fetch(`${API_BASE_URL}/availability?date=${date}&duration=${duration}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al obtener la disponibilidad.');
  }
  return res.json();
}

/**
 * Registra una nueva reserva.
 */
export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al registrar la reserva.');
  }
  return res.json();
}