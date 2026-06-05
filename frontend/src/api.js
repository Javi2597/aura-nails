const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : '';

export async function getAvailability(date, duration) {
  const res = await fetch(`${API_BASE_URL}/api/availability?date=${date}&duration=${duration}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al obtener disponibilidad.');
  }
  return res.json();
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al crear la reserva.');
  }
  return res.json();
}
