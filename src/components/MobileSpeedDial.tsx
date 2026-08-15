"use client";

import React, { useState } from "react";
import { 
  Plus, 
  X, 
  MessageCircle, 
  EyeOff, 
  Smartphone, 
  Crown, 
  ShieldAlert, 
  Zap 
} from "lucide-react";

export default function MobileSpeedDial() {
  const [isOpen, setIsOpen] = useState(false);

  const handlePanicExit = () => {
    window.location.replace("https://www.google.com");
  };

  const handleConcierge = () => {
    const text = encodeURIComponent("Hola Concierge de Cariñosas.top, requiero atención personalizada prioritaria para una reserva VIP.");
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  return (
    <div className="md:hidden fixed bottom-24 right-5 z-[130] select-none">
      
      {/* Radial Expanded Actions */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 mb-3 animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Action 1: Panic Exit */}
          <button
            onClick={handlePanicExit}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-red-600/90 text-white shadow-xl hover:bg-red-500 active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-wider">Salida Rápida (Google)</span>
            <div className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center">
              <EyeOff size={14} />
            </div>
          </button>

          {/* Action 2: WhatsApp Concierge */}
          <button
            onClick={handleConcierge}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-brand-gold text-brand-black shadow-xl hover:bg-white active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-wider">Concierge VIP 24/7</span>
            <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
              <MessageCircle size={14} fill="currentColor" />
            </div>
          </button>

          {/* Action 3: Camouflage App */}
          <a
            href="#vip-lounge"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full glass-obsidian border border-brand-gold/40 text-brand-gold shadow-xl active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-white">Club Alpha 3D</span>
            <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
              <Crown size={14} />
            </div>
          </a>

        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 w-12 h-12 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 active:scale-90 ${
          isOpen
            ? 'bg-brand-pink text-white rotate-45 shadow-[0_0_25px_rgba(255,0,98,0.6)]'
            : 'bg-brand-gold text-brand-black shadow-[0_0_25px_rgba(212,168,67,0.5)]'
        }`}
        title="Acciones Rápidas VIP"
      >
        <Plus size={22} className="stroke-[3]" />
      </button>

    </div>
  );
}
