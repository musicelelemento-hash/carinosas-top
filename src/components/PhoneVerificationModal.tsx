"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  ShieldCheck, 
  MessageCircle, 
  Smartphone, 
  Mail, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ExternalLink,
  Lock
} from "lucide-react";
import { 
  sendPhoneOtpAction, 
  verifyPhoneOtpAction, 
  getWhatsAppHandshakeUrl 
} from "@/app/actions/authPhone";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  phoneNumber: string;
  userName?: string;
  onClose: () => void;
  onSuccess: (verifiedPhone: string) => void;
}

type Channel = "whatsapp_handshake" | "whatsapp_otp" | "sms_otp";

export default function PhoneVerificationModal({
  isOpen,
  phoneNumber,
  userName,
  onClose,
  onSuccess
}: PhoneVerificationModalProps) {
  const [channel, setChannel] = useState<Channel>("whatsapp_handshake");
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [handshakeUrl, setHandshakeUrl] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Auto generate handshake URL
      getWhatsAppHandshakeUrl(phoneNumber, userName).then(setHandshakeUrl);
      startCooldown();
    }
  }, [isOpen, phoneNumber, userName]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0 && !canResend) {
      timer = setTimeout(() => setCooldown(prev => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [cooldown, canResend]);

  if (!isOpen) return null;

  const startCooldown = () => {
    setCooldown(60);
    setCanResend(false);
  };

  const handleChannelSwitch = async (newChannel: Channel) => {
    setChannel(newChannel);
    setStatusMsg(null);
    setPin(["", "", "", "", "", ""]);

    if (newChannel === "whatsapp_handshake") {
      const url = await getWhatsAppHandshakeUrl(phoneNumber, userName);
      setHandshakeUrl(url);
    } else {
      setIsLoading(true);
      const res = await sendPhoneOtpAction(phoneNumber, newChannel);
      setIsLoading(false);
      if (res.success) {
        setStatusMsg({ text: res.message, isError: false });
        startCooldown();
        // Focus first box
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setStatusMsg({ text: res.message, isError: true });
      }
    }
  };

  const handlePinChange = (index: number, value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    if (!numeric && value !== "") return;

    const newPin = [...pin];

    // Support pasted multi-digit string (e.g. 6 digits pasted into box 0)
    if (numeric.length > 1) {
      const chars = numeric.slice(0, 6).split("");
      chars.forEach((c, idx) => {
        if (idx < 6) newPin[idx] = c;
      });
      setPin(newPin);
      const targetIndex = Math.min(5, chars.length);
      inputRefs.current[targetIndex]?.focus();
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
      if (res.success) {
        setStatusMsg({ text: res.message, isError: false });
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          try { navigator.vibrate([30, 80, 30]); } catch {}
        }
        setTimeout(() => {
          onSuccess(phoneNumber);
          onClose();
        }, 1000);
      } else {
        setStatusMsg({ text: res.message, isError: true });
      }
    } catch {
      setStatusMsg({ text: "Error al validar código.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    const res = await sendPhoneOtpAction(phoneNumber, channel);
    setIsLoading(false);
    if (res.success) {
      setStatusMsg({ text: "Nuevo código enviado.", isError: false });
      startCooldown();
    } else {
      setStatusMsg({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Window */}
      <div className="relative w-full max-w-lg glass-obsidian border border-brand-gold/40 rounded-[2.5rem] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.9)] space-y-6 z-10 animate-in zoom-in-95 duration-300">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-white italic font-bold">Autenticación 4K Anti-Fakes</h3>
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

        {/* ── 3 CHANNEL SELECTION TABS ── */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl glass-dark border border-white/10">
          
          <button
            type="button"
            onClick={() => handleChannelSwitch("whatsapp_handshake")}
            className={`py-2.5 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
              channel === "whatsapp_handshake"
                ? "bg-brand-gold text-brand-black shadow-md font-extrabold"
                : "text-white/50 hover:text-white"
            }`}
          >
            <MessageCircle size={14} />
            <span>1-Toque WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => handleChannelSwitch("whatsapp_otp")}
            className={`py-2.5 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
              channel === "whatsapp_otp"
                ? "bg-brand-gold text-brand-black shadow-md font-extrabold"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Sparkles size={14} />
            <span>OTP WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => handleChannelSwitch("sms_otp")}
            className={`py-2.5 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
              channel === "sms_otp"
                ? "bg-brand-gold text-brand-black shadow-md font-extrabold"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Smartphone size={14} />
            <span>SMS Clásico</span>
          </button>

        </div>

        {/* ── TAB CONTENT ── */}
        {channel === "whatsapp_handshake" ? (
          /* OPTION 1: 1-TAP HANDSHAKE ($0 COST) */
          <div className="space-y-5 text-center py-2">
            <div className="p-4 rounded-2xl glass-dark border border-brand-gold/30 text-xs text-white/80 space-y-2">
              <p className="leading-relaxed">
                Toca el botón dorado a continuación para enviar un mensaje pre-llenado a nuestro <strong>WhatsApp Concierge Oficial</strong>.
              </p>
              <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest block">
                ✓ Verificación instantánea sin costo de SMS
              </span>
            </div>

            <a
              href={handshakeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Auto verify after opening WhatsApp handshake
                setTimeout(() => {
                  onSuccess(phoneNumber);
                  onClose();
                }, 3000);
              }}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.18em] shadow-[0_10px_35px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2.5"
            >
              <MessageCircle size={18} fill="currentColor" />
              <span>Verificar en 1 Clic por WhatsApp</span>
              <ExternalLink size={14} />
            </a>

            <p className="text-[9px] text-white/40 italic">
              Al abrirse WhatsApp, solo dale clic a &quot;Enviar&quot; y tu perfil quedará autenticado.
            </p>
          </div>
        ) : (
          /* OPTION 2 & 3: 6-DIGIT PIN PAD FOR OTP */
          <div className="space-y-6 py-2">
            
            <div className="text-center space-y-1">
              <p className="text-xs text-white/70">
                Ingresa el código de 6 dígitos que enviamos por {channel === "whatsapp_otp" ? "WhatsApp" : "SMS"}:
              </p>
            </div>

            {/* 6 PIN BOXES */}
            <div className="flex justify-center items-center gap-2.5 sm:gap-3">
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
                onClick={handleResend}
                disabled={!canResend || isLoading}
                className={`font-bold uppercase tracking-wider flex items-center gap-1 ${
                  canResend ? "text-brand-gold hover:underline cursor-pointer" : "text-white/25 cursor-not-allowed"
                }`}
              >
                <RotateCcw size={11} />
                {canResend ? "Reenviar Código" : `Reenviar en 00:${cooldown < 10 ? `0${cooldown}` : cooldown}`}
              </button>
            </div>

            {/* Status Feedback Message */}
            {statusMsg && (
              <div className={`p-3 rounded-xl text-center text-xs font-bold ${
                statusMsg.isError ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              }`}>
                {statusMsg.text}
              </div>
            )}

            {/* Confirm PIN Button */}
            <button
              type="button"
              onClick={handleVerifyPin}
              disabled={isLoading || pin.join("").length !== 6}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 ${
                pin.join("").length === 6
                  ? "bg-brand-gold hover:bg-white text-brand-black shadow-[0_10px_35px_rgba(212,168,67,0.4)]"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Validar Código y Activar</span>
                </>
              )}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
