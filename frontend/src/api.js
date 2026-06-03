// En producción, si hostname es 'localhost' usa el puerto, si no, usa '' (ruta relativa)
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : ''; 

// Ahora las llamadas serán: /api/availability?...
const res = await fetch(`${API_BASE_URL}/api/availability?date=${date}&duration=${duration}`);