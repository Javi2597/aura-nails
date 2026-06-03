import React from 'react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    quote: "El ambiente de calma y el aroma a lavanda te relajan de inmediato al entrar. La atención al detalle en la manicura rusa es verdaderamente un arte.",
    author: "Valentina Rossi",
    service: "Manicura Premium",
    rating: 5
  },
  {
    id: 2,
    quote: "Una experiencia de autocuidado incomparable. Los materiales y la higiene quirúrgica del instrumental me dieron total tranquilidad. Mi lugar favorito en Palermo.",
    author: "Camila Montes",
    service: "Pedicura Spa",
    rating: 5
  },
  {
    id: 3,
    quote: "El esmaltado semipermanente me dura impecable por semanas. El diseño minimalista a mano alzada que hicieron superó mis expectativas. Muy sofisticado.",
    author: "Delfina Soler",
    service: "Nail Art Exclusivo",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-cream-50 border-t border-charcoal-100/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-bronze-600 font-alt block">Testimonios</span>
          <h2 className="text-3xl md:text-4xl text-charcoal-900 font-bold tracking-tight">
            La experiencia Aura según nuestras clientas
          </h2>
          <div className="w-12 h-[1px] bg-bronze-300 mx-auto mt-4" />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {REVIEWS.map((review) => (
            <div 
              key={review.id} 
              className="relative p-8 md:p-10 rounded-2xl bg-white border border-charcoal-100/50 hover:border-bronze-300/40 hover:shadow-lg hover:shadow-bronze-900/[0.02] transition-all duration-500 flex flex-col justify-between"
            >
              {/* Decorative Quote Icon */}
              <Quote className="absolute top-6 right-8 w-10 h-10 text-bronze-100/50 -scale-x-100 shrink-0" />

              <div className="space-y-6">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-bronze-400 text-bronze-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-charcoal-800 text-sm md:text-base italic leading-relaxed font-serif relative z-10">
                  "{review.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-8 border-t border-charcoal-100/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 font-alt">
                  {review.author}
                </h4>
                <span className="text-[10px] text-bronze-500 font-sans tracking-wide">
                  Cliente de {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
