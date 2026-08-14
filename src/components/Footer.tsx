"use client";

import React from "react";
import { ShieldCheck, Lock, Gem, MapPin, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const cities = ['Quito Norte', 'Cumbayá VIP', 'Guayaquil', 'Samborondón', 'Cuenca', 'Manta 5★', 'Salinas', 'Ambato', 'Loja', 'Machala'];

  return (
    <footer className="relative overflow-hidden bg-[#040406] border-t border-brand-gold/15">

      {/* Top gold ambient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

      {/* Background grid */}
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />

      {/* Gold ambient orb */}
      <div className="absolute bottom-0 right-[20%] w-[500px] h-[300px] pointer-events-none bg-brand-gold/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main section */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-serif font-bold text-3xl sm:text-4xl italic bg-gradient-to-r from-[#F5E0A0] via-[#D4A843] to-[#F5E0A0] bg-clip-text text-transparent">
                  CARIÑOSAS
                </span>
                <span className="font-serif font-bold text-3xl sm:text-4xl text-white">.TOP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-brand-gold/50" />
                <span className="text-[8px] text-brand-gold uppercase font-black tracking-[0.5em]">Directorio Élite Digital Ecuador</span>
              </div>
            </div>

            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              El círculo privado de mayor prestigio y discreción para caballeros de alto perfil y modelos independientes en Ecuador.
            </p>

            {/* Coverage Cities */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={12} className="text-brand-gold" />
                <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest">Cobertura Exclusiva Nacional</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                  <span key={city}
                    className="px-3 py-1 rounded-full text-[9px] text-white/60 hover:text-brand-gold transition-colors glass-obsidian border border-white/10"
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
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] border-b border-brand-gold/20 pb-3">
              Seguridad & Blindaje VIP
            </h4>
            <div className="space-y-3.5">
              {[
                { icon: ShieldCheck, text: 'Verificación 4K Manual', color: 'text-brand-gold' },
                { icon: Lock, text: 'Encriptación AES-256', color: 'text-brand-gold' },
                { icon: Gem, text: 'Discreción Absoluta', color: 'text-brand-gold' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3 group">
                  <Icon size={16} className={`${color} transition-transform group-hover:scale-110`} />
                  <span className="text-xs text-white/60 group-hover:text-white transition-colors">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Certifications */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] border-b border-brand-gold/20 pb-3">
              Certificaciones
            </h4>
            <div className="space-y-2.5">
              {[
                { icon: '18+', label: 'Solo Adultos', sub: 'Acceso Estricto +18' },
                { icon: '✓', label: 'WhatsApp Seguro', sub: 'Canal Directo Encriptado' },
                { icon: '★', label: 'Sello Alpha 4K', sub: 'Exclusividad Garantizada' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3.5 p-3 rounded-2xl glass-obsidian border border-white/10 group hover:border-brand-gold/30 transition-all">
                  <span className="font-serif font-bold text-sm text-brand-gold w-6 text-center shrink-0">{icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white/80">{label}</div>
                    <div className="text-[9px] text-white/40">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-white/10" />

        {/* Bottom bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs text-white/40">
              Cariñosas.top © 2026 · Todos los Derechos Reservados · Ecuador
            </p>
            <p className="text-[8px] text-white/20 leading-relaxed uppercase tracking-widest max-w-2xl">
              Plataforma digital para mayores de 18 años. Anuncios independientes de acompañamiento y modelaje en Quito, Guayaquil y todo Ecuador.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] text-white/40 uppercase tracking-widest font-black">
            <a href="/registro" className="hover:text-brand-gold transition-colors">Registro de Modelos</a>
            <a href="/admin" className="hover:text-brand-gold transition-colors">Administración</a>
            <a href="https://wa.me/593987654321" target="_blank" className="text-brand-gold hover:underline">Soporte VIP</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
