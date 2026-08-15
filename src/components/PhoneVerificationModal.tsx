"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  ShieldCheck, 
  MessageCircle, 
  Smartphone, 
  Lock, 
  RotateCcw, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  Send,
  Clock
} from "lucide-react";
import { sendPhoneOtpAction, verifyPhoneOtpAction } from "@/app/actions/authPhone";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  phoneNumber: string;
  userName?: string;
  onClose: () => void;
  onSuccess: (verifiedPhone: string) => void;
}

type Channel = "whatsapp_otp" | "sms_otp";

export default function PhoneVerificationModal({
  isOpen,
  phoneNumber,
  userName,
  onClose,
  onSuccess
}: PhoneVerificationModalProps) {
  const [channel, setChannel] = useState<Channel>("whatsapp_otp");
  const [hasSentCode, setHasSentCode] = useState(false);
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasSentCode && cooldown > 0 && !canResend) {
      timer = setTimeout(() => setCooldown(prev => prev - 1), 1000);
    } else if (hasSentCode && cooldown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [cooldown, canResend, hasSentCode]);

  if (!isOpen) return null;

  const startCooldown = () => {
    setCooldown(60);
    setCanResend(false);
  };

  const handleSendCode = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await sendPhoneOtpAction(phoneNumber, channel);
      setIsLoading(false);

      if (res.isLocked) {
        setIsLocked(true);
        setStatusMsg({ text: res.message, isError: true });
        return;
      }

      if (res.success) {
        setHasSentCode(true);
        setStatusMsg({ text: res.message, isError: false });
        startCooldown();
        setTimeout(() => inputRefs.current[0]?.focus(), 150);
      } else {
        setStatusMsg({ text: res.message, isError: true });
      }
    } catch {
      setIsLoading(false);
      setStatusMsg({ text: "Error de conexión al enviar el código.", isError: true });
    }
  };

  const handlePinChange = (index: number, value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    if (!numeric && value !== "") return;

    const newPin = [...pin];

    // Support pasted multi-digit string (e.g. 6 digits pasted into box 0)
    if (numeric.length > 1) {
      const chars = numeric.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newPin[i] = chars[i] || "";
      }
      setPin(newPin);
      const targetIndex = Math.min(5, chars.length - 1);
      setTimeout(() => inputRefs.current[targetIndex]?.focus(), 50);
      return;
    }

    newPin[index] = numeric;
    setPin(newPin);

    // Haptic feedback
    if (typeof window !== "undefined" && "vibrate" in navigator && numeric) {
      try { navigator.vibrate(10); } catch {}
    }

    // Auto-advance to next input
    if (numeric && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyPin = async () => {
    const fullPin = pin.join("");
    if (fullPin.length !== 6) {
      setStatusMsg({ text: "Ingresa los 6 dígitos del código.", isError: true });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await verifyPhoneOtpAction(phoneNumber, fullPin);
      setIsLoading(false);

      if (res.isLocked) {
        setIsLocked(true);
        setStatusMsg({ text: res.message, isError: true });
        return;
      }

      if (res.success) {
        setStatusMsg({ text: res.message, isError: false });
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          try { navigator.vibrate([30, 80, 30]); } catch {}
        }
        setTimeout(() => {
          onSuccess(phoneNumber);
          onClose();
        }, 800);
      } else {
        setStatusMsg({ text: res.message, isError: true });
      }
    } catch {
      setIsLoading(false);
      setStatusMsg({ text: "Error al validar el código.", isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Window */}
      <div className="relative w-full max-w-lg glass-obsidian border border-brand-gold/40 rounded-[2.5rem] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.95)] space-y-6 z-10 animate-in zoom-in-95 duration-300">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-white italic font-bold">Verificación Telefónica</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">{phoneNumber}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── LOCKOUT WARNING IF ACTIVE ── */}
        {isLocked ? (
          <div className="p-6 rounded-3xl bg-red-600/15 border border-red-500/50 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mx-auto text-red-400">
              <Lock size={24} />
            </div>
            <h4 className="text-base font-serif text-white font-bold">Acceso Bloqueado Temporalmente</h4>
            <p className="text-xs text-red-300 leading-relaxed">
              Por medidas anti-fraude y seguridad de tokens, tu número ha sido bloqueado por <strong>15 minutos</strong> debido a múltiples intentos erróneos.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-wider transition-all"
            >
              Entendido / Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* ── STEP A: CHANNEL SELECTOR (WHATSAPP vs SMS) ── */}
            {!hasSentCode ? (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs text-white/70 block">
                    Elige por dónde prefieres recibir tu código de seguridad de 6 dígitos:
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Channel 1: WhatsApp */}
                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp_otp")}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                      channel === "whatsapp_otp"
                        ? "border-emerald-400 bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        : "border-white/10 glass-dark text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <MessageCircle size={20} className={channel === "whatsapp_otp" ? "text-emerald-400" : "text-white/40"} />
                      <span className="text-[8px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">Recomendado</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">WhatsApp OTP</span>
                      <span className="text-[9px] text-white/50 block mt-0.5">Envío instantáneo a tu chat</span>
                    </div>
                  </button>

                  {/* Channel 2: SMS */}
                  <button
                    type="button"
                    onClick={() => setChannel("sms_otp")}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                      channel === "sms_otp"
                        ? "border-brand-gold bg-brand-gold/15 shadow-[0_0_20px_rgba(212,168,67,0.3)]"
                        : "border-white/10 glass-dark text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Smartphone size={20} className={channel === "sms_otp" ? "text-brand-gold" : "text-white/40"} />
                      <span className="text-[8px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-bold uppercase">Clásico</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Mensaje SMS</span>
                      <span className="text-[9px] text-white/50 block mt-0.5">Mensaje de texto a tu móvil</span>
                    </div>
                  </button>
                </div>

                {/* Explicit Send Button */}
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Enviar Código por {channel === "whatsapp_otp" ? "WhatsApp" : "SMS"}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* ── STEP B: 6-PIN BOXES PAD ── */
              <div className="space-y-6">
                
                <div className="text-center space-y-1">
                  <p className="text-xs text-white/70">
                    Ingresa el código de 6 dígitos enviado por <strong>{channel === "whatsapp_otp" ? "WhatsApp" : "SMS"}</strong> a {phoneNumber}:
                  </p>
                </div>

                {/* 6 PIN BOXES */}
                <div className="flex justify-center items-center gap-2 sm:gap-3">
                  {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold text-brand-gold glass-dark border-2 border-brand-gold/30 rounded-2xl focus:border-brand-gold focus:scale-105 outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>

                {/* Cooldown & Resend */}
                <div className="flex justify-between items-center text-[10px] text-white/50 px-2">
                  <span>¿No recibiste el código?</span>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={!canResend || isLoading}
                    className={`font-bold uppercase tracking-wider flex items-center gap-1 ${
                      canResend ? "text-brand-gold hover:underline cursor-pointer" : "text-white/25 cursor-not-allowed"
                    }`}
                  >
                    <RotateCcw size={11} />
                    {canResend ? "Reenviar Código" : `Reenviar en 00:${cooldown < 10 ? `0${cooldown}` : cooldown}`}
                  </button>
                </div>

                {/* Confirm PIN Button */}
                <button
                  type="button"
                  onClick={handleVerifyPin}
                  disabled={isLoading || pin.join("").length !== 6}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 ${
                    pin.join("").length === 6
                      ? "bg-brand-gold hover:bg-white text-brand-black shadow-[0_10px_35px_rgba(212,168,67,0.4)] cursor-pointer"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirmar y Validar Número</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Status Message */}
            {statusMsg && (
              <div className={`p-3 rounded-xl text-center text-xs font-bold ${
                statusMsg.isError ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              }`}>
                {statusMsg.text}
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}
