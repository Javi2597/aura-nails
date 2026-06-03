import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

// Configuración del salón
const BUSINESS_HOURS = {
  start: 9, // 09:00 AM
  end: 18,  // 06:00 PM (El último turno debe terminar a las 18:00 o antes)
  days: [1, 2, 3, 4, 5, 6] // Lunes (1) a Sábado (6)
};

// Zona horaria por defecto (ajustable)
const TIMEZONE = process.env.TIMEZONE || 'America/Argentina/Buenos_Aires';

// Modo Simulación si faltan credenciales
const isConfigured = clientId && clientSecret && refreshToken &&
                     !clientId.includes('tu_google') &&
                     !clientSecret.includes('tu_google') &&
                     !refreshToken.includes('tu_google');

if (!isConfigured) {
  console.log('\n================================================================');
  console.log('⚠️ ADVERTENCIA: Google Calendar no está configurado.');
  console.log('El backend se está ejecutando en MODO DE SIMULACIÓN.');
  console.log('Las reservas se guardarán temporalmente en memoria local.');
  console.log('Para conectar tu cuenta real, sigue las instrucciones del README.');
  console.log('================================================================\n');
}

// Estructura en memoria para simular reservas
const mockBookings = [
  // Reservas simuladas iniciales para probar que bloquea horarios
  {
    name: 'Sofía Pérez',
    service: 'Manicura',
    date: new Date().toISOString().split('T')[0], // hoy
    time: '10:00',
    duration: 60
  },
  {
    name: 'María Gómez',
    service: 'Nail Art',
    date: new Date().toISOString().split('T')[0], // hoy
    time: '14:30',
    duration: 90
  }
];

let oauth2Client = null;

function getAuthClient() {
  if (!isConfigured) {
    return null;
  }
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
  }
  return oauth2Client;
}

/**
 * Obtiene los eventos ocupados de un día específico en el calendario.
 * @param {string} dateStr Formato 'YYYY-MM-DD'
 * @returns {Promise<Array<{start: Date, end: Date}>>}
 */
export async function getBusySlots(dateStr) {
  if (!isConfigured) {
    // Modo Simulación: filtrar las reservas simuladas en memoria para esa fecha
    return mockBookings
      .filter(b => b.date === dateStr)
      .map(b => {
        const start = new Date(`${b.date}T${b.time}:00`);
        const end = new Date(start.getTime() + b.duration * 60 * 1000);
        return { start, end };
      });
  }

  const auth = getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  const timeMin = new Date(`${dateStr}T00:00:00`).toISOString();
  const timeMax = new Date(`${dateStr}T23:59:59`).toISOString();

  const response = await calendar.events.list({
    calendarId: calendarId,
    timeMin: timeMin,
    timeMax: timeMax,
    singleEvents: true,
    orderBy: 'startTime'
  });

  const events = response.data.items || [];
  
  return events
    .filter(event => {
      if (event.status === 'cancelled') return false;
      if (event.transparency === 'transparent') return false;
      return true;
    })
    .map(event => {
      const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(`${event.start.date}T00:00:00`);
      const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(`${event.end.date}T23:59:59`);
      return { start, end };
    });
}

/**
 * Obtiene los horarios disponibles para una fecha y duración de servicio específicas.
 * @param {string} dateStr Formato 'YYYY-MM-DD'
 * @param {number} durationMinutes Duración del servicio en minutos
 * @returns {Promise<Array<string>>} Lista de horas disponibles en formato 'HH:MM'
 */
export async function getAvailableSlots(dateStr, durationMinutes = 60) {
  const dateObj = new Date(`${dateStr}T12:00:00`);
  const dayOfWeek = dateObj.getDay();

  // Verificar si es un día laborable
  if (!BUSINESS_HOURS.days.includes(dayOfWeek)) {
    return [];
  }

  let busySlots = [];
  try {
    busySlots = await getBusySlots(dateStr);
  } catch (error) {
    console.error('Error al obtener eventos de Google Calendar:', error);
    throw error;
  }

  const availableSlots = [];
  const startHour = BUSINESS_HOURS.start;
  const endHour = BUSINESS_HOURS.end;
  
  const currentSlotTime = new Date(`${dateStr}T${String(startHour).padStart(2, '0')}:00:00`);
  const endLimit = new Date(`${dateStr}T${String(endHour).padStart(2, '0')}:00:00`);
  
  const now = new Date();

  while (currentSlotTime.getTime() + durationMinutes * 60 * 1000 <= endLimit.getTime()) {
    const slotStart = new Date(currentSlotTime);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

    // Si es hoy, filtrar slots del pasado
    if (slotStart.getTime() > now.getTime()) {
      const isOverlapping = busySlots.some(busy => {
        return slotStart.getTime() < busy.end.getTime() && slotEnd.getTime() > busy.start.getTime();
      });

      if (!isOverlapping) {
        const hh = String(slotStart.getHours()).padStart(2, '0');
        const mm = String(slotStart.getMinutes()).padStart(2, '0');
        availableSlots.push(`${hh}:${mm}`);
      }
    }

    currentSlotTime.setMinutes(currentSlotTime.getMinutes() + 30);
  }

  return availableSlots;
}

/**
 * Registra una reserva.
 * @param {Object} booking
 * @returns {Promise<Object>} Evento creado o simulado
 */
export async function createCalendarEvent({ name, whatsapp, service, date, time, duration }) {
  const startDateTime = new Date(`${date}T${time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

  // Validar traslape
  const busySlots = await getBusySlots(date);
  const isOverlapping = busySlots.some(busy => {
    return startDateTime.getTime() < busy.end.getTime() && endDateTime.getTime() > busy.start.getTime();
  });

  if (isOverlapping) {
    throw new Error('El horario seleccionado ya no está disponible. Por favor elige otro.');
  }

  if (!isConfigured) {
    // Modo Simulación: guardar en memoria
    const newMockBooking = { name, whatsapp, service, date, time, duration };
    mockBookings.push(newMockBooking);
    console.log('📌 [SIMULACIÓN] Reserva registrada exitosamente:', newMockBooking);
    
    return {
      id: `mock-event-${Date.now()}`,
      summary: `💅 ${service} - ${name} (SIMULADO)`,
      start: { dateTime: startDateTime.toISOString() },
      end: { dateTime: endDateTime.toISOString() },
      status: 'confirmed',
      isMock: true
    };
  }

  const auth = getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: `💅 ${service} - ${name}`,
    description: `Reserva de estética de uñas.\n\nCliente: ${name}\nWhatsApp: ${whatsapp}\nServicio: ${service}\nEstado: Confirmado`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: TIMEZONE,
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: TIMEZONE,
    },
    extendedProperties: {
      private: {
        clientName: name,
        clientWhatsapp: whatsapp,
        serviceType: service
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: calendarId,
    resource: event,
  });

  return response.data;
}
