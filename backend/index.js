import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAvailableSlots, createCalendarEvent } from './googleCalendar.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
// Permitimos localhost (desarrollo) y wildcard para que sea fácil probar y desplegar
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Ruta de bienvenida base
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a la API de AURA Nails Studio!',
    status: 'online',
    endpoints: {
      status: '/api/status',
      availability: '/api/availability?date=YYYY-MM-DD&duration=MINUTES',
      bookings: '/api/bookings (POST)'
    }
  });
});

// Ruta de estado general
app.get('/api/status', (req, res) => {
  const isGoogleConfigured = !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    !process.env.GOOGLE_CLIENT_ID.includes('tu_google')
  );

  res.json({
    status: 'online',
    service: 'Estética Nails API',
    googleCalendarConnected: isGoogleConfigured,
    mode: isGoogleConfigured ? 'production' : 'simulation'
  });
});

// Ruta para obtener disponibilidad
// GET /api/availability?date=2026-06-04&duration=60
app.get('/api/availability', async (req, res) => {
  const { date, duration } = req.query;

  // Validaciones
  if (!date) {
    return res.status(400).json({ error: 'El parámetro "date" es requerido.' });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'El parámetro "date" debe tener el formato YYYY-MM-DD.' });
  }

  const durationMinutes = duration ? parseInt(duration, 10) : 60;
  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    return res.status(400).json({ error: 'La duración debe ser un número entero de minutos válido.' });
  }

  try {
    const slots = await getAvailableSlots(date, durationMinutes);
    res.json({ date, slots });
  } catch (error) {
    console.error('Error en GET /api/availability:', error);
    res.status(500).json({ error: 'Error al consultar la disponibilidad en Google Calendar.' });
  }
});

// Ruta para crear una reserva
// POST /api/bookings
app.post('/api/bookings', async (req, res) => {
  const { name, whatsapp, service, date, time, duration } = req.body;

  // Validaciones
  if (!name || !whatsapp || !service || !date || !time || !duration) {
    return res.status(400).json({ error: 'Todos los campos (name, whatsapp, service, date, time, duration) son requeridos.' });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'El campo "date" debe tener el formato YYYY-MM-DD.' });
  }

  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(time)) {
    return res.status(400).json({ error: 'El campo "time" debe tener el formato HH:MM.' });
  }

  const durationMinutes = parseInt(duration, 10);
  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    return res.status(400).json({ error: 'La duración debe ser un número entero de minutos válido.' });
  }

  try {
    const event = await createCalendarEvent({
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      service: service.trim(),
      date,
      time,
      duration: durationMinutes
    });

    res.status(201).json({
      success: true,
      message: '¡Reserva creada exitosamente!',
      event
    });
  } catch (error) {
    console.error('Error en POST /api/bookings:', error);
    // Controlar errores específicos de overlap
    if (error.message.includes('ya no está disponible')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'No se pudo crear la reserva en el calendario. Intente de nuevo.' });
  }
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Iniciar servidor
export default app;