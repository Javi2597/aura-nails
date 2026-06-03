import React from 'react';
import { MapPin, Phone, Instagram, ShieldAlert, Heart, Calendar } from 'lucide-react';

export default function Contact() {
  return (
    <footer id="about" className="bg-charcoal-900 text-cream-100/90 py-20 font-sans border-t border-bronze-700/20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Info Studio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-bronze-400 font-semibold">El Estudio</span>
            <h3 className="text-3xl font-serif text-cream-50 font-bold">AURA Nails</h3>
          </div>
          
          <p className="text-xs leading-relaxed text-cream-100/70 max-w-md">
            Un santuario de calma donde la belleza y el cuidado personal se encuentran. Creemos en una estética honesta, saludable y con atención puesta minuciosamente en cada detalle.
          </p>

          <div className="space-y-4 pt-4 text-xs">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-bronze-400 shrink-0" />
              <span>Av. Coronel Díaz 1800, Palermo, CABA, Argentina</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-bronze-400 shrink-0" />
              <span>+54 9 11 3847-2938</span>
            </div>

            <div className="flex items-center gap-3">
              <Instagram className="w-4 h-4 text-bronze-400 shrink-0" />
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-bronze-400 transition-colors underline underline-offset-4"
              >
                @aura.nails.studio
              </a>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="lg:col-span-3 space-y-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-bronze-400">Horarios de Atención</h4>
          <ul className="space-y-3 text-xs text-cream-100/70">
            <li className="flex justify-between border-b border-cream-100/10 pb-2">
              <span>Lunes a Viernes</span>
              <span className="text-cream-50 font-medium">09:00 - 18:00 hs</span>
            </li>
            <li className="flex justify-between border-b border-cream-100/10 pb-2">
              <span>Sábados</span>
              <span className="text-cream-50 font-medium">09:00 - 18:00 hs</span>
            </li>
            <li className="flex justify-between text-rose-300">
              <span>Domingos</span>
              <span className="font-medium">Cerrado</span>
            </li>
          </ul>
        </div>

        {/* Políticas del Estudio */}
        <div className="lg:col-span-4 space-y-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-bronze-400">Políticas de Turnos</h4>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs leading-relaxed text-cream-100/70">
            <div className="flex gap-3 items-start">
              <ShieldAlert className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
              <p>
                <strong>Tolerancia:</strong> Contamos con un margen de tolerancia de 15 minutos. Pasado ese tiempo, el turno se dará por cancelado para no retrasar la agenda.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <Calendar className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
              <p>
                <strong>Cancelación:</strong> Podrás cancelar o reprogramar tu cita con un mínimo de 24 horas de anticipación a través de nuestras vías de contacto directo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-cream-100/40 uppercase tracking-widest">
        <span>© {new Date().getFullYear()} AURA Studio. Todos los derechos reservados.</span>
        <span className="flex items-center gap-1.5 normal-case tracking-normal">
          Creado con <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> para amantes del cuidado personal.
        </span>
      </div>
    </footer>
  );
}
