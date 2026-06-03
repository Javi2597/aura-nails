import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-950',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    },
    error: {
      bg: 'border-rose-500/30 bg-rose-500/5 text-rose-950',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
    },
    info: {
      bg: 'border-bronze-500/30 bg-bronze-500/5 text-bronze-950',
      icon: <Info className="w-5 h-5 text-bronze-600" />,
    }
  };

  const current = config[type] || config.success;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg animate-slide-up ${current.bg}`}>
      {current.icon}
      <span className="text-sm font-medium tracking-wide font-sans">{message}</span>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
}
