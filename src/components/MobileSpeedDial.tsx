"use client";

import React, { useState } from "react";
import { 
  Plus, 
  X, 
  MessageCircle, 
  EyeOff, 
  Crown
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
    <div 
      className="md:hidden fixed bottom-[88px] right-4 z-[55] select-none"
      style={{
        marginBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      
      {/* Radial Expanded Actions */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 mb-3 animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Action 1: Panic Exit */}
          <button
            onClick={handlePanicExit}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-red-600/90 text-white shadow-xl hover:bg-red-500 active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-wider">Salida Rápida (Google)</span>
            <div className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center">
              <EyeOff size={13} />
            </div>
          </button>

          {/* Action 2: WhatsApp Concierge */}
          <button
            onClick={handleConcierge}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#D4AF37] text-black shadow-xl hover:bg-white active:scale-95 transition-all font-bold"
          >
            <span className="text-[9px] font-black uppercase tracking-wider">Concierge VIP 24/7</span>
            <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
              <MessageCircle size={13} fill="currentColor" />
            </div>
          </button>

          {/* Action 3: Club Alpha 3D */}
          <a
            href="/#vip-lounge"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full glass-obsidian border border-[#D4AF37]/40 text-[#D4AF37] shadow-xl active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-white">Club Alpha 3D</span>
            <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <Crown size={13} />
            </div>
          </a>

        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Acciones Rápidas VIP"
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.85)] transition-all duration-300 active:scale-90 ${
          isOpen
            ? 'bg-[#FF0062] text-white rotate-45 shadow-[0_0_25px_rgba(255,0,98,0.6)]'
            : 'bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,168,67,0.45)] hover:scale-105'
        }`}
        title="Acciones Rápidas VIP"
      >
        <Plus size={22} className="stroke-[3]" />
      </button>

    </div>
  );
}
