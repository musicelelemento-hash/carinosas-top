"use client";

import React from "react";
import { ShieldCheck, Lock, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-white/5 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-brand-gold tracking-tight">CARIÑOSAS.TOP</h3>
            <p className="text-brand-white/40 text-xs leading-relaxed uppercase tracking-widest">
              El estándar de oro en servicios premium y exclusividad en Ecuador.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-2">Seguridad VIP</h4>
            <div className="flex items-center gap-3 text-brand-white/60">
              <ShieldCheck className="text-brand-pink" size={20} />
              <span className="text-xs uppercase tracking-tighter">Fotos 100% Verificadas</span>
            </div>
            <div className="flex items-center gap-3 text-brand-white/60">
              <Lock className="text-brand-gold" size={20} />
              <span className="text-xs uppercase tracking-tighter">Privacidad Encriptada</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
             <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                <span className="text-brand-gold font-black text-base">18+</span>
                <span className="text-[8px] text-brand-white/40 uppercase tracking-widest whitespace-nowrap">Adultos Solamente</span>
             </div>
             <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                <CheckCircle className="text-brand-gold" size={18} />
                <span className="text-[8px] text-brand-white/40 uppercase tracking-widest whitespace-nowrap">Pago Seguro</span>
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-brand-white/30 uppercase tracking-[0.2em]">
            Cariñosas.top © 2026 | Quito · Guayaquil · Cuenca · Manta
          </p>
          <div className="flex gap-8 text-[10px] text-brand-white/30 uppercase tracking-widest font-black">
            <a href="#" className="hover:text-brand-gold transition-colors">Términos</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Privacidad</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
