"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Crown, Shield, Star, ArrowRight, Gem, Lock, Sparkles, MessageCircle, CheckCircle2, QrCode, Wifi } from "lucide-react";

export default function VIPLounge() {
  const [isHoveredCard, setIsHoveredCard] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    setRotateX(-((y - centerY) / 12));
    setRotateY((x - centerX) / 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHoveredCard(false);
  };

  const handleRequestAccess = () => {
    const text = encodeURIComponent("Hola Concierge de Cariñosas.top, deseo solicitar la Membresía VIP Alpha para acceso al catálogo privado.");
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  return (
    <section className="relative py-36 overflow-hidden bg-[#08080C]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Left gold border line */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT COLUMN: Narrative & Benefits */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-obsidian border border-brand-gold/30 shadow-[0_0_20px_rgba(212,168,67,0.2)]">
              <Crown size={14} className="text-brand-gold fill-brand-gold animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold">Círculo Privado Alpha</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="font-serif font-bold leading-[1.05] tracking-tight">
                <span className="block text-white/90 text-4xl sm:text-6xl lg:text-7xl">Salón Privado</span>
                <span className="block italic text-4xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent">
                  VIP Lounge
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="font-serif text-base sm:text-lg text-white/60 leading-relaxed max-w-xl italic">
              Diseñado exclusivamente para clientes de alto perfil en Ecuador. Accede a perfiles no públicos, reservas prioritarias sin esperas y atención personalizada con encriptación AES-256.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: 'Discreción Total', desc: 'Protocolo de cero rastro digital' },
                { icon: Gem, title: 'Bóveda 4K Privada', desc: 'Acceso a galerías y audios sin censura' },
                { icon: Lock, title: 'Reserva Blindada', desc: 'Confirmación directa por canal seguro' },
                { icon: Star, title: 'Atención 24/7', desc: 'Concierge humano preferencial' },
              ].map(({ icon: Icon, title, desc }) => (
                <div 
                  key={title} 
                  className="p-5 rounded-3xl glass-obsidian border border-white/10 hover:border-brand-gold/40 transition-all group"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Icon size={14} className="text-brand-gold group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">{title}</span>
                  </div>
                  <p className="text-[9px] text-white/40 font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRequestAccess}
                className="px-10 py-5 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.25em] transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(212,168,67,0.4)] flex items-center justify-center gap-3"
              >
                <Sparkles size={16} />
                Solicitar Pase VIP Alpha
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Holographic Digital Member Pass */}
          <div className="relative flex justify-center">
            
            {/* Background Decorative Rings */}
            <div className="absolute -inset-8 rounded-full border border-brand-gold/15 animate-spin-slow pointer-events-none" />
            <div className="absolute -inset-16 rounded-full border border-white/5 pointer-events-none" />

            {/* 3D Interactive Card Container */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveredCard(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: isHoveredCard ? 'none' : 'transform 0.6s ease-out'
              }}
              className="w-full max-w-[420px] aspect-[1.58/1] rounded-[2.5rem] p-8 relative overflow-hidden glass-obsidian border-2 border-brand-gold/50 shadow-[0_30px_90px_rgba(0,0,0,0.95)] cursor-pointer group select-none"
            >
              {/* Card Holographic Reflection Foil */}
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-gold/15 to-transparent opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity"
                style={{
                  transform: `translate(${rotateY * 4}px, ${rotateX * 4}px)`
                }}
              />

              {/* Carbon Texture Subtle Layer */}
              <div className="absolute inset-0 bg-[radial-gradient(#d4a843_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              {/* CARD CONTENT */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                
                {/* Top Header of Card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown size={22} className="text-brand-gold fill-brand-gold" />
                    <div>
                      <span className="text-xs font-serif italic text-white font-bold block leading-none">Cariñosas.top</span>
                      <span className="text-[7px] text-brand-gold uppercase font-black tracking-[0.3em]">VIP ALPHA PASS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-brand-gold/60">
                    <Wifi size={16} className="rotate-90" />
                    <span className="text-[8px] font-mono border border-brand-gold/30 px-1.5 py-0.5 rounded text-brand-gold">NFC</span>
                  </div>
                </div>

                {/* Card Middle: Gold Chip & Holographic Number */}
                <div className="my-auto flex items-center justify-between">
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-[#9a7b35] via-[#f5e0a0] to-[#c9a84c] p-[2px] shadow-md">
                    <div className="w-full h-full border border-black/40 rounded-md grid grid-cols-2 gap-1 p-1 bg-gradient-to-br from-amber-200 to-yellow-600">
                      <div className="border-r border-black/20" />
                      <div className="border-l border-black/20" />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] text-white/40 uppercase font-black tracking-widest block">Access Code</span>
                    <span className="font-mono text-sm tracking-[0.25em] text-white font-bold">•••• •••• 8472</span>
                  </div>
                </div>

                {/* Card Bottom: Member Name and Validity */}
                <div className="flex items-end justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[7px] text-brand-gold uppercase font-black tracking-widest block">Miembro Titular</span>
                    <span className="text-sm font-serif italic text-white font-bold tracking-wider">SOCIO EXCLUSIVO</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[7px] text-white/40 uppercase font-black tracking-widest block">Estado</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ALPHA ACTIVE
                    </span>
                  </div>
                </div>

              </div>

              {/* Glowing Corner Badge */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-brand-gold/20 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Floating Live Counter Badge */}
            <div className="absolute -bottom-6 -left-4 p-5 rounded-2xl glass-obsidian border border-brand-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[8px] text-white/40 uppercase font-black tracking-widest block">Miembros en Línea</span>
                <span className="font-serif text-xl font-bold text-brand-gold leading-none">2,847 VIPs</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
