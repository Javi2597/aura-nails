import React from 'react';
import { Clock, Check, Sparkles } from 'lucide-react';

const SERVICES = [
  {
    id: 'manicura',
    num: '01',
    name: 'Manicura Premium',
    description: 'Tratamiento completo que incluye limado anatómico, limpieza profunda de cutículas con técnica combinada, exfoliación delicada, nutrición con aceites orgánicos y esmaltado semipermanente de alta duración.',
    duration: 60,
    price: '$2.500',
    details: ['Técnica combinada', 'Exfoliación orgánica', 'Esmaltado semipermanente']
  },
  {
    id: 'pedicura',
    num: '02',
    name: 'Pedicura Spa',
    description: 'Un ritual reconstituyente para pies cansados. Incluye baño de sales aromáticas, remoción de durezas, exfoliación con micropartículas de bambú, masaje relajante y esmaltado clásico o semipermanente.',
    duration: 60,
    price: '$3.200',
    details: ['Sales relajantes', 'Masaje hidro-nutritivo', 'Pedicura profunda']
  },
  {
    id: 'nail-art',
    num: '03',
    name: 'Nail Art Exclusivo',
    description: 'Lleva la estética de tus uñas al siguiente nivel. Manicura premium combinada con diseños personalizados a mano alzada: efectos cromados, encapsulados, francesas modernas o pedrería fina.',
    duration: 90,
    price: '$4.000',
    details: ['Diseño a mano alzada', 'Efectos tendencia', 'Detalles metálicos/cristal']
  }
];

export default function Services({ selectedService, onSelectService }) {
  return (
    <section id="services" className="py-32 bg-[#F4EFEA]/30 border-t border-charcoal-100/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-24">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-bronze-600 font-alt block">Nuestros Tratamientos</span>
          <h2 className="text-3xl md:text-5xl text-charcoal-900 font-bold tracking-tight">
            El arte de cuidar cada detalle
          </h2>
          <div className="w-12 h-[1px] bg-bronze-300 mx-auto mt-4" />
        </div>

        {/* Services Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-stretch">
          {SERVICES.map((service) => {
            const isSelected = selectedService?.id === service.id;
            return (
              <div 
                key={service.id}
                className={`relative flex flex-col justify-between p-8 lg:p-10 rounded-3xl transition-all duration-500 border ${
                  isSelected 
                    ? 'border-bronze-500 bg-white shadow-xl shadow-bronze-900/[0.03] translate-y-[-6px]' 
                    : 'border-bronze-300/20 bg-transparent hover:border-bronze-300 hover:bg-white hover:translate-y-[-2px] hover:shadow-md hover:shadow-bronze-900/[0.01]'
                }`}
              >
                {/* Number & Selection Badge */}
                <div className="flex justify-between items-start">
                  <span className="font-serif font-light text-5xl text-bronze-300/60 tracking-wider">
                    {service.num}
                  </span>
                  
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-semibold tracking-widest uppercase bg-bronze-600 text-cream-50 font-alt animate-fade-in shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" /> Seleccionado
                    </span>
                  ) : (
                    <span className="text-xs font-serif font-bold text-bronze-600">AURA</span>
                  )}
                </div>

                {/* Service Info */}
                <div className="space-y-6 mt-8 flex-grow">
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold text-charcoal-900 leading-tight">
                      {service.name}
                    </h3>
                    <span className="text-lg font-serif font-semibold text-bronze-600 block">
                      {service.price}
                    </span>
                  </div>

                  <p className="text-charcoal-700 text-xs leading-relaxed font-sans">
                    {service.description}
                  </p>

                  {/* Bullet features */}
                  <ul className="space-y-2.5 pt-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-[10px] uppercase tracking-wider text-charcoal-700 font-semibold font-alt">
                        <span className="w-4 h-4 rounded-full bg-bronze-50 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-bronze-600" />
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Duration & Button */}
                <div className="pt-8 mt-8 border-t border-charcoal-100/60 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-charcoal-700 font-sans">
                    <Clock className="w-4 h-4 text-bronze-500/70" />
                    <span>Duración: {service.duration} minutos</span>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className={`w-full py-4 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-300 font-alt cursor-pointer ${
                      isSelected
                        ? 'bg-bronze-600 text-cream-50 shadow-sm shadow-bronze-600/10'
                        : 'bg-charcoal-900 hover:bg-bronze-700 text-cream-50 hover:shadow-md'
                    }`}
                  >
                    {isSelected ? 'Cambiar Selección' : 'Seleccionar Turno'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
