"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Gem, MapPin, Sparkles, Heart, Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/soundEngine";

export default function Footer() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playGoldChime();
    }
  };

  const cities = [
    'Quito Norte', 'Cumbayá VIP', 'Guayaquil', 'Samborondón', 'Cuenca', 
    'Manta 5★', 'Salinas', 'Ambato', 'Loja', 'Machala', 'Santo Domingo', 
    'Medellín', 'Bogotá', 'Lima', 'Miami'
  ];

  return (
    <footer className="relative bg-[#08080B] border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-bold text-3xl text-brand-gold">CARIÑOSAS</span>
              <span className="font-serif font-bold text-3xl text-white">.TOP</span>
            </div>

            <p className="text-xs text-white/55 leading-relaxed max-w-sm">
              Directorio verificado de acompañantes en Ecuador y red internacional.
            </p>

            {/* Coverage Cities */}
            <div>
              <div className="flex items-center gap-2 mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                <MapPin size={12} className="text-brand-gold" />
                <span>Cobertura</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                  <span key={city}
                    className="px-3 py-1 rounded-full text-[11px] text-white/55 hover:text-brand-gold transition-colors border border-white/[0.1]"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Security & Privacy */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[11px] text-brand-gold uppercase tracking-[0.18em] border-b border-white/[0.07] pb-3">
              Seguridad
            </h4>
            <div className="space-y-3.5">
              {[
                { icon: ShieldCheck, text: 'Verificación 4K' },
                { icon: Lock, text: 'Privacidad y discreción' },
                { icon: Gem, text: 'Canal directo y seguro' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={16} className="text-brand-gold" />
                  <span className="text-[13px] text-white/72">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Certifications */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[11px] text-brand-gold uppercase tracking-[0.18em] border-b border-white/[0.07] pb-3">
              Certificaciones
            </h4>
            <div className="space-y-2.5">
              {[
                { icon: '18+', label: 'Solo adultos' },
                { icon: '✓', label: 'WhatsApp seguro' },
                { icon: '★', label: 'Sello 4K' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-2xl border border-white/[0.1]">
                  <span className="font-serif font-bold text-sm text-brand-gold w-6 text-center shrink-0">{icon}</span>
                  <span className="text-[13px] text-white/72">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-white/[0.07]" />

        {/* Bottom bar */}
        <div className="py-8 pb-28 md:pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[12px] text-white/45 text-center md:text-left">
            Cariñosas.top © 2026 · Ecuador · Solo mayores de 18 años
          </p>

          <div className="flex flex-wrap items-center gap-5 font-mono text-[11px] text-white/45 uppercase tracking-[0.1em]">
            <button
              onClick={handleToggleSound}
              title={isMuted ? "Activar sonido" : "Silenciar sonido"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.1] transition-colors hover:text-brand-gold cursor-pointer"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            <Link href="/publicar-anuncio" className="hover:text-brand-gold transition-colors">Publicar Anuncio</Link>
            <Link href="/radar" className="hover:text-brand-gold transition-colors">Geo-Radar</Link>
            <Link href="/boveda-secreta" className="hover:text-brand-gold transition-colors">Bóveda 4K</Link>
            <Link href="/registro" className="hover:text-brand-gold transition-colors">Registro Modelo</Link>
            <Link href="/admin" className="hover:text-brand-gold transition-colors">Admin</Link>
            <a href="https://wa.me/593987654321" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">Soporte Concierge</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
