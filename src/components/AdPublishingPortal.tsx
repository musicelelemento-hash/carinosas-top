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
  Send, 
  Mail, 
  Phone, 
  Lock, 
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import TurnstileWidget from "@/components/TurnstileWidget";
import { sound } from "@/lib/soundEngine";

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
    badge: "MÁXIMA EXPOSICIÓN #1",
    isPopular: true,
    features: [
      "Posición #1 Fija en tu Ciudad (Machala / GYE / UIO)",
      "Sello Oficial '100% Verificada 4K'",
      "Hasta 12 Fotos 4K Ultra HD + 2 Vídeos 360°",
      "Botón Directo a tu WhatsApp con Resplandor Oro",
      "Canal Telegram VIP (@usuario) & Correo Directo",
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
    badge: "TOP #3 EN TU CIUDAD",
    features: [
      "Posición Top #3 en el Catálogo de tu Ciudad",
      "Badge 'Verificada'",
      "Hasta 6 Fotos HD + 1 Vídeo Corto",
      "Botón WhatsApp Directo + Telegram",
      "Presencia en el Geo-Radar Inmediato"
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
  },
  {
    id: "gratis",
    name: "ANUNCIO GRATIS",
    price: "$0",
    period: "/7 días",
    badge: "PRUEBA SIN COSTO",
    features: [
      "Publicación Inmediata en Directorio",
      "Hasta 2 Fotos de Perfil",
      "Contacto Directo por WhatsApp",
      "Prueba de 7 días sin tarjeta"
    ],
    gradient: "from-white/10 via-white/5 to-transparent"
  }
];

export default function AdPublishingPortal() {
  const [selectedPlan, setSelectedPlan] = useState<string>("diamante");
  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card" | "bank" | "crypto">("paypal");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Phone OTP Verification State
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "22",
    city: "Machala",
    sector: "Puerto Bolívar / Centro VIP",
    rate: "120",
    whatsapp: "",
    telegram: "",
    email: "",
    description: "",
    tags: ["Trato VIP", "Masaje Relax", "Hotel 5★"]
  });

  const isPaid = selectedPlan !== "gratis";
  const currentPlan = PLANS.find(p => p.id === selectedPlan) || PLANS[0];

  // Steps definitions
  const stepsList = isPaid ? [
    { num: 1, label: "1. Elegir Plan" },
    { num: 2, label: "2. Pago Seguro" },
    { num: 3, label: "3. Contacto & Datos" },
    { num: 4, label: "4. Activación" },
  ] : [
    { num: 1, label: "1. Elegir Plan" },
    { num: 2, label: "2. Contacto & Datos" },
    { num: 3, label: "3. Activación" },
  ];

  const handleSendPhoneOtp = () => {
    if (!formData.whatsapp || formData.whatsapp.length < 8) {
      alert("Por favor ingresa un número de WhatsApp válido.");
      return;
    }
    sound.playSubtleClick();
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setOtpCode("7492"); // Pre-filled demo PIN for smooth friction-free UX
    }, 1200);
  };

  const handleVerifyOtp = () => {
    sound.playGoldChime();
    setIsPhoneVerified(true);
  };

  const handleConfirmPayment = () => {
    sound.playGoldChime();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentConfirmed(true);
      setStep(3);
      window.scrollTo({ top: 200, behavior: "smooth" });
    }, 1500);
  };

  const handleCompleteSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playGoldChime();
    setIsSuccess(true);
    if (typeof window !== "undefined") {
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#D4A843", "#FFE088", "#FF0062"]
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white pt-24 pb-28 md:pb-20 noise-overlay">
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

          <p className="text-xs sm:text-sm text-[#A1A1AA] uppercase tracking-[0.2em] font-medium max-w-xl mx-auto">
            Multiplica tus contactos de alto nivel en Machala, Guayaquil, Quito y todo Ecuador.
          </p>
        </div>

        {/* ── STEP PROGRESS BAR ── */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
          {stepsList.map((s) => (
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

        {/* ══════════════════════════════════════════════════════════════
            PASO 1: SELECCIONAR PLAN
           ══════════════════════════════════════════════════════════════ */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  sound.playSubtleClick();
                  setStep(2);
                  window.scrollTo({ top: 200, behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(212,168,67,0.4)] flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <span>{isPaid ? "Continuar al Pago Seguro" : "Continuar a Registro de Datos"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PASO 2 (SI ES PAGO): PASARELA DE PAGO ANTICIPADA PROFESIONAL
           ══════════════════════════════════════════════════════════════ */}
        {step === 2 && isPaid && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                Pasarela de Pago Blindada & Facturación Discreta
              </h2>
              <p className="text-xs text-white/50">Tu anonimato bancario está 100% protegido con encriptación SSL de 256 bits</p>
            </div>

            {/* Plan Summary Card */}
            <div className="glass-obsidian border border-brand-gold/40 rounded-3xl p-5 flex items-center justify-between shadow-[0_0_25px_rgba(212,168,67,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                  <Crown size={22} />
                </div>
                <div>
                  <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest block">Plan Seleccionado</span>
                  <span className="font-serif text-lg font-bold text-white">{currentPlan.name}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-serif text-3xl font-bold text-gold-shimmer">{currentPlan.price}</span>
                <span className="text-xs text-white/40 block font-mono">Facturación 100% Discreta</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "paypal", label: "PayPal Express", icon: Zap, sub: "Cobro Inmediato" },
                { id: "card", label: "Tarjeta de Crédito", icon: CreditCard, sub: "Visa / Mastercard" },
                { id: "bank", label: "Transferencia EC", icon: Building2, sub: "Pichincha / Guayaquil" },
                { id: "crypto", label: "Cripto USDT", icon: QrCode, sub: "100% Anónimo TRC-20" },
              ].map((tab) => {
                const isActive = paymentMethod === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { sound.playSubtleClick(); setPaymentMethod(tab.id as any); }}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-gold/15 border-brand-gold text-brand-gold shadow-[0_0_20px_rgba(212,168,67,0.25)]'
                        : 'glass-dark border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-brand-gold' : 'text-white/40'} />
                    <span className="text-xs font-black uppercase tracking-wider block mt-2">{tab.label}</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">{tab.sub}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: PAYPAL EXPRESS */}
            {paymentMethod === "paypal" && (
              <div className="glass-obsidian border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#003087]/20 border border-[#003087]/50 flex items-center justify-center text-[#0079C1] mx-auto shadow-lg">
                  <Zap size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white">Pago Seguro Internacional con PayPal</h3>
                  <p className="text-xs text-white/50 max-w-sm mx-auto">
                    Paga con tu saldo PayPal o tarjeta vinculada con protección al comprador.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full max-w-md mx-auto py-4 rounded-2xl bg-[#0070BA] hover:bg-[#003087] text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessingPayment ? <RefreshCw className="animate-spin" size={16} /> : <span>Pagar {currentPlan.price} con PayPal</span>}
                </button>
              </div>
            )}

            {/* TAB CONTENT: CREDIT/DEBIT CARD */}
            {paymentMethod === "card" && (
              <div className="glass-obsidian border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Lock size={14} className="text-emerald-400" />
                    <span>Pasarela Encriptada SSL 256-Bits</span>
                  </div>
                  <span className="text-[9px] text-white/40 font-mono">Descriptor: TOPMEDIA-EC</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-white/50 uppercase tracking-wider font-bold block mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8890"
                      className="w-full px-4 py-3.5 rounded-2xl glass-dark border border-white/15 focus:border-brand-gold outline-none text-white font-mono text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-wider font-bold block mb-1">Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        className="w-full px-4 py-3.5 rounded-2xl glass-dark border border-white/15 focus:border-brand-gold outline-none text-white font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-wider font-bold block mb-1">CVV / CVC</label>
                      <input
                        type="text"
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-4 py-3.5 rounded-2xl glass-dark border border-white/15 focus:border-brand-gold outline-none text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110"
                >
                  {isProcessingPayment ? <RefreshCw className="animate-spin" size={16} /> : <span>Confirmar Pago de {currentPlan.price} USD</span>}
                </button>
              </div>
            )}

            {/* TAB CONTENT: BANCO PICHINCHA / GUAYAQUIL */}
            {paymentMethod === "bank" && (
              <div className="glass-obsidian border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="p-4 rounded-2xl bg-white/5 border border-brand-gold/30 space-y-2">
                  <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest block">Banco Pichincha (Ecuador)</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Cuenta Corriente:</span>
                    <strong className="text-white font-mono">2100849201</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Titular / RUC:</span>
                    <strong className="text-white font-mono">PRODUCCIONES DIGITALES S.A.S</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="w-full py-4 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110"
                >
                  <span>Ya Realicé la Transferencia · Continuar</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* TAB CONTENT: CRIPTO USDT */}
            {paymentMethod === "crypto" && (
              <div className="glass-obsidian border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <QrCode size={30} />
                </div>
                <span className="text-[10px] text-white/50 uppercase font-mono block">Billetera USDT TRC-20 (Tron Network):</span>
                <code className="text-xs text-brand-gold bg-black/50 px-4 py-2 rounded-xl block break-all font-mono border border-brand-gold/30">
                  TJ9Xv84K2LM90alphaTopMediaVIP99Qz
                </code>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="w-full py-4 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110"
                >
                  <span>Confirmar Depósito Cripto · Continuar</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-2xl glass-dark border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:text-white cursor-pointer"
              >
                ← Cambiar de Plan
              </button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PASO 2 (GRATIS) / PASO 3 (PAGO): CONTACTO & DATOS CON OTP TEMPRANO
           ══════════════════════════════════════════════════════════════ */}
        {((step === 2 && !isPaid) || (step === 3 && isPaid)) && (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCompleteSubmission}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                Contacto Verificado & Datos de tu Perfil 4K
              </h2>
              <p className="text-xs text-white/50">Tus canales de contacto se enlazarán directamente con clientes VIP</p>
            </div>

            <div className="glass-obsidian border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* ── EARLY WHATSAPP VERIFICATION BOX WITH PIN OTP ── */}
              <div className="p-5 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={18} className="text-brand-gold" />
                    <label className="text-xs font-black uppercase tracking-wider text-white">
                      WhatsApp Oficial de Reservas *
                    </label>
                  </div>
                  {isPhoneVerified ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verificado 100%
                    </span>
                  ) : (
                    <span className="text-[8px] text-white/50 uppercase font-mono">Paso de Seguridad Obligatorio</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="px-3.5 py-3 rounded-2xl bg-white/5 border border-white/10 text-brand-gold font-mono text-sm font-bold">
                      +593
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="987654321"
                      value={formData.whatsapp}
                      onChange={e => {
                        setFormData({ ...formData, whatsapp: e.target.value });
                        setIsPhoneVerified(false);
                        setOtpSent(false);
                      }}
                      className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm font-mono placeholder:text-white/30"
                    />
                  </div>

                  {!isPhoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={isSendingOtp || !formData.whatsapp}
                      className="px-5 py-3 rounded-2xl bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-black text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingOtp ? "Enviando..." : otpSent ? "Reenviar PIN" : "Verificar WhatsApp"}
                    </button>
                  )}
                </div>

                {otpSent && !isPhoneVerified && (
                  <div className="pt-2 flex items-center gap-3 animate-in fade-in">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="PIN: 7492"
                      className="w-28 px-3 py-2 text-center rounded-xl bg-black/60 border border-brand-gold text-brand-gold font-mono text-sm tracking-widest font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 rounded-xl bg-brand-gold text-brand-black text-[10px] font-black uppercase tracking-wider hover:scale-105 transition-all cursor-pointer"
                    >
                      Confirmar PIN
                    </button>
                    <span className="text-[9px] text-white/50">Código demo: <strong>7492</strong></span>
                  </div>
                )}
              </div>

              {/* ── ALTERNATIVE CHANNELS: TELEGRAM & EMAIL ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Send size={12} className="text-[#229ED9]" />
                    <span>Telegram VIP (@usuario) (Opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="@tu_usuario_vip"
                    value={formData.telegram}
                    onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-[#229ED9] outline-none text-white text-sm placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Mail size={12} className="text-brand-gold" />
                    <span>Correo de Reservas VIP (Opcional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="reservas@tudominio.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* ── PROFILE DETAILS: NAME, AGE, RATE ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Nombre Artístico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Valentina VIP"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Edad *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="22"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm"
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
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* ── CITY BASE & SECTOR ── */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90 block">
                  Ciudad Base de Publicación *
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "Machala", label: "📍 Machala VIP" },
                    { id: "Guayaquil", label: "📍 Guayaquil / Samborondón" },
                    { id: "Quito", label: "📍 Quito (La Carolina)" },
                    { id: "Cuenca", label: "📍 Cuenca" },
                    { id: "Manta", label: "📍 Manta" },
                    { id: "Santo Domingo", label: "📍 Santo Domingo" },
                    { id: "Ambato", label: "📍 Ambato" },
                    { id: "Salinas", label: "📍 Salinas" },
                  ].map((cityOption) => (
                    <button
                      key={cityOption.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, city: cityOption.id, sector: `${cityOption.id} Centro / Hotel 5★` })}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        formData.city === cityOption.id
                          ? 'bg-brand-gold text-brand-black shadow-md scale-105'
                          : 'glass-dark border border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      {cityOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── PHOTOS UPLOAD BOX ── */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-gold/90">
                    Fotos 4K & Vídeos
                  </label>
                  <span className="text-[8px] text-brand-gold font-bold">✨ Auditoría Biométrica 4K</span>
                </div>

                <div className="border-2 border-dashed border-white/15 hover:border-brand-gold/50 rounded-3xl p-8 text-center bg-white/[0.02] cursor-pointer transition-all space-y-2">
                  <div className="w-12 h-12 rounded-2xl glass-dark border border-brand-gold/40 text-brand-gold mx-auto flex items-center justify-center">
                    <UploadCloud size={24} />
                  </div>
                  <span className="text-xs font-bold text-white block">Haz clic o arrastra fotos en alta resolución</span>
                  <span className="text-[9px] text-white/40 block">Máximo 12 fotos 4K y 2 vídeos</span>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(isPaid ? 2 : 1)}
                className="px-6 py-3.5 rounded-2xl glass-dark border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:text-white cursor-pointer"
              >
                ← Volver
              </button>

              <button
                type="submit"
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black font-black text-xs uppercase tracking-widest shadow-[0_0_35px_rgba(212,168,67,0.5)] flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Zap size={16} className="fill-brand-black" />
                <span>Activar Mi Anuncio VIP Ahora</span>
              </button>
            </div>
          </motion.form>
        )}

        {/* ══════════════════════════════════════════════════════════════
            ESTADO DE ÉXITO & CONFIRMACIÓN FINAL
           ══════════════════════════════════════════════════════════════ */}
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
                ¡Anuncio Publicado & Verificado!
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Bienvenida al Círculo <span className="italic text-gold-shimmer">{currentPlan.name}</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
                Tu perfil ha sido registrado con WhatsApp verificado. Tus canales de contacto ya están listos para recibir solicitudes de clientes VIP en {formData.city} y todo Ecuador.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-3.5 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
              >
                Ir al Catálogo Principal
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
