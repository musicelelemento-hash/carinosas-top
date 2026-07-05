"use client";

import React from "react";
import Image from "next/image";
import { Crown, Shield, Star, ArrowRight, Gem, Lock } from "lucide-react";

export default function VIPLounge() {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* Full-bleed background */}
      <div className="absolute inset-0 -z-10" style={{ background: '#07070A' }} />

      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2560"
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.06, filter: 'grayscale(100%) contrast(1.3)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #07070A 0%, rgba(7,7,10,0.6) 50%, #07070A 100%)' }} />
      </div>

      {/* Left gold accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)' }} />

      {/* Corner ornament */}
      <div className="absolute top-12 right-16 font-signature text-[140px] select-none pointer-events-none"
        style={{ color: 'rgba(201,168,76,0.025)', transform: 'rotate(-12deg)', lineHeight: 1 }}
      >
        Elite
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          {/* LEFT COLUMN */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-gold">
              <Crown size={13} className="text-brand-gold fill-brand-gold" style={{ animation: 'humanPulse 3s ease-in-out infinite' }} />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-brand-gold/80">Solo para Miembros</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="font-serif font-bold leading-[1.05] tracking-tight">
                <span className="block text-white/80" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>Bienvenido al</span>
                <span className="block italic" style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  background: 'linear-gradient(135deg, #F5E0A0 0%, #C9A84C 35%, #9A7B35 65%, #C9A84C 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer-gold 5s linear infinite',
                }}>Salón VIP Alpha</span>
              </h2>
            </div>

            {/* Description */}
            <p className="font-serif text-lg text-white/35 leading-relaxed max-w-lg">
              Accede a un nivel superior de exclusividad. Perfiles verificados manualmente, atención prioritaria y encuentros diseñados para la élite discreta.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Shield, title: 'Discreción Total', desc: 'Cero rastro digital garantizado' },
                { icon: Gem, title: 'Élite Alpha', desc: 'Seleccionado por equipo experto' },
                { icon: Lock, title: 'Encriptado', desc: 'Protocolo de privacidad máximo' },
                { icon: Star, title: 'Verificado 4K', desc: 'Autenticación de fotos Ultra HD' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group p-4 rounded-2xl transition-all duration-500 hover:scale-[1.02] cursor-default"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon size={13} className="text-brand-gold" />
                    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/80">{title}</span>
                  </div>
                  <p className="text-[8px] text-white/25 uppercase tracking-[0.3em] font-black leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className="group flex items-center gap-5 px-10 py-5 rounded-2xl font-black text-[9px] uppercase tracking-[0.45em] transition-all duration-400 active:scale-95 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #D4B060 0%, #C9A84C 50%, #B8962A 100%)',
                color: '#060608',
                boxShadow: '0 0 40px rgba(201,168,76,0.2), 0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              <span className="relative z-10 flex items-center gap-4">
                Solicitar Membresía
                <ArrowRight size={15} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-400" />
            </button>
          </div>

          {/* RIGHT COLUMN: Image */}
          <div className="relative">
            {/* Decorative border frame */}
            <div className="absolute -inset-4 rounded-[3.5rem] opacity-30"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.2), transparent 60%)',
                border: '1px solid rgba(201,168,76,0.1)',
              }}
            />

            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group"
              style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(201,168,76,0.05)' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200"
                alt="VIP Lounge"
                fill
                className="object-cover transition-all duration-1200 group-hover:scale-110"
                style={{ filter: 'grayscale(40%) brightness(0.7)', transition: 'transform 1.2s cubic-bezier(0.23,1,0.32,1), filter 0.8s ease' }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 transition-opacity duration-700"
                style={{ background: 'linear-gradient(to top, rgba(7,7,10,0.9) 0%, rgba(7,7,10,0.3) 50%, transparent 100%)' }}
              />

              {/* Hover card */}
              <div className="absolute bottom-8 left-8 right-8 p-7 rounded-[2rem] transition-all duration-700 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                style={{
                  background: 'rgba(7,7,10,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-xl text-white italic">La Selección Exclusiva</h4>
                  <Star size={14} className="text-brand-gold fill-brand-gold" />
                </div>
                <p className="text-[8px] text-white/30 uppercase font-black tracking-[0.3em] leading-relaxed">
                  Directorio oculto · Exclusivo para miembros VIP Alpha · Verificación manual
                </p>
              </div>

              {/* Top corner badge */}
              <div className="absolute top-6 right-6 p-3 rounded-xl"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', backdropFilter: 'blur(10px)' }}
              >
                <Crown size={16} className="text-brand-gold fill-brand-gold" />
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 p-5 rounded-2xl z-10"
              style={{ background: 'rgba(10,10,14,0.95)', border: '1px solid rgba(201,168,76,0.2)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
            >
              <div className="text-[8px] text-white/25 uppercase font-black tracking-[0.4em] mb-1">Miembros activos</div>
              <div className="font-serif text-3xl font-bold" style={{
                background: 'linear-gradient(135deg, #F5E0A0, #C9A84C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>2,847</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
