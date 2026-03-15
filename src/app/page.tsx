"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)]" />

      <div className="max-w-3xl w-full text-center relative z-10 animate-in fade-in duration-1000">
        {/* Logo and Pulse Animation */}
        <div className="mb-12 relative inline-block">
          <div className="text-6xl md:text-8xl animate-pulse-subtle">
            👑
          </div>
          <div className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full" />
        </div>

        {/* Text Section */}
        <h1 className="text-4xl md:text-7xl font-serif text-brand-gold mb-8 tracking-tighter leading-tight">
          La nueva era del <br />
          <span className="text-brand-white">placer en Ecuador</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-serif text-brand-gold/80 mb-16 tracking-wide">
          Inauguración exclusiva Marzo 2026
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="https://wa.me/593"
            className="group relative bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-12 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-gold flex items-center gap-3"
          >
            <MessageCircle size={24} fill="currentColor" />
            <span>¿Eres modelo? Regístrate aquí</span>
            <div className="absolute inset-0 rounded-full bg-brand-gold/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full" />

      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}
