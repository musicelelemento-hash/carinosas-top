"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, Sparkles, ShieldCheck } from "lucide-react";

export default function PushPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 5 seconds to not be intrusive
    const timer = setTimeout(() => {
      const shown = localStorage.getItem("push_prompt_shown");
      if (!shown) {
        setIsVisible(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("push_prompt_shown", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-bottom-10 duration-700">
      <div className="glass-premium rounded-[2.5rem] border border-brand-gold/30 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 blur-[80px] rounded-full group-hover:bg-brand-gold/20 transition-colors" />
        
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center relative">
             <Bell size={32} className="text-brand-gold animate-bounce-subtle" />
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-pink rounded-full border-2 border-brand-black" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-white italic tracking-tight">Acceso <span className="text-brand-gold">Prioritario</span></h3>
            <p className="text-white/40 text-xs uppercase tracking-widest leading-relaxed">
              ¿Deseas recibir notificaciones discretas cuando lleguen nuevas modelos VIP a tu ciudad?
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 mt-2">
             <button 
                onClick={handleClose}
                className="w-full bg-brand-gold text-brand-black font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-full hover:bg-white transition-all shadow-xl active:scale-95"
             >
                Activar Notificaciones
             </button>
             <div className="flex items-center justify-center gap-2 text-[8px] text-white/20 uppercase font-black tracking-widest">
                <ShieldCheck size={10} />
                Privacidad de grado militar & Discreción Total
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
