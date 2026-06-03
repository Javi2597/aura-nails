import React, { useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import BookingCalendar from './components/BookingCalendar';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Toast from './components/Toast';

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  
  // Estado para el Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    showToast(`Has seleccionado el servicio: ${service.name}. Continúa eligiendo fecha en el calendario.`, 'info');
    
    // Desplazamiento suave al calendario
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookNowClick = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Elige el tratamiento que deseas reservar en la lista.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-bronze-200 selection:text-bronze-900 bg-cream-50 font-sans">
      <main className="flex-grow">
        {/* Sección Hero */}
        <Hero onBookNowClick={handleBookNowClick} />

        {/* Sección Servicios */}
        <Services 
          selectedService={selectedService} 
          onSelectService={handleSelectService} 
        />

        {/* Sección Testimonios */}
        <Testimonials />

        {/* Sección de Calendario y Reserva */}
        <BookingCalendar 
          selectedService={selectedService} 
          showToast={showToast} 
        />
      </main>

      {/* Sección de Contacto e Información */}
      <Contact />

      {/* Toast Global */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
