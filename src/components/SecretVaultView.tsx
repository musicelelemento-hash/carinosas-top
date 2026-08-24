"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Lock, 
  Crown, 
  Eye, 
  Sparkles, 
  Compass, 
  Play, 
  Volume2, 
  ShieldCheck, 
  Building, 
  Plane, 
  Hotel, 
  ArrowLeft,
  Flame,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/soundEngine";
import VIPCheckoutModal from "./VIPCheckoutModal";

const VAULT_PREVIEW_GRID = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=800",
];

const VAULT_ITEMS = [
  {
    id: "v-1",
    model: "Valeria VIP",
    city: "Machala",
    title: "Sesión 4K Hotel Oro Verde Suite",
    mediaCount: "12 Fotos + 1 Vídeo 360°",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    isUnlocked: true
  },
  {
    id: "v-2",
    model: "Alessandra Gold",
    city: "Guayaquil",
    title: "Experiencia Privada Samborondón",
    mediaCount: "8 Fotos + Audio Privado",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    isUnlocked: true
  },
  {
    id: "v-3",
    model: "Valentina Elite",
    city: "Quito",
    title: "Penthouse Cumbayá VIP Night",
    mediaCount: "15 Fotos 4K",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    isUnlocked: true
  }
];

export default function SecretVaultView() {
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [hasVIPPass, setHasVIPPass] = useState<string | null>(null);

  React.useEffect(() => {
    const checkPass = () => {
      try {
        setHasVIPPass(localStorage.getItem("vip_pass_code") || localStorage.getItem("carinosas_vip_pass"));
      } catch {}
    };
    checkPass();
    window.addEventListener("storage", checkPass);
    window.addEventListener("vip_pass_updated", checkPass);
    return () => {
      window.removeEventListener("storage", checkPass);
      window.removeEventListener("vip_pass_updated", checkPass);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080B] text-white pt-24 pb-28 md:pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">

        {/* ── TOP VAULT HEADER ── */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-brand-gold/70 hover:text-brand-gold transition-colors mb-2"
          >
            <ArrowLeft size={12} />
            <span>Volver al Directorio</span>
          </Link>

          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-brand-gold/40 text-brand-gold">
            <Lock size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Bóveda Secreta 4K · Club Privado
            </span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Acceso Exclusivo <span className="italic text-brand-gold">Diamante</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#A1A1AA] uppercase tracking-[0.2em] font-medium max-w-lg">
            Contenido multimedia sin censura, sesiones 360° y reservas de alto perfil.
          </p>
        </div>

        {/* ── BÓVEDA: dos estados (bloqueada / desbloqueada), spec ── */}
        <div className="rounded-3xl border border-white/[0.1] overflow-hidden bg-[#0C0C10]">
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.07]">
            <div>
              <span className="font-serif text-lg font-bold text-white block">Bóveda</span>
              <span className="text-[12px] font-mono text-white/45">48 archivos · solo socios</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-brand-gold">
              {hasVIPPass ? <CheckCircle2 size={17} /> : <Lock size={17} />}
            </div>
          </div>

          <div
            className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5"
            style={{ transition: "filter .4s" }}
          >
            {VAULT_PREVIEW_GRID.map((src, i) => (
              <div
                key={src}
                className="relative rounded-2xl overflow-hidden bg-[#101014]"
                style={{ height: hasVIPPass ? 132 : 150 }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  style={!hasVIPPass && i !== 0 ? { filter: "blur(14px) brightness(.55)" } : undefined}
                />
                {hasVIPPass ? (
                  <span className="absolute left-2.5 bottom-2.5 px-2.5 py-1 rounded-lg bg-[#08080B]/72 font-mono text-[11px] text-white">
                    {i % 2 === 0 ? "0:24" : "Foto"}
                  </span>
                ) : i === 0 ? (
                  <span className="absolute left-2.5 bottom-2.5 px-2.5 py-1 rounded-lg bg-[#08080B]/72 font-mono text-[11px] text-white">
                    Vista previa
                  </span>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={22} className="text-white/75" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {hasVIPPass ? (
              <>
                <div className="flex-1 px-4 py-3.5 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[14px] font-bold text-emerald-400 block">Pase activo hasta el 23 sep</span>
                    <span className="text-[13px] text-white/60">Renovación automática · cancela cuando quieras.</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="btn-ghost px-6 shrink-0"
                  style={{ minHeight: 44 }}
                >
                  Gestionar pase
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 px-4 py-3.5 rounded-2xl border border-brand-gold/30 bg-brand-gold/[0.06]">
                  <span className="text-[14px] font-bold text-brand-gold block">Pase de socio · $80/mes</span>
                  <span className="text-[13px] text-white/60">Bóveda completa, historias privadas y agenda anticipada.</span>
                </div>
                <button
                  onClick={() => { sound.playIrisAperture(); setIsCheckoutOpen(true); }}
                  className="btn-gold px-6 shrink-0"
                  style={{ minHeight: 44 }}
                >
                  Activar pase
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── 360° VIDEO EXPERIENCE HERO TEASER ── */}
        <div className="rounded-3xl overflow-hidden glass-obsidian border border-brand-gold/40 relative group p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/20 border border-brand-pink/40 text-brand-pink text-[9px] font-black uppercase tracking-wider">
                <Compass size={12} className="animate-spin" />
                <span>Vídeo Interactivo 360° Giroscópico</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Sumérgete en la Suite con Valeria VIP (Machala)
              </h2>

              <p className="text-xs text-white/70 leading-relaxed">
                Controla el ángulo visual girando tu smartphone o arrastrando con el dedo. Calidad cinematográfica 4K sin interrupciones.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playGoldChime();
                    setActiveMedia("360-valeria");
                  }}
                  className="px-6 py-3 rounded-2xl bg-brand-gold hover:bg-white text-brand-black text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-gold/30 flex items-center gap-2 cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Reproducir en 360°</span>
                </button>
                <span className="text-[10px] text-white/40 font-mono">Duración: 4:18 min</span>
              </div>
            </div>

            <div 
              onClick={() => {
                sound.playGoldChime();
                setActiveMedia("360-valeria");
              }}
              className="relative w-full lg:w-72 h-48 rounded-2xl overflow-hidden border border-brand-gold/30 shrink-0 cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
                alt="Valeria 360"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-brand-gold text-brand-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── EXCLUSIVE PHOTO & VIDEO SETS GRID ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Galerías Privadas de la Bóveda
              </h2>
              <span className="text-xs text-white/40 font-mono">Actualizado diariamente con material exclusivo</span>
            </div>
            <span className="text-xs font-mono text-brand-gold">3 Sets Disponibles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {VAULT_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl overflow-hidden glass-obsidian border border-white/10 hover:border-brand-gold/50 transition-all group flex flex-col justify-between"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.model}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-dark border border-white/20 text-[9px] font-mono text-white flex items-center gap-1">
                    <Eye size={11} /> {item.mediaCount}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[9px] font-black uppercase text-brand-gold block">{item.city} VIP</span>
                    <h3 className="font-serif text-lg font-bold text-white">{item.model}</h3>
                    <p className="text-xs text-white/60 mt-0.5">{item.title}</p>
                  </div>

                  <Link
                    href="/concierge"
                    onClick={() => sound.playSubtleClick()}
                    className="w-full py-2.5 rounded-xl glass-dark border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-black text-brand-gold text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>Coordinar Encuentro Privado</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRIVATE CONCIERGE DIRECT EXPERIENCES ── */}
        <div className="rounded-3xl p-8 glass-obsidian border border-brand-gold/30 text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <Crown size={28} className="text-brand-gold mx-auto animate-pulse" />
            <h2 className="font-serif text-2xl font-bold text-white">Servicios de Ultra Alta Gama</h2>
            <p className="text-xs text-white/60">Coordinación de suites presidenciales, yates en Manta/Salinas y traslados privados.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Penthouses & Suites 5★", sub: "Oro Verde / Hilton / Swissôtel", icon: Hotel },
              { title: "Yates & Playas Privadas", sub: "Manta & Salinas VIP", icon: Building },
              { title: "Vuelos & Escapadas", sub: "Giras VIP Confidenciales", icon: Plane },
            ].map((srv) => {
              const Icon = srv.icon;
              return (
                <div key={srv.title} className="p-5 rounded-2xl glass-dark border border-white/10 text-center space-y-2 hover:border-brand-gold/40 transition-all">
                  <Icon size={24} className="text-brand-gold mx-auto" />
                  <span className="text-xs font-bold text-white block">{srv.title}</span>
                  <span className="text-[9px] text-white/40 font-mono block">{srv.sub}</span>
                </div>
              );
            })}
          </div>

          <Link
            href="/concierge"
            onClick={() => sound.playGoldChime()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-gold/30"
          >
            <span>Hablar con el Concierge Privado</span>
          </Link>
        </div>

      </div>

      {/* ── 360° LUXURY SUITE INTERACTIVE MODAL ── */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] glass-obsidian border border-brand-gold/50 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,168,67,0.3)] flex flex-col justify-between">
              
              {/* Header */}
              <div className="p-5 flex items-center justify-between border-b border-white/10 relative z-20">
                <div className="flex items-center gap-3">
                  <Compass className="text-brand-gold animate-spin" size={20} />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Experiencia 360° · Valeria VIP</h3>
                    <span className="text-[9px] text-brand-gold font-mono uppercase tracking-widest">Suite Presidencial Hotel Oro Verde · 4K UHD</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playSubtleClick();
                    setActiveMedia(null);
                  }}
                  className="p-2 rounded-full glass-dark text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 360 Viewer Canvas Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center group">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200"
                  alt="360 Player"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* 360 Compass Overlay */}
                <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 pointer-events-none" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/90 text-brand-black flex items-center justify-center shadow-2xl shadow-brand-gold/50 animate-pulse">
                    <Play size={28} fill="currentColor" className="ml-1" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold font-bold">Giroscopio y Arrastre 360° Activo</p>
                    <p className="text-[11px] text-white/60">Gira tu dispositivo para explorar la suite en tiempo real.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="p-4 bg-[#08080B] border-t border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[10px] text-white/50 font-mono">
                  <ShieldCheck size={14} className="text-brand-gold" />
                  <span>Transmisión Segura Encriptada</span>
                </div>
                <Link
                  href="/concierge"
                  onClick={() => {
                    sound.playGoldChime();
                    setActiveMedia(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-white text-brand-black font-black text-[10px] uppercase tracking-wider transition-all"
                >
                  Reservar Cita con Valeria
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VIPCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName="Pase de Socio · Bóveda 4K"
        planPrice="$80 USD"
      />
    </div>
  );
}
