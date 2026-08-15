"use client";

import React, { useState } from "react";
import { 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Check, 
  X, 
  Zap, 
  Eye, 
  Clock, 
  MapPin, 
  Flame, 
  HeartHandshake,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";
import VIPCard3D from "./VIPCard3D";
import VIPCheckoutModal from "./VIPCheckoutModal";

export default function GentlemenClubSection() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const perks = [
    {
      icon: <Lock className="text-brand-gold" size={20} />,
      title: "Bóveda Secreta 4K Sin Censura",
      desc: "Acceso ilimitado a más de 50 sets de fotos íntimas, videos 4K y backstages en suites privadas."
    },
    {
      icon: <Crown className="text-brand-gold" size={20} />,
      title: "Modelos Alpha Ocultas",
      desc: "Directorio no público de modelos universitarias y de alta sociedad que solo reciben a socios verificados."
    },
    {
      icon: <Clock className="text-brand-gold" size={20} />,
      title: "Concierge White Glove 24/7",
      desc: "Despacho prioritario en < 2 minutos para reservas en suites de hoteles 5★ y transporte ejecutivo."
    },
    {
      icon: <ShieldCheck className="text-brand-gold" size={20} />,
      title: "Blindaje Antiespía & Camuflaje",
      desc: "Modo Pánico instantáneo (ESC) que disfraza la pantalla en terminal de Bloomberg o Excel en 0.1s."
    }
  ];

  return (
    <section className="py-28 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 relative overflow-hidden" id="club-caballeros">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-obsidian border border-brand-gold/40 text-brand-gold text-[9px] font-black uppercase tracking-[0.35em] shadow-[0_0_25px_rgba(212,168,67,0.25)]">
          <Crown size={13} className="fill-brand-gold" />
          <span>El Club Privado de Caballeros · Alpha Lounge</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white italic tracking-tight leading-none">
          ¿Por qué vale la pena{" "}
          <span className="text-gold-shimmer">ser Socio VIP?</span>
        </h2>

        <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light max-w-xl mx-auto">
          Los usuarios comunes solo ven el catálogo superficial. Los miembros del Club Alpha disfrutan del verdadero poder de la plataforma con máxima discreción.
        </p>
      </div>

      {/* ── 3D CARD SHOWCASE & VALUE PROPOSITION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left 5 Cols: Interactive 3D Metal Pass */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <VIPCard3D 
            onUpgradeClick={() => setIsCheckoutOpen(true)}
            memberCode="ALPHA-8842-VIP"
            tier="Black Diamond"
            memberName="SOCIO CONFIDENCIAL"
          />
          <p className="text-[9px] text-white/30 uppercase font-mono tracking-widest mt-2">
            Pasa el cursor o inclina la pantalla para interactuar
          </p>
        </div>

        {/* Right 7 Cols: 4 Key Perks */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-3xl glass-obsidian border border-white/10 hover:border-brand-gold/40 transition-all space-y-3 shadow-xl"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
                {perk.icon}
              </div>
              <h3 className="font-serif font-bold text-white text-lg">{perk.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>

      {/* ── COMPARISON TABLE: GRATIS VS SOCIO ALPHA ── */}
      <div className="glass-obsidian border border-brand-gold/30 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.9)] space-y-8">
        <div className="text-center space-y-1">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white italic">
            Comparativa de Privilegios
          </h3>
          <p className="text-xs text-white/40">Compara lo que obtienes como visitante vs socio verificado</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase font-black tracking-wider">
                <th className="py-4 px-4">Beneficio / Función</th>
                <th className="py-4 px-4 text-center">Visitante Gratis</th>
                <th className="py-4 px-4 text-center text-brand-gold">Socio Alpha VIP 👑</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Catálogo de Modelos Públicas", free: "Solo fotos estándar", vip: "Fotos & Videos 4K Ultra HD" },
                { name: "Bóveda Secreta Sin Censura", free: "Bloqueada 🔒", vip: "Acceso Ilimitado ✓" },
                { name: "Directorio de Modelos Ocultas (No Públicas)", free: "Invisible ✕", vip: "Desbloqueado ✓" },
                { name: "Tiempo de Respuesta Promedio", free: "30 - 60 minutos", vip: "< 2 minutos prioritario" },
                { name: "Notas de Voz y Audios en Vivo", free: "Limitado", vip: "Escucha Ilimitada 24K" },
                { name: "Blindaje Antiespía (Modo Pánico ESC)", free: "No disponible", vip: "Activo en toda la sesión ✓" },
                { name: "Reserva en Suites de Hoteles 5★", free: "Sin asistencia", vip: "Concierge Personal Asignado" }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white/90">{row.name}</td>
                  <td className="py-4 px-4 text-center text-white/40">{row.free}</td>
                  <td className="py-4 px-4 text-center font-bold text-brand-gold font-mono">{row.vip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-white/40 uppercase font-black block">Membresía Confidencial</span>
            <span className="text-xl font-serif font-bold text-brand-gold">$49 USD · Acceso Vitalicio Ilimitado</span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(212,168,67,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Adquirir Pase Alpha VIP</span>
          </button>
        </div>

      </div>

      {/* Checkout Modal */}
      <VIPCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName="Pase Alpha Founder"
        planPrice={49}
      />

    </section>
  );
}
