"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  UploadCloud, 
  Check, 
  QrCode, 
  CreditCard, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  Flame,
  MessageCircle,
  Gem,
  Lock,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface PlanTier {
  id: string;
  name: string;
  price: string;
  period: string;
  badge: string;
  isPopular?: boolean;
  features: string[];
  gradient: string;
}

const PLANS: PlanTier[] = [
  {
    id: "diamante",
    name: "DIAMANTE VIP",
    price: "$180",
    period: "/mes",
    badge: "👑 MÁXIMA EXPOSICIÓN #1",
    isPopular: true,
    features: [
      "Posición #1 Fija en tu Ciudad (Machala / GYE / UIO)",
      "Sello Oficial '100% Verificada 4K'",
      "Hasta 12 Fotos 4K Ultra HD + 2 Vídeos 360°",
      "Botón Directo a tu WhatsApp con Resplandor Oro",
      "Inclusión Destacada en Reels TikTok & Stories",
      "Acceso a la Bóveda Secreta Privada",
      "Notificaciones Push masivas a clientes VIP"
    ],
    gradient: "from-brand-gold via-[#FFE088] to-[#AA7C11]"
  },
  {
    id: "oro",
    name: "ORO ELITE",
    price: "$99",
    period: "/mes",
    badge: "⭐ TOP #3 EN TU CIUDAD",
    features: [
      "Posición Top #3 en el Catálogo de tu Ciudad",
      "Badge 'Verificada'",
      "Hasta 6 Fotos HD + 1 Vídeo Corto",
      "Botón WhatsApp Directo",
      "Presencia en el Geo-Radar Satelital"
    ],
    gradient: "from-white/20 via-white/10 to-transparent"
  },
  {
    id: "plata",
    name: "PLATA BÁSICO",
    price: "$49",
    period: "/mes",
    badge: "DIRECTORIO GENERAL",
    features: [
      "Listado en Directorio General",
      "Hasta 3 Fotos",
      "Contacto por WhatsApp",
      "Renovación mensual"
    ],
    gradient: "from-white/10 to-transparent"
  }
];

export default function AdPublishingPortal() {
  const [selectedPlan, setSelectedPlan] = useState<string>("diamante");
  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "card" | "bank">("crypto");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "22",
    city: "Machala",
    sector: "Puerto Bolívar / Centro VIP",
    rate: "120",
    whatsapp: "",
    description: "",
    tags: ["Trato VIP", "Masaje Relax", "Hotel 5★"]
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 200, behavior: "smooth" });
    } else {
      // Complete Checkout
      setIsSuccess(true);
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4A843", "#FFE088", "#FF0062"]
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white pt-24 pb-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── HEADER BREADCRUMB & TITLE ── */}
        <div className="mb-10 text-center space-y-3">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-brand-gold/70 hover:text-brand-gold transition-colors mb-2"
          >
            <ArrowLeft size={12} />
            <span>Volver al Inicio</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-obsidian border border-brand-gold/40 text-brand-gold text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_0_25px_rgba(212,168,67,0.2)]">
            <Crown size={12} className="animate-pulse" />
            <span>Portal Oficial de Anunciantes VIP</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Publica tu Anuncio <span className="italic text-gold-shimmer">Élite</span>
          </h1>

          <p className="text-xs sm:text-sm text-white/60 uppercase tracking-[0.2em] font-medium max-w-xl mx-auto">
            Multiplica tus contactos de alto nivel en Machala, Guayaquil, Quito y todo Ecuador.
          </p>
        </div>

        {/* ── STEP PROGRESS BAR ── */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
          {[
            { num: 1, label: "1. Elegir Plan" },
            { num: 2, label: "2. Datos & Fotos" },
            { num: 3, label: "3. Pago Anónimo" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5 bg-[#08080C] px-3">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= s.num 
                    ? 'bg-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.5)] scale-110' 
                    : 'glass-obsidian border border-white/10 text-white/40'
                }`}
              >
                {step > s.num ? <Check size={14} strokeWidth={3} /> : s.num}
              </div>
              <span className={`text-[9px] uppercase font-bold tracking-wider ${
                step >= s.num ? 'text-brand-gold' : 'text-white/30'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── STEP 1: CHOOSE VIP PLAN ── */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                Selecciona tu Nivel de Visibilidad
              </h2>
              <p className="text-xs text-white/50">Elige el plan que mejor se adapte a tu objetivo de ingresos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'glass-obsidian border-2 border-brand-gold shadow-[0_0_40px_rgba(212,168,67,0.35)] scale-[1.02]'
                        : 'glass-obsidian border border-white/10 hover:border-brand-gold/40 hover:bg-white/5'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-pink to-brand-gold text-[8px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-1">
                        <Flame size={10} className="fill-white" />
                        <span>Recomendado #1</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-brand-gold block">
                          {plan.badge}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-white mt-1">
                          {plan.name}
                        </h3>
                      </div>

                      <div className="flex items-baseline gap-1 py-2 border-y border-white/5">
                        <span className="font-serif text-4xl font-bold text-gold-shimmer">{plan.price}</span>
                        <span className="text-xs text-white/40 font-mono">{plan.period}</span>
                      </div>

                      <ul className="space-y-2.5 pt-2">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-white/80 leading-relaxed">
                            <ShieldCheck size={14} className="text-brand-gold shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className={`w-full mt-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/30'
                          : 'glass-dark border border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Plan Seleccionado' : 'Elegir Este Plan'}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setStep(2);
                  window.scrollTo({ top: 200, behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(212,168,67,0.4)] flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>Continuar al Paso 2</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: PROFILE DETAILS & MEDIA ── */}
        {step === 2 && (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleNextStep}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                Datos de tu Perfil & Fotos 4K
              </h2>
              <p className="text-xs text-white/50">Tu información se mantendrá bajo estricta confidencialidad</p>
            </div>

            <div className="glass-obsidian border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Nombre Artístico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Valeria VIP"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Edad *
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="50"
                    required
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Ciudad (Ecuador) *
                  </label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#141419] border border-white/10 focus:border-brand-gold outline-none text-white text-sm"
                  >
                    <option value="Machala">Machala (El Oro)</option>
                    <option value="Guayaquil">Guayaquil (Guayas)</option>
                    <option value="Quito">Quito (Pichincha)</option>
                    <option value="Cuenca">Cuenca (Azuay)</option>
                    <option value="Santo Domingo">Santo Domingo</option>
                    <option value="Ambato">Ambato (Tungurahua)</option>
                    <option value="Manta">Manta (Manabí)</option>
                    <option value="Salinas">Salinas (Santa Elena)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Sector o Zona *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Puerto Bolívar / Centro"
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Tarifa por Hora ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="120"
                    value={formData.rate}
                    onChange={e => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90 flex items-center justify-between">
                  <span>Número de WhatsApp para Clientes (Directo) *</span>
                  <span className="text-emerald-400 font-mono text-[9px]">🔒 Encriptado</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-mono text-sm">
                    +593
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="987654321"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm font-mono placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Media Upload Area with AI Verification Badge */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Fotos 4K & Vídeos (Arrastra o Selecciona)
                  </label>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-dark border border-brand-gold/30 text-[8px] font-bold text-brand-gold">
                    <Sparkles size={10} />
                    <span>Verificación Facial IA Anti-Fake</span>
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/15 hover:border-brand-gold/50 rounded-3xl p-8 text-center bg-white/[0.02] cursor-pointer transition-all space-y-3">
                  <div className="w-14 h-14 rounded-2xl glass-dark border border-brand-gold/40 text-brand-gold mx-auto flex items-center justify-center shadow-lg shadow-brand-gold/10">
                    <UploadCloud size={28} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Haz clic para subir tus fotos en alta resolución</span>
                    <span className="text-[10px] text-white/40 block mt-1">Formatos permitidos: JPG, PNG, MP4 (Máx 25MB)</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3.5 rounded-2xl glass-dark border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:text-white"
              >
                ← Volver al Plan
              </button>

              <button
                type="submit"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(212,168,67,0.4)] flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>Ir al Pago Anónimo</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.form>
        )}

        {/* ── STEP 3: 100% ANONYMOUS CHECKOUT ── */}
        {step === 3 && !isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                Pasarela de Activación 100% Anónima
              </h2>
              <p className="text-xs text-white/50">Tu anonimato y privacidad bancaria están totalmente blindados</p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "crypto", label: "Cripto USDT / BTC", icon: QrCode, sub: "100% Anónimo" },
                { id: "bank", label: "Transferencia EC", icon: Building2, sub: "Pichincha / Guayaquil" },
                { id: "card", label: "Tarjeta VIP", icon: CreditCard, sub: "Facturación Discreta" },
              ].map((tab) => {
                const isActive = paymentMethod === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentMethod(tab.id as any)}
                    className={`p-4 rounded-2xl text-center transition-all flex flex-col items-center gap-1.5 ${
                      isActive
                        ? 'bg-brand-gold text-brand-black shadow-[0_0_25px_rgba(212,168,67,0.4)]'
                        : 'glass-obsidian border border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-black uppercase tracking-wider">{tab.label}</span>
                    <span className={`text-[8px] font-mono ${isActive ? 'text-brand-black/70' : 'text-white/40'}`}>
                      {tab.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Payment Details Container */}
            <div className="glass-obsidian border border-brand-gold/30 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {paymentMethod === "crypto" && (
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto p-3 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
                    <div className="w-full h-full border-4 border-black flex flex-col items-center justify-center p-2 text-black">
                      <QrCode size={120} />
                      <span className="text-[8px] font-mono font-bold mt-1">USDT (TRC20 / BEP20)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-brand-gold">Dirección de Billetera USDT (TRC-20):</span>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white/80 select-all break-all">
                      TX9qZ8k2LpM5vRt7wXyN4bC1sFd8gH3jK
                    </div>
                    <span className="text-[9px] text-white/40 font-mono block mt-1">
                      Monto exacto a transferir: <strong className="text-brand-gold">$180.00 USDT</strong>
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="font-black text-brand-gold uppercase tracking-wider block">Banco Pichincha (Cuenta Corriente)</span>
                    <div className="grid grid-cols-2 gap-2 text-white/70 font-mono text-[11px]">
                      <div>Número: <strong>2100876543</strong></div>
                      <div>RUC / CI: <strong>1792345678001</strong></div>
                      <div className="col-span-2">Beneficiario: <strong>Digital Media Services EC</strong> (Concepto discreto)</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="font-black text-brand-gold uppercase tracking-wider block">Banco Guayaquil / Banco de Machala</span>
                    <div className="grid grid-cols-2 gap-2 text-white/70 font-mono text-[11px]">
                      <div>Número: <strong>11456789</strong></div>
                      <div>Tipo: <strong>Cuenta de Ahorros</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-brand-gold">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm text-center"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVV"
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm text-center"
                    />
                  </div>
                </div>
              )}

              {/* Guarantee */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 text-xs text-brand-gold">
                <ShieldCheck size={24} className="shrink-0" />
                <span>
                  <strong>Garantía de Activación en 5 Minutos:</strong> Una vez confirmado el pago, tu perfil se destacará en la posición #1 de tu ciudad de forma inmediata.
                </span>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3.5 rounded-2xl glass-dark border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:text-white"
              >
                ← Modificar Datos
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-[0_0_35px_rgba(212,168,67,0.5)] flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Zap size={16} className="fill-brand-black" />
                <span>Activar Mi Anuncio VIP Ahora</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS STATE ── */}
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-obsidian border-2 border-brand-gold/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-[0_0_60px_rgba(212,168,67,0.3)]"
          >
            <div className="w-20 h-20 rounded-full bg-brand-gold text-brand-black mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(212,168,67,0.6)]">
              <Check size={40} strokeWidth={3} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                ¡Solicitud Recibida con Éxito!
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Bienvenida al Círculo <span className="italic text-gold-shimmer">Diamante VIP</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
                Tu anuncio ha sido programado para validación de alta fidelidad 4K. Nuestro equipo de Concierge te contactará por WhatsApp para la confirmación final de activación.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-3.5 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
              >
                Ir a la Página Principal
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
