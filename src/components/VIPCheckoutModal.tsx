"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  X,
  Crown,
  Check,
  Copy,
  CheckCircle2,
  QrCode,
  Building2,
  Sparkles,
  Zap,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
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

type PaymentMethod = "auto" | "manual" | "bank";

interface NpOrder {
  passCode: string;
  paymentId: number;
  paymentStatus: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  priceAmount: number;
  priceCurrency: string;
}

const NP_TERMINAL_FAIL_STATUSES = ["failed", "expired", "refunded"];

const STATUS_LABEL: Record<string, string> = {
  waiting: "Esperando pago…",
  confirming: "Confirmando transacción…",
  confirmed: "Pago confirmado — activando…",
  sending: "Procesando…",
  finished: "Pagado ✓",
  partially_paid: "Pago parcial",
  failed: "Fallido",
  expired: "Expirado",
  refunded: "Reembolsado",
};

export default function VIPCheckoutModal({
  isOpen,
  onClose,
  planName = "Pase VIP Diamante",
  planPrice = 49,
  onSuccess
}: VIPCheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("auto");
  const [cryptoNetwork, setCryptoNetwork] = useState<"TRC20" | "BEP20">("TRC20");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [txHashOrRef, setTxHashOrRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passCreated, setPassCreated] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [npOrder, setNpOrder] = useState<NpOrder | null>(null);
  const [npStatus, setNpStatus] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const WALLETS = {
    TRC20: process.env.NEXT_PUBLIC_VIP_TRC20_WALLET || "",
    BEP20: process.env.NEXT_PUBLIC_VIP_BEP20_WALLET || "",
  };

  const BANK_ACCOUNTS = [
    { id: "bank-0", bank: "Banco Pichincha (Ecuador)", type: "Cta Corriente", num: "2100894561", holder: "CARINOSAS MEDIA CORP", ruc: "1792849501001" },
    { id: "bank-1", bank: "Banco Guayaquil (Ecuador)", type: "Cta Ahorros", num: "0012489563", holder: "CARINOSAS VIP GROUP", ruc: "1792849501001" },
    { id: "bank-2", bank: "Bancolombia (Colombia)", type: "Cta Ahorros", num: "450-891234-90", holder: "CARINOSAS LATAM", ruc: "901.482.119-4" },
    { id: "bank-3", bank: "BCP (Perú)", type: "Cta Corriente Soles/USD", num: "193-48912345-0-88", holder: "CARINOSAS PERU SAC", ruc: "20608912451" },
  ];

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

  const displayPrice = useMemo(() => {
    if (planPrice === undefined || planPrice === null) return "$50 USD";
    const raw = String(planPrice).trim();
    const isMonthly = raw.toLowerCase().includes("mes");
    const cleanedNum = raw.replace(/[^\d.]/g, "");
    const numVal = cleanedNum || "50";
    return isMonthly ? `$${numVal} USD / mes` : `$${numVal} USD`;
  }, [planPrice]);

  const finalizePass = useCallback((code: string) => {
    setPassCreated(code);
    setNpStatus("finished");
    if (typeof window !== "undefined") {
      localStorage.setItem("vip_pass_code", code);
      window.dispatchEvent(new CustomEvent("vip_pass_updated"));
    }
    try {
      soundFX?.playGoldChime();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#D4A843', '#FFE088', '#F5E0A0', '#AA7C11', '#FFFFFF'],
      });
    } catch {}
    if (onSuccess) onSuccess(code);
  }, [onSuccess]);

  const checkPaymentStatus = useCallback(async () => {
    if (!npOrder) return;
    try {
      const res = await fetch(`/api/np/status?payment_id=${npOrder.paymentId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Error consultando el estado del pago.");
        return;
      }
      setNpStatus(data.paymentStatus);
      if (data.paymentStatus === "finished" || data.paymentStatus === "confirmed") {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        finalizePass(npOrder.passCode);
      } else if (NP_TERMINAL_FAIL_STATUSES.includes(data.paymentStatus)) {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        setErrorMsg(`El pago terminó en estado "${data.paymentStatus}". Puedes crear una nueva orden.`);
      }
    } catch {
      // Fire-and-forget: el siguiente poll reintenta.
    }
  }, [npOrder, finalizePass]);

  useEffect(() => {
    if (!npOrder || passCreated) return;
    checkPaymentStatus();
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(checkPaymentStatus, 8000);
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    };
  }, [npOrder, passCreated, checkPaymentStatus]);

  if (!isOpen) return null;

  const currentWallet = WALLETS[cryptoNetwork];
  const walletConfigured = Boolean(currentWallet && currentWallet.length > 20);
  const currentPayCurrency = cryptoNetwork === "BEP20" ? "usdtbsc20" : "usdttrc20";

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

  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    setErrorMsg("");
    setNpStatus(null);
    try {
      const tierLevel = planName.includes("Elite") ? "Alpha Founder" : "Diamante";
      const res = await fetch("/api/np/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holderName: fullName || "Socio VIP Confidencial",
          tierLevel,
          tierType: "gentleman",
          payCurrency: currentPayCurrency,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo crear la orden de pago.");
        return;
      }
      setNpOrder({
        passCode: data.passCode,
        paymentId: data.paymentId,
        paymentStatus: data.paymentStatus,
        payAddress: data.payAddress,
        payAmount: data.payAmount,
        payCurrency: data.payCurrency,
        priceAmount: data.priceAmount,
        priceCurrency: data.priceCurrency,
      });
    } catch {
      setErrorMsg("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCancelOrder = () => {
    setNpOrder(null);
    setNpStatus(null);
    setErrorMsg("");
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
      payment_method: paymentMethod === "manual" ? "crypto_usdt" : "bank_transfer",
      payment_hash: txHashOrRef,
      origin_country: "EC"
    });

    setIsSubmitting(false);

    if (res.success && res.passCode) {
      finalizePass(res.passCode);
    } else {
      setErrorMsg(res.error || "No se pudo procesar el pase. Intenta nuevamente.");
    }
  };

  const statusPillClass =
    npStatus === "finished" || npStatus === "confirmed"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
      : NP_TERMINAL_FAIL_STATUSES.includes(npStatus || "")
        ? "bg-rose-500/15 text-rose-400 border-rose-500/40"
        : "bg-amber-500/15 text-amber-400 border-amber-500/40";

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
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl glass-dark border border-white/10">
              <button
                type="button"
                onClick={() => setPaymentMethod("auto")}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "auto"
                    ? "bg-[#D4AF37] text-black shadow-md font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Zap size={14} />
                <span>Cripto Auto</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("manual")}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "manual"
                    ? "bg-[#D4AF37] text-black shadow-md font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <QrCode size={14} />
                <span>USDT Manual</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank")}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "bank"
                    ? "bg-[#D4AF37] text-black shadow-md font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Building2 size={14} />
                <span>Banco Local</span>
              </button>
            </div>

            {/* AUTO CRYPTO TAB */}
            {paymentMethod === "auto" && (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#D4AF37]/8 border border-brand-gold/25">
                  <Zap size={15} className="text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Pago <strong className="text-brand-gold">automático y verificado</strong>:
                    al recibir tu USDT, el pase se activa solo (sin copiar hashes).
                  </p>
                </div>

                {npOrder ? (
                  /* ORDER CREATED */
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl glass-dark border border-brand-gold/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-[#A1A1AA] uppercase font-black tracking-widest">
                          Envía exactamente
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold uppercase ${statusPillClass}`}
                        >
                          {STATUS_LABEL[npStatus || npOrder.paymentStatus] || npOrder.paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-2xl font-bold text-brand-gold">
                          {Number(npOrder.payAmount).toFixed(2)}
                        </span>
                        <span className="font-mono text-xs text-white/60 uppercase">
                          {npOrder.payCurrency}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">
                          ≈ ${Number(npOrder.priceAmount).toFixed(2)} {npOrder.priceCurrency}
                        </span>
                      </div>

                      <div className="pt-1">
                        <span className="text-[9px] text-[#A1A1AA] uppercase font-black tracking-widest block mb-1">
                          Dirección de pago ({npOrder.payCurrency})
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-brand-gold break-all">{npOrder.payAddress}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(npOrder.payAddress, "np-address")}
                            className="px-3.5 py-1.5 rounded-xl bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-black text-[10px] font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            {copiedKey === "np-address" ? (
                              <CheckCircle2 size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} />
                            )}
                            <span>{copiedKey === "np-address" ? "¡Copiado!" : "Copiar"}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => void checkPaymentStatus()}
                        className="px-4 py-2.5 rounded-xl glass-dark border border-white/10 text-[10px] font-black uppercase tracking-wider text-white/80 hover:text-white hover:border-brand-gold/40 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        Verificar ahora
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelOrder}
                        className="px-4 py-2.5 rounded-xl glass-dark border border-white/10 text-[10px] font-black uppercase tracking-wider text-white/50 hover:text-white hover:border-rose-500/40 transition-all cursor-pointer"
                      >
                        Cancelar pago
                      </button>
                    </div>

                    <p className="text-[10px] text-white/40 text-center">
                      Estado verificado cada ~8 segundos automáticamente. No cierres esta ventana hasta completar el envío.
                    </p>
                  </div>
                ) : (
                  /* NO ORDER YET */
                  <div className="space-y-3">
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

                    {errorMsg && (
                      <p className="text-[10px] text-rose-400 font-bold">{errorMsg}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleCreateOrder()}
                      disabled={isCreatingOrder}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.4)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isCreatingOrder ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Creando orden segura…
                        </span>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Pagar ahora con USDT</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MANUAL CRYPTO TAB */}
            {paymentMethod === "manual" && (
              <div className="space-y-4">
                {!walletConfigured && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/75">
                      La billetera manual no está configurada. Usa la opción{" "}
                      <strong className="text-brand-gold">Cripto Auto</strong> para pagos verificados automáticamente.
                    </p>
                  </div>
                )}

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

                {walletConfigured && (
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
                )}
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

            {/* Confirmation Form (solo manual/bank) */}
            {paymentMethod !== "auto" && (
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
                    {paymentMethod === "manual" ? "Hash de la Transacción (TXID)" : "Número de Comprobante / Referencia Bancaria"}
                  </label>
                  <input
                    type="text"
                    required
                    value={txHashOrRef}
                    onChange={(e) => setTxHashOrRef(e.target.value)}
                    placeholder={paymentMethod === "manual" ? "Pega el TXID de tu retiro" : "Ej: 00489128"}
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
            )}

          </div>
        )}

      </motion.div>
    </div>
  );
}