"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Crown, 
  Shield, 
  Star, 
  ArrowRight, 
  Gem, 
  Lock, 
  Sparkles, 
  MessageCircle, 
  CheckCircle2, 
  Wifi,
  EyeOff,
  Flame,
  UserCheck,
  Zap
} from "lucide-react";

import VIPCheckoutModal from "@/components/VIPCheckoutModal";

export default function VIPLounge() {
  const [activeTab, setActiveTab] = useState<'gentleman' | 'muse'>('gentleman');
  const [isHoveredCard, setIsHoveredCard] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
    setIsCheckoutOpen(true);
  };

  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-[#08080C]" id="vip-lounge">
      {/* Background ambient lighting */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] pointer-events-none transition-all duration-700 ${
        activeTab === 'gentleman' ? 'bg-brand-gold/10' : 'bg-brand-pink/15'
      }`} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Gold side border line */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-brand-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">

        {/* ── HEADER & DUAL TAB SWITCHER ── */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-obsidian border border-brand-gold/30 shadow-[0_0_25px_rgba(212,168,67,0.2)]">
            <Crown size={14} className="text-brand-gold fill-brand-gold animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold">Círculo Secreto Alpha</span>
          </div>

          <h2 className="font-serif font-bold text-4xl sm:text-6xl text-white tracking-tight">
            Club Privado <span className="italic bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent">VIP Match</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-serif italic max-w-xl mx-auto">
            Un espacio confidencial donde caballeros VIP y modelos verificadas se conectan en privado. Quienes usan la versión gratis solo ven el catálogo público.
          </p>

          {/* Segmented Tab Switch (Para Él vs Para Ella) */}
          <div className="inline-flex p-1.5 rounded-2xl glass-obsidian border border-white/10 shadow-2xl">
            <button
              onClick={() => setActiveTab('gentleman')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'gentleman'
                  ? 'bg-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.4)]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Crown size={13} />
              Para Él (Caballero VIP)
            </button>

            <button
              onClick={() => setActiveTab('muse')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'muse'
                  ? 'bg-brand-pink text-white shadow-[0_0_20px_rgba(255,0,98,0.4)]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Flame size={13} />
              Para Ella (Modelo VIP)
            </button>
          </div>
        </div>

        {/* ── DUAL CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Benefits Narrative */}
          <div className="space-y-8 animate-in fade-in duration-500 key={activeTab}">
            
            <div className="space-y-3">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] block ${
                activeTab === 'gentleman' ? 'text-brand-gold' : 'text-brand-pink'
              }`}>
                {activeTab === 'gentleman' ? '✦ Membresía Exclusiva Caballero' : '✦ Pase de Creadora & Modelo VIP'}
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl text-white italic font-bold">
                {activeTab === 'gentleman' 
                  ? 'Acceso a la Bóveda de Modelos Privadas' 
                  : 'Conexión con Clientes High Net Worth Verificados'}
              </h3>

              <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                {activeTab === 'gentleman'
                  ? 'Las modelos más cotizadas y discretas de Quito y Guayaquil no publican en el directorio abierto. Solo los socios con Pase Alpha pueden ver sus galerías completas y contactarlas.'
                  : 'Atrae únicamente a clientes serios, solventes y respetuosos. Filtramos curiosos y usuarios sin membresía para garantizar tu seguridad y tarifas premium sin comisiones.'}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(activeTab === 'gentleman' ? [
                { icon: EyeOff, title: 'Cero Rastro Digital', desc: 'Navegación incógnita encriptada' },
                { icon: Gem, title: 'Bóveda 4K Privada', desc: 'Fotos y audios no públicos' },
                { icon: Lock, title: 'Reserva Blindada', desc: 'WhatsApp directo de alta prioridad' },
                { icon: UserCheck, title: 'Atención Concierge', desc: 'Asistencia personalizada 24/7' },
              ] : [
                { icon: Shield, title: 'Clientes Verificados', desc: 'Cero spam o usuarios curiosos' },
                { icon: Zap, title: '100% Pagos Directos', desc: 'Cero comisiones ni intermediarios' },
                { icon: Sparkles, title: 'Sello Alpha 4K', desc: 'Posicionamiento en la sala oculta' },
                { icon: Lock, title: 'Máxima Privacidad', desc: 'Oculta tu perfil del público gratis' },
              ]).map(({ icon: Icon, title, desc }) => (
                <div 
                  key={title} 
                  className="p-4 sm:p-5 rounded-2xl glass-obsidian border border-white/10 hover:border-brand-gold/40 transition-all group"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Icon size={15} className={`group-hover:scale-110 transition-transform ${
                      activeTab === 'gentleman' ? 'text-brand-gold' : 'text-brand-pink'
                    }`} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">{title}</span>
                  </div>
                  <p className="text-[9px] text-white/40 font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleRequestAccess}
                className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-3 ${
                  activeTab === 'gentleman'
                    ? 'bg-brand-gold hover:bg-white text-brand-black shadow-[0_10px_40px_rgba(212,168,67,0.4)]'
                    : 'bg-brand-pink hover:bg-white text-white hover:text-brand-black shadow-[0_10px_40px_rgba(255,0,98,0.4)]'
                }`}
              >
                <MessageCircle size={16} fill="currentColor" />
                <span>Activar {activeTab === 'gentleman' ? 'Pase Caballero VIP' : 'Pase Modelo VIP'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

          {/* RIGHT: 3D Holographic Digital Member Pass (Gentleman / Muse) */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Ambient slow spinning ring */}
            <div className="absolute -inset-8 rounded-full border border-brand-gold/15 animate-spin-slow pointer-events-none" />

            {/* 3D Card */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveredCard(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: isHoveredCard ? 'none' : 'transform 0.6s ease-out'
              }}
              className={`w-full max-w-[420px] aspect-[1.58/1] rounded-[2.5rem] p-7 sm:p-8 relative overflow-hidden glass-obsidian border-2 shadow-[0_30px_90px_rgba(0,0,0,0.95)] cursor-pointer group select-none ${
                activeTab === 'gentleman' 
                  ? 'border-brand-gold/60 shadow-[0_0_50px_rgba(212,168,67,0.25)]' 
                  : 'border-brand-pink/60 shadow-[0_0_50px_rgba(255,0,98,0.25)]'
              }`}
            >
              {/* Foil Shimmer */}
              <div 
                className={`absolute inset-0 bg-gradient-to-tr opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none ${
                  activeTab === 'gentleman'
                    ? 'from-transparent via-brand-gold/20 to-transparent'
                    : 'from-transparent via-brand-pink/20 to-transparent'
                }`}
                style={{
                  transform: `translate(${rotateY * 4}px, ${rotateX * 4}px)`
                }}
              />

              {/* Carbon grid texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#d4a843_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              {/* Card Elements */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Crown size={22} className={activeTab === 'gentleman' ? 'text-brand-gold fill-brand-gold' : 'text-brand-pink fill-brand-pink'} />
                    <div>
                      <span className="text-xs font-serif italic text-white font-bold block leading-none">Cariñosas.top</span>
                      <span className={`text-[7px] uppercase font-black tracking-[0.3em] ${
                        activeTab === 'gentleman' ? 'text-brand-gold' : 'text-brand-pink'
                      }`}>
                        {activeTab === 'gentleman' ? 'ALPHA GENTLEMAN PASS' : 'ALPHA MUSE ELITE PASS'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/50">
                    <Wifi size={16} className="rotate-90" />
                    <span className="text-[8px] font-mono border border-white/20 px-1.5 py-0.5 rounded text-white/80">NFC</span>
                  </div>
                </div>

                {/* Chip & Member ID */}
                <div className="my-auto flex items-center justify-between">
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-[#9a7b35] via-[#f5e0a0] to-[#c9a84c] p-[2px] shadow-md">
                    <div className="w-full h-full border border-black/40 rounded-md grid grid-cols-2 gap-1 p-1 bg-gradient-to-br from-amber-200 to-yellow-600">
                      <div className="border-r border-black/20" />
                      <div className="border-l border-black/20" />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] text-white/40 uppercase font-black tracking-widest block">Access ID</span>
                    <span className="font-mono text-sm tracking-[0.2em] text-white font-bold">
                      {activeTab === 'gentleman' ? 'ALPHA-8472-VIP' : 'MUSE-4921-VIP'}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-end justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[7px] text-white/40 uppercase font-black tracking-widest block">Categoría</span>
                    <span className="text-sm font-serif italic text-white font-bold tracking-wider">
                      {activeTab === 'gentleman' ? 'SOCIO CABALLERO' : 'MUSA VERIFICADA 4K'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[7px] text-white/40 uppercase font-black tracking-widest block">Estado</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVO
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Locked Vault Teaser Box */}
            <div className="w-full max-w-[420px] mt-6 p-4 rounded-2xl glass-obsidian border border-brand-gold/30 flex items-center gap-3.5 shadow-xl">
              <div className="w-9 h-9 rounded-xl bg-brand-gold/15 flex items-center justify-center border border-brand-gold/30 text-brand-gold shrink-0">
                <Lock size={16} />
              </div>
              <div className="flex-1">
                <span className="text-[8px] text-brand-gold uppercase font-black tracking-widest block">Sala Oculta Protegida</span>
                <p className="text-[10px] text-white/70 leading-tight">
                  {activeTab === 'gentleman'
                    ? '48 Modelos VIP disponibles solo para socios verificados.'
                    : '120 Clientes VIP con fondos comprobados buscando citas.'}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Discreet Checkout Modal */}
      <VIPCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={activeTab === 'gentleman' ? 'Pase Alpha Caballero VIP' : 'Pase Alpha Musa / Modelo VIP'}
        planPrice={activeTab === 'gentleman' ? '$50 USD' : '$50 USD / mes'}
      />
    </section>
  );
}
