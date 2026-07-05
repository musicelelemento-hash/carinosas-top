"use client";

import React from "react";
import { ShieldCheck, Lock, CheckCircle, Gem, MapPin } from "lucide-react";

export default function Footer() {
  const cities = ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Salinas', 'Ambato', 'Loja', 'Ibarra'];

  return (
    <footer className="relative overflow-hidden" style={{ background: '#040406', borderTop: '1px solid rgba(201,168,76,0.08)' }}>

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), rgba(201,168,76,0.7), rgba(201,168,76,0.5), transparent)' }} />

      {/* Background grid */}
      <div className="absolute inset-0 grid-lines opacity-40" />

      {/* Gold orb */}
      <div className="absolute bottom-0 right-[20%] w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main section */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* Brand col */}
          <div className="md:col-span-5 space-y-7">
            {/* Logo */}
            <div>
              <div className="flex items-baseline gap-0 mb-1">
                <span className="font-serif font-bold text-[1.8rem] tracking-[0.06em]" style={{
                  background: 'linear-gradient(135deg, #F5E0A0 0%, #C9A84C 40%, #9A7B35 70%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>CARIÑOSAS</span>
                <span className="font-serif font-bold text-[1.8rem] text-white/60 tracking-[0.06em]">.TOP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px w-5 bg-brand-gold/40" />
                <span className="text-[8px] text-brand-gold/30 uppercase font-black tracking-[0.6em]">Elite Digital Concierge</span>
              </div>
            </div>

            <p className="text-[10px] text-white/20 uppercase tracking-[0.35em] font-black leading-relaxed max-w-xs">
              El estándar de oro en servicios premium y exclusividad en Ecuador.
            </p>

            {/* Cities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={10} className="text-brand-gold/40" />
                <span className="text-[8px] text-brand-gold/30 uppercase font-black tracking-[0.5em]">Cobertura Nacional</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                  <span key={city}
                    className="px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.35em] text-white/20 hover:text-brand-gold/50 transition-colors cursor-default"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="md:col-span-1" />

          {/* Security */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[9px] font-black text-brand-gold/60 uppercase tracking-[0.5em] border-b border-brand-gold/8 pb-3">Seguridad VIP</h4>
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: 'Fotos 100% Verificadas', color: 'text-brand-pink' },
                { icon: Lock, text: 'Privacidad Encriptada', color: 'text-brand-gold' },
                { icon: Gem, text: 'Identidad Auditada', color: 'text-brand-gold' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3 group">
                  <Icon size={15} className={`${color} transition-transform group-hover:scale-110 duration-300`} />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 group-hover:text-white/50 transition-colors">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[9px] font-black text-brand-gold/60 uppercase tracking-[0.5em] border-b border-brand-gold/8 pb-3">Certificaciones</h4>
            <div className="space-y-3">
              {[
                { icon: '18+', label: 'Solo Adultos', sub: 'Acceso restringido +18' },
                { icon: '✓', label: 'Pago Seguro', sub: 'Transacciones cifradas' },
                { icon: '♦', label: 'Elite Verified', sub: 'Sello de exclusividad' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-center gap-4 p-3 rounded-xl group hover:scale-[1.02] transition-transform duration-300 cursor-default"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span className="font-serif font-bold text-base text-brand-gold/70 w-8 text-center shrink-0">{icon}</span>
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50">{label}</div>
                    <div className="text-[7px] uppercase tracking-[0.25em] text-white/15 font-black">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="divider-gold" />

        {/* Bottom bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3">
            <p className="text-[9px] text-white/15 uppercase tracking-[0.35em] font-black text-center md:text-left">
              Cariñosas.top © 2026 · All Rights Reserved
            </p>
            {/* SEO Block */}
            <p className="text-[7px] text-white/[0.06] leading-relaxed uppercase tracking-widest max-w-3xl text-justify select-none">
              Directorio #1 de Cariñosas en Quito, Guayaquil y todo el Ecuador. Encuentra las mejores acompañantes VIP, escorts independientes y
              servicios de lujo en sectores exclusivos como La Carolina, Samborondón y Manta. Superamos los estándares de plataformas como Skokka,
              ofreciendo fotos 100% verificadas, discreción total y una experiencia premium inigualable.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {['Términos', 'Privacidad', 'Contacto'].map(link => (
              <a key={link} href="#"
                className="text-[8px] font-black uppercase tracking-[0.5em] text-white/15 hover:text-brand-gold/50 transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
