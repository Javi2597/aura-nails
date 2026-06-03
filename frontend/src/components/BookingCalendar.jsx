import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Phone, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { getAvailability, createBooking } from '../api';

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function BookingCalendar({ selectedService, showToast }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Formulario de contacto
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Reiniciar estado si se cambia el servicio
  useEffect(() => {
    setSelectedDateStr('');
    setAvailableSlots([]);
    setSelectedSlot('');
    setBookingSuccess(null);
  }, [selectedService]);

  // Cargar horas disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (!selectedDateStr || !selectedService) return;

    async function loadSlots() {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot('');
      try {
        const response = await getAvailability(selectedDateStr, selectedService.duration);
        setAvailableSlots(response.slots);
      } catch (error) {
        console.error(error);
        showToast('No se pudo conectar con el servidor para obtener horarios.', 'error');
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedDateStr, selectedService]);

  // Funciones de navegación de calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    // No navegar al pasado
    const now = new Date();
    if (prev.getMonth() < now.getMonth() && prev.getFullYear() <= now.getFullYear()) return;
    setCurrentDate(prev);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generar cuadrícula de días para el mes actual
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y, m) => {
    let day = new Date(y, m, 1).getDay(); // 0 is Sunday, 1 is Monday, etc.
    return day === 0 ? 6 : day - 1; // Adaptar para que Lunes sea 0
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayIndex(year, month);

  const daysGrid = [];
  // Rellenar espacios vacíos del mes anterior
  for (let i = 0; i < firstDayIdx; i++) {
    daysGrid.push(null);
  }
  // Rellenar los días del mes
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(new Date(year, month, d));
  }

  const handleDateSelect = (date) => {
    if (!date) return;
    if (isDateDisabled(date)) return;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    
    setSelectedDateStr(`${y}-${m}-${d}`);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Bloquear días anteriores a hoy
    if (date < today) return true;
    
    // Bloquear domingos (0)
    if (date.getDay() === 0) return true;

    return false;
  };

  const isSelectedDate = (date) => {
    if (!date || !selectedDateStr) return false;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}` === selectedDateStr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedDateStr || !selectedSlot || !clientName || !clientWhatsapp) {
      showToast('Por favor completa todos los campos del formulario.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: clientName,
        whatsapp: clientWhatsapp,
        service: selectedService.name,
        date: selectedDateStr,
        time: selectedSlot,
        duration: selectedService.duration
      };

      const result = await createBooking(payload);
      setBookingSuccess(result.event);
      showToast('¡Tu reserva ha sido confirmada con éxito!', 'success');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Ocurrió un error al confirmar la reserva.', 'error');
      // Si el horario ya está ocupado, refrescar la lista
      if (error.message.includes('ya no está disponible')) {
        const response = await getAvailability(selectedDateStr, selectedService.duration);
        setAvailableSlots(response.slots);
        setSelectedSlot('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingSuccess(null);
    setSelectedSlot('');
    setSelectedDateStr('');
    setClientName('');
    setClientWhatsapp('');
  };

  // Enlace para contacto de whatsapp posterior a la reserva
  const getWhatsAppLink = () => {
    if (!bookingSuccess) return '#';
    const text = `Hola Aura Studio! Acabo de reservar un turno para:
- Servicio: ${selectedService.name}
- Fecha: ${selectedDateStr}
- Hora: ${selectedSlot}hs
A nombre de: ${clientName}. ¡Espero la confirmación del calendario!`;
    return `https://wa.me/${clientWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  if (!selectedService) {
    return (
      <section id="booking" className="py-24 bg-white border-t border-charcoal-100/50">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-bronze-50 rounded-full flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-bronze-500" />
          </div>
          <h2 className="text-2xl md:text-3xl text-charcoal-900 font-serif font-bold">
            Reserva tu experiencia
          </h2>
          <p className="text-charcoal-700 text-sm max-w-md mx-auto">
            Por favor, selecciona primero uno de nuestros servicios en la sección de arriba para verificar la disponibilidad de turnos.
          </p>
          <a
            href="#services"
            className="inline-block px-6 py-3 bg-charcoal-900 hover:bg-bronze-700 text-cream-50 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all cursor-pointer"
          >
            Ver Servicios
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 bg-white border-t border-charcoal-100/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-bronze-600 block">Agenda Abierta</span>
          <h2 className="text-3xl md:text-4xl text-charcoal-900 font-bold tracking-tight">
            Reserva tu Turno Online
          </h2>
          <p className="text-charcoal-700 text-sm">
            Estás agendando: <strong className="text-bronze-700 font-sans">{selectedService.name}</strong> ({selectedService.duration} min)
          </p>
        </div>

        {bookingSuccess ? (
          /* Pantalla de Éxito */
          <div className="max-w-xl mx-auto p-8 md:p-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm text-center space-y-8 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-serif font-bold text-charcoal-900">¡Reserva Completada!</h3>
              <p className="text-charcoal-700 text-sm">
                Hemos registrado tu turno exitosamente en nuestro calendario personal. Te esperamos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-charcoal-100/80 text-left space-y-4 shadow-sm">
              <div className="flex justify-between items-center text-xs border-b border-charcoal-100 pb-2">
                <span className="text-charcoal-700 font-medium">Servicio</span>
                <span className="font-semibold text-charcoal-900">{selectedService.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-charcoal-100 pb-2">
                <span className="text-charcoal-700 font-medium">Fecha</span>
                <span className="font-semibold text-charcoal-900">
                  {new Date(`${selectedDateStr}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-charcoal-100 pb-2">
                <span className="text-charcoal-700 font-medium">Horario</span>
                <span className="font-semibold text-bronze-700">{selectedSlot}hs</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-charcoal-700 font-medium">Cliente</span>
                <span className="font-semibold text-charcoal-900">{clientName}</span>
              </div>
            </div>

            {bookingSuccess.isMock && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-left text-xs text-amber-900 font-sans">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Nota de Simulación:</strong> Las credenciales de Google Calendar no están configuradas en el backend, por lo que la reserva se guardó localmente en memoria.
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba56] text-white font-sans text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Enviar WhatsApp
              </a>
              
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-charcoal-900 hover:bg-bronze-700 text-cream-50 font-sans text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Reservar otro Turno
              </button>
            </div>
          </div>
        ) : (
          /* Flujo de Reserva */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Paso 1: Elegir Día (Calendario) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-charcoal-900">
                <span className="w-6 h-6 rounded-full bg-bronze-50 flex items-center justify-center text-xs font-bold text-bronze-700 font-sans">1</span>
                <h3 className="text-lg font-bold font-serif">Selecciona el día</h3>
              </div>

              {/* Calendario UI */}
              <div className="p-6 rounded-3xl border border-charcoal-200/40 bg-cream-50/10 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-charcoal-100">
                  <h4 className="font-serif font-bold text-charcoal-900 text-base">
                    {MONTHS[month]} {year}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={prevMonth}
                      className="p-2 hover:bg-bronze-50 text-charcoal-700 hover:text-bronze-700 rounded-lg transition-colors cursor-pointer"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={nextMonth}
                      className="p-2 hover:bg-bronze-50 text-charcoal-700 hover:text-bronze-700 rounded-lg transition-colors cursor-pointer"
                      aria-label="Siguiente mes"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase font-bold tracking-widest text-charcoal-700">
                  {DAYS_OF_WEEK.map(d => <div key={d}>{d}</div>)}
                </div>

                {/* Grilla de Días */}
                <div className="grid grid-cols-7 gap-2 text-center">
                  {daysGrid.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />;
                    
                    const disabled = isDateDisabled(day);
                    const selected = isSelectedDate(day);
                    const isToday = new Date().toDateString() === day.toDateString();

                    return (
                      <button
                        key={day.getTime()}
                        onClick={() => handleDateSelect(day)}
                        disabled={disabled}
                        className={`h-10 text-xs rounded-xl flex items-center justify-center font-sans font-medium transition-all cursor-pointer ${
                          selected
                            ? 'bg-bronze-600 text-cream-50 font-bold shadow-md shadow-bronze-600/10'
                            : disabled
                              ? 'text-charcoal-200 cursor-not-allowed opacity-40'
                              : isToday
                                ? 'bg-bronze-50 text-bronze-700 border border-bronze-300 font-bold'
                                : 'text-charcoal-900 hover:bg-bronze-50 hover:text-bronze-700'
                        }`}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Paso 2: Elegir Hora y Completar Datos */}
            <div className="lg:col-span-5 space-y-8">
              {/* Disponibilidad Horaria */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-charcoal-900">
                  <span className="w-6 h-6 rounded-full bg-bronze-50 flex items-center justify-center text-xs font-bold text-bronze-700 font-sans">2</span>
                  <h3 className="text-lg font-bold font-serif">Horarios disponibles</h3>
                </div>

                {!selectedDateStr ? (
                  <div className="p-6 text-center border border-dashed border-charcoal-200 rounded-2xl text-xs text-charcoal-700 font-sans">
                    Selecciona un día en el calendario para consultar horarios.
                  </div>
                ) : loadingSlots ? (
                  <div className="p-8 flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-bronze-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-charcoal-700 font-sans">Consultando calendario real...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 text-center border border-rose-100 rounded-2xl text-xs text-rose-700 bg-rose-50/20 font-sans">
                    No hay horarios disponibles para esta fecha. Por favor, selecciona otro día.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {availableSlots.map(slot => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 text-xs rounded-xl flex items-center justify-center gap-1.5 font-sans font-semibold transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-bronze-600 text-cream-50 border-bronze-600 shadow-sm'
                              : 'bg-white text-charcoal-900 border-charcoal-200/40 hover:border-bronze-400 hover:text-bronze-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 opacity-70" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Formulario de Confirmación */}
              {selectedSlot && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2 text-charcoal-900">
                    <span className="w-6 h-6 rounded-full bg-bronze-50 flex items-center justify-center text-xs font-bold text-bronze-700 font-sans">3</span>
                    <h3 className="text-lg font-bold font-serif">Completa tus datos</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-1">
                      <label htmlFor="client-name" className="text-[10px] uppercase tracking-wider text-charcoal-700 font-semibold">
                        Nombre completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-bronze-500/60" />
                        <input
                          id="client-name"
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Ej: Sofía Pérez"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-charcoal-200/60 focus:border-bronze-500 bg-cream-50/10 text-xs font-sans placeholder:opacity-60 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label htmlFor="client-whatsapp" className="text-[10px] uppercase tracking-wider text-charcoal-700 font-semibold">
                        WhatsApp (con código de área)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-bronze-500/60" />
                        <input
                          id="client-whatsapp"
                          type="tel"
                          required
                          value={clientWhatsapp}
                          onChange={(e) => setClientWhatsapp(e.target.value)}
                          placeholder="Ej: +5491122334455"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-charcoal-200/60 focus:border-bronze-500 bg-cream-50/10 text-xs font-sans placeholder:opacity-60 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-bronze-600 hover:bg-bronze-700 disabled:bg-charcoal-200 text-cream-50 font-sans font-semibold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-[1px] active:translate-y-0 shadow-lg shadow-bronze-600/10 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                        Confirmando Turno...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Confirmar Turno
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
