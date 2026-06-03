const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Obtiene el estado del servidor y la conexión con Google Calendar.
 */
export async function getStatus() {
  const res = await fetch(`${API_BASE_URL}/api/status`);
  if (!res.ok) throw new Error('Error al obtener el estado del servidor.');
  return res.json();
}

/**
 * Obtiene las horas disponibles para una fecha y duración.
 * @param {string} date Formato 'YYYY-MM-DD'
 * @param {number} duration minutos
 */
export async function getAvailability(date, duration) {
  const res = await fetch(`${API_BASE_URL}/api/availability?date=${date}&duration=${duration}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al obtener la disponibilidad.');
  }
  return res.json();
}

/**
 * Registra una nueva reserva.
 * @param {Object} bookingData
 */
export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al registrar la reserva.');
  }
  return res.json();
}
