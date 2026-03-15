"use client";

import React, { useState } from "react";
import { ShieldCheck, Scale, EyeOff, Camera, X } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export default function PrivacyModal({ isOpen, onAccept }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-brand-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
      <div className="relative w-full max-w-2xl glass-dark border border-brand-gold/30 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-gold/10 flex flex-col max-h-[90vh]">
        
        {/* Luxury Header */}
        <div className="p-8 md:p-12 text-center border-b border-white/5 bg-gradient-to-b from-brand-gold/5 to-transparent">
          <div className="inline-block p-4 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
            <ShieldCheck size={40} className="text-brand-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-gold mb-4 tracking-tight">Contrato de <span className="text-brand-white">Comunidad Élite</span></h2>
          <p className="text-brand-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Protección · Privacidad · Exclusividad</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 no-scrollbar">
          
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Camera size={20} className="text-brand-gold" />
            </div>
            <div className="space-y-2">
              <h4 className="text-brand-white font-serif text-lg">Propiedad de Imagen</h4>
              <p className="text-brand-white/50 text-sm leading-relaxed">Tus fotos son exclusivamente tuyas. <span className="text-brand-gold font-bold">Cariñosas.top</span> actúa únicamente como vitrina publicitaria de alta gama para conectar con clientes VIP en Ecuador.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <EyeOff size={20} className="text-brand-gold" />
            </div>
            <div className="space-y-2">
              <h4 className="text-brand-white font-serif text-lg">Blindaje Anti-Fakes</h4>
              <p className="text-brand-white/50 text-sm leading-relaxed"> Tolerancia cero con el engaño. Aceptas que el uso de fotos de terceros resultará en la <span className="text-brand-pink font-bold">expulsión inmediata</span> y el baneo permanente de tu IP.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Scale size={20} className="text-brand-gold" />
            </div>
            <div className="space-y-2">
              <h4 className="text-brand-white font-serif text-lg">Protocolo de Discreción</h4>
              <p className="text-brand-white/50 text-sm leading-relaxed">Nos comprometemos a no indexar tus fotos de rostro en buscadores públicos (Google/Bing) si seleccionas el <span className="text-brand-gold font-bold">Modo Incógnito</span> en tu perfil.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-brand-gold text-2xl font-serif">👑</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-brand-white font-serif text-lg">Verificación Humana</h4>
              <p className="text-brand-white/50 text-sm leading-relaxed">Aceptas realizar una validación de identidad vía video corto para obtener el <span className="text-brand-gold font-bold">Sello Real</span>, garantizando seguridad absoluta para ambas partes.</p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-12 border-t border-white/5 flex flex-col items-center gap-6 bg-brand-black/50 backdrop-blur-md">
           <button 
             onClick={onAccept}
             className="w-full bg-brand-gold text-brand-black py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
             Acepto los Términos de Élite
           </button>
           <a href="#" className="text-[10px] text-brand-white/30 uppercase tracking-widest font-black hover:text-brand-gold transition-colors">
             Consultar Política de Privacidad Encriptada
           </a>
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
