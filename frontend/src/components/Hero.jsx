import React from 'react';
import { Calendar, Compass, Feather } from 'lucide-react';

export default function Hero({ onBookNowClick }) {
  return (
    <header className="relative w-full overflow-hidden">
      {/* Delicate ambient gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cream-100/50 rounded-full blur-[100px] -z-10" />
      <div className="absolute -bottom-20 left-0 w-[400px] h-[400px] bg-sage-100/30 rounded-full blur-[80px] -z-10" />

      {/* Floating Minimalist Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Feather className="w-4 h-4 text-bronze-600 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-lg font-semibold tracking-[0.25em] font-serif text-charcoal-900 uppercase">Aura</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.25em] text-charcoal-700 font-alt font-semibold">
          <a href="#services" className="relative py-1 hover:text-bronze-700 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-bronze-500 after:transition-all after:duration-300">
            Servicios
          </a>
          <a href="#booking" className="relative py-1 hover:text-bronze-700 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-bronze-500 after:transition-all after:duration-300">
            Reservar
          </a>
          <a href="#about" className="relative py-1 hover:text-bronze-700 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-bronze-500 after:transition-all after:duration-300">
            El Estudio
          </a>
        </div>

        <button 
          onClick={onBookNowClick}
          className="px-6 py-3 bg-charcoal-900 hover:bg-bronze-600 text-cream-50 text-[9px] font-bold tracking-[0.2em] uppercase rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-[1px] active:translate-y-0 font-alt cursor-pointer"
        >
          Reserva Online
        </button>
      </nav>

      {/* Hero Body with generous whitespace */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left column */}
        <div className="lg:col-span-6 space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-bronze-400/10 bg-bronze-50/30 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] font-semibold text-bronze-700 font-alt">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-bronze-600" />
            Experiencia Estética Premium
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-charcoal-900 font-light leading-[1.12] tracking-tight">
            El arte del cuidado <br />
            en <span className="text-gold-gradient italic font-normal font-serif">tus manos.</span>
          </h1>
          
          <p className="text-charcoal-700 text-sm md:text-base leading-relaxed max-w-lg font-sans font-light">
            Un santuario de calma diseñado para quienes aprecian la precisión y la sutileza. Fusionamos higiene de nivel clínico, tratamientos especializados y esmaltados de autor para ofrecerte un servicio de manicura y pedicura excepcional.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={onBookNowClick}
              className="px-8 py-4.5 bg-bronze-600 hover:bg-bronze-700 text-cream-50 font-alt font-bold text-xs tracking-[0.15em] uppercase rounded-xl shadow-lg shadow-bronze-600/10 hover:shadow-bronze-700/20 transition-all duration-300 flex items-center justify-center gap-2.5 transform hover:-translate-y-[2px] active:translate-y-0 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Reservar una Cita
            </button>
            
            <a
              href="#services"
              className="px-8 py-4.5 bg-transparent border border-charcoal-700/10 hover:border-bronze-600/30 text-charcoal-800 hover:text-bronze-700 hover:bg-bronze-50/10 font-alt font-bold text-xs tracking-[0.15em] uppercase rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Nuestra Carta
            </a>
          </div>

          {/* Social Proof */}
          <div className="pt-10 border-t border-charcoal-200/40 grid grid-cols-3 gap-8 max-w-md">
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-light font-serif text-charcoal-900">100%</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal-700 font-alt font-semibold">Higiene Clínico</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-light font-serif text-charcoal-900">4.9★</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal-700 font-alt font-semibold">Calificaciones</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-light font-serif text-charcoal-900">300+</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal-700 font-alt font-semibold">Clientes Aura</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end animate-slide-up">
          <div className="relative group">
            {/* Background frame with hover transitions */}
            <div className="absolute -inset-4 rounded-3xl border border-bronze-300/20 -z-10 group-hover:scale-[1.02] transition-transform duration-700" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-sage-200/20 rounded-2xl -z-10 blur-md" />
            
            {/* Main Image */}
            <img 
              src="/nails_hero.png" 
              alt="Manicura Aura Studio" 
              className="w-full max-w-md md:max-w-lg aspect-[4/5] object-cover rounded-2xl shadow-xl shadow-bronze-900/[0.04] border border-cream-100 transition-all duration-700 group-hover:scale-[1.005] group-hover:brightness-[1.01]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
