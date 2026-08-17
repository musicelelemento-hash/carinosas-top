"use client";

import React, { useState, useMemo } from "react";
import { 
  X, 
  Crown, 
  ShieldCheck, 
  Check, 
  Copy, 
  QrCode, 
  Building2, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { registerVIPPassAction } from "@/app/actions/vip";
import { soundFX } from "@/lib/soundFX";

interface VIPCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: number | string;
  onSuccess?: (passCode: string) => void;
}

export default function VIPCheckoutModal({
  isOpen,
  onClose,
  planName = "Pase VIP Diamante",
  planPrice = 49,
  onSuccess
}: VIPCheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "bank">("crypto");
  const [cryptoNetwork, setCryptoNetwork] = useState<"TRC20" | "BEP20">("TRC20");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [txHashOrRef, setTxHashOrRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passCreated, setPassCreated] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const WALLETS = {
    TRC20: "TYd8zN2s9Pqx7Lm3Vv1aK8eX4wY6R5t1Qp",
    BEP20: "0x71C2d8A3b6B9F8e4a9C1235687aBcDeF12345678"
  };

  const BANK_ACCOUNTS = [
    { id: "bank-0", bank: "Banco Pichincha (Ecuador)", type: "Cta Corriente", num: "2100894561", holder: "CARINOSAS MEDIA CORP", ruc: "1792849501001" },
    { id: "bank-1", bank: "Banco Guayaquil (Ecuador)", type: "Cta Ahorros", num: "0012489563", holder: "CARINOSAS VIP GROUP", ruc: "1792849501001" },
    { id: "bank-2", bank: "Bancolombia (Colombia)", type: "Cta Ahorros", num: "450-891234-90", holder: "CARINOSAS LATAM", ruc: "901.482.119-4" },
    { id: "bank-3", bank: "BCP (Perú)", type: "Cta Corriente Soles/USD", num: "193-48912345-0-88", holder: "CARINOSAS PERU SAC", ruc: "20608912451" },
  ];

  // Sanitized copywriting for title to prevent "Membresía & Pase Pase..."
  const displayTitle = useMemo(() => {
    if (!planName) return "Membresía Alpha Caballero VIP";
    const lower = planName.toLowerCase().trim();
    if (lower === "pase vip diamante" || lower === "pase alpha caballero vip" || lower === "pase alpha founder" || lower === "membresía alpha caballero vip") {
      return "Membresía Alpha Caballero VIP";
    }
    if (planName.startsWith("Pase ")) {
      return `Membresía ${planName.replace(/^Pase\s+/i, "")}`;
    }
    if (!lower.includes("membresía") && !lower.includes("pase")) {
      return `Membresía ${planName}`;
    }
    return planName;
  }, [planName]);

  // Sanitized currency string to prevent "$$50 USD USD"
  const displayPrice = useMemo(() => {
    if (planPrice === undefined || planPrice === null) return "$50 USD";
    const raw = String(planPrice).trim();
    const isMonthly = raw.toLowerCase().includes("mes");
    const cleanedNum = raw.replace(/[^\d.]/g, "");
    const numVal = cleanedNum || "50";
    return isMonthly ? `$${numVal} USD / mes` : `$${numVal} USD`;
  }, [planPrice]);

  if (!isOpen) return null;

  const currentWallet = WALLETS[cryptoNetwork];

  const handleCopy = (text: string, key: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(text);
      setCopiedKey(key);
      if ("vibrate" in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHashOrRef.trim()) {
      setErrorMsg("Por favor ingresa el número de referencia o hash de la transacción.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const res = await registerVIPPassAction({
      holder_name: fullName || "Socio VIP Confidencial",
      tier_type: "gentleman",
      tier_level: planName.includes("Elite") ? "Alpha Founder" : "Diamante",
      payment_method: paymentMethod === "crypto" ? "crypto_usdt" : "bank_transfer",
      payment_hash: txHashOrRef,
      origin_country: "EC"
    });

    setIsSubmitting(false);

    if (res.success && res.passCode) {
      setPassCreated(res.passCode);
      try {
        soundFX?.playGoldChime();
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5, x: 0.5 },
          colors: ['#D4A843', '#FFE088', '#F5E0A0', '#AA7C11', '#FFFFFF'],
        });
      } catch {}
      if (onSuccess) onSuccess(res.passCode);
    } else {
      setErrorMsg(res.error || "No se pudo procesar el pase. Intenta nuevamente.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl glass-obsidian border border-[#D4AF37]/40 rounded-[2.5rem] p-6 md:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.95)] space-y-6 max-h-[88dvh] overflow-y-auto custom-scrollbar pb-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X size={15} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold mx-auto shadow-[0_0_25px_rgba(212,168,67,0.3)]">
            <Crown size={26} />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white italic">
            {displayTitle}
          </h3>
          <p className="text-xs text-[#A1A1AA]">
            Total a pagar: <strong className="text-brand-gold font-serif text-base">{displayPrice}</strong>
          </p>
        </div>

        {passCreated ? (
          /* SUCCESS SCREEN */
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <Check size={32} className="stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-serif text-white font-bold italic">¡Pase VIP Activado con Éxito!</h4>
              <p className="text-xs text-[#A1A1AA]">Guarda tu código personal para acceder a los beneficios exclusivos:</p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/40 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-brand-gold">{passCreated}</span>
              <button
                onClick={() => handleCopy(passCreated, "pass")}
                className="px-3.5 py-1.5 rounded-xl bg-brand-gold text-brand-black text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95"
              >
                {copiedKey === "pass" ? "¡Copiado! ✓" : "Copiar Código"}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(212,168,67,0.4)] hover:scale-[1.01] active:scale-98 transition-all"
            >
              Comenzar a Disfrutar
            </button>
          </div>
        ) : (
          /* PAYMENT FLOW */
          <div className="space-y-6">
            
            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl glass-dark border border-white/10">
              <button
                type="button"
                onClick={() => setPaymentMethod("crypto")}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === "crypto"
                    ? "bg-[#D4AF37] text-black shadow-md font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <QrCode size={15} />
                <span>USDT Cripto</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank")}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === "bank"
                    ? "bg-[#D4AF37] text-black shadow-md font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Building2 size={15} />
                <span>Banco Local</span>
              </button>
            </div>

            {/* CRYPTO TAB */}
            {paymentMethod === "crypto" && (
              <div className="space-y-4">
                {/* Network Chips */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A1A1AA] font-bold uppercase tracking-wider">Red USDT:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCryptoNetwork("TRC20")}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        cryptoNetwork === "TRC20"
                          ? "bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                          : "glass-dark border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/30"
                      }`}
                    >
                      TRC20 (Red Tron)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCryptoNetwork("BEP20")}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        cryptoNetwork === "BEP20"
                          ? "bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                          : "glass-dark border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/30"
                      }`}
                    >
                      BEP20 (BNB Smart Chain)
                    </button>
                  </div>
                </div>

                {/* Wallet Box */}
                <div className="p-4 rounded-2xl glass-dark border border-brand-gold/30 space-y-2 relative">
                  <span className="text-[9px] text-[#A1A1AA] uppercase font-black tracking-widest block">
                    Dirección de Billetera ({cryptoNetwork}):
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-brand-gold break-all">{currentWallet}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentWallet, "wallet")}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-black text-[10px] font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      {copiedKey === "wallet" ? (
                        <CheckCircle2 size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={11} />
                      )}
                      <span>{copiedKey === "wallet" ? "¡Copiado al portapapeles!" : "Copiar Billetera"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BANK TAB */}
            {paymentMethod === "bank" && (
              <div className="space-y-3">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-widest block">
                  Cuentas Bancarias Oficiales:
                </span>
                <div className="grid grid-cols-1 gap-2.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                  {BANK_ACCOUNTS.map((acc) => (
                    <div key={acc.id} className="p-3.5 rounded-2xl glass-dark border border-white/10 space-y-1.5 hover:border-brand-gold/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{acc.bank}</span>
                        <span className="text-[9px] text-brand-gold uppercase font-mono">{acc.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-brand-gold">
                        <span>N°: {acc.num}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(acc.num, acc.id)}
                          className="text-[9px] text-[#A1A1AA] hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-brand-gold/20 border border-white/10 hover:border-brand-gold/40 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          {copiedKey === acc.id ? (
                            <span className="text-emerald-400 font-bold">¡Copiado al portapapeles! ✓</span>
                          ) : (
                            <>
                              <Copy size={10} />
                              <span>Copiar N°</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[9px] text-[#A1A1AA]">Titular: {acc.holder} · RUC: {acc.ruc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmation Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-widest block mb-1">
                  Nombre o Alias Confidencial
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Socio VIP / Andrés"
                  className="w-full glass-dark border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#A1A1AA] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-widest block mb-1">
                  {paymentMethod === "crypto" ? "Hash de la Transacción (TXID)" : "Número de Comprobante / Referencia Bancaria"}
                </label>
                <input
                  type="text"
                  required
                  value={txHashOrRef}
                  onChange={(e) => setTxHashOrRef(e.target.value)}
                  placeholder={paymentMethod === "crypto" ? "Pega el TXID de tu retiro" : "Ej: 00489128"}
                  className="w-full glass-dark border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#A1A1AA] outline-none transition-colors font-mono"
                />
              </div>

              {errorMsg && (
                <p className="text-[10px] text-rose-400 font-bold">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.4)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verificando Pago...</span>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Confirmar Pago & Obtener Pase VIP</span>
                  </>
                )}
              </button>
            </form>

          </div>
        )}

      </motion.div>
    </div>
  );
}

