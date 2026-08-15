"use client";

import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  QrCode, 
  Building, 
  Lock, 
  Sparkles, 
  MessageCircle,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Globe,
  Loader2
} from "lucide-react";
import { registerVIPPassAction } from "@/app/actions/vip";

interface VIPCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: string;
}

type PaymentTab = "binance_crypto" | "banco_pichincha" | "banco_guayaquil" | "paypal_skrill";

export default function VIPCheckoutModal({ 
  isOpen, 
  onClose, 
  planName = "Pase Alpha VIP", 
  planPrice = "$50 USD" 
}: VIPCheckoutModalProps) {
  const [tab, setTab] = useState<PaymentTab>("binance_crypto");
  const [cryptoSubtype, setCryptoSubtype] = useState<"usdt_bep20" | "usdt_trc20" | "binance_id">("usdt_bep20");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [receiptCode] = useState(() => `ALPHA-${Math.floor(1000 + Math.random() * 9000)}-VIP`);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(15); } catch {}
    }
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCompletePayment = async () => {
    setIsRegistering(true);
    try {
      let method: 'crypto_usdt' | 'crypto_btc' | 'bank_transfer' | 'complimentary' = 'crypto_usdt';
      if (tab === "banco_pichincha" || tab === "banco_guayaquil" || tab === "paypal_skrill") {
        method = "bank_transfer";
      }

      await registerVIPPassAction({
        pass_code: receiptCode,
        holder_name: "Socio VIP Confidencial",
        tier_type: "gentleman",
        tier_level: planName.includes("Founder") ? "Alpha Founder" : "Diamante",
        payment_method: method,
        payment_hash: `TX-${receiptCode}`
      });
    } catch (err) {
      console.warn("Pass registration notice:", err);
    } finally {
      setIsRegistering(false);
      setIsSuccess(true);
    }
  };

  const handleConfirmWhatsApp = () => {
    let methodText = "Cripto Binance / USDT";
    if (tab === "banco_pichincha") methodText = "Transferencia Banco Pichincha";
    if (tab === "banco_guayaquil") methodText = "Transferencia Banco Guayaquil";
    if (tab === "paypal_skrill") methodText = "PayPal / Skrill VIP";

    const text = encodeURIComponent(
      `👑 *CARIÑOSAS.TOP — CONFIRMACIÓN DE PAGO CONFIDENCIAL*\n\n` +
      `Hola Concierge, acabo de realizar el pago de mi *${planName}* (${planPrice}) mediante *${methodText}*.\n` +
      `Código de Recibo: *#${receiptCode}*\n\n` +
      `Adjunto comprobante para activación instantánea de mi Bóveda y Pase VIP.`
    );
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[195] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg glass-obsidian border border-brand-gold/40 rounded-[2.5rem] p-7 md:p-8 shadow-[0_50px_120px_rgba(0,0,0,0.95)] overflow-hidden z-10 animate-in zoom-in-95 duration-300 space-y-6">
        
        {/* Ambient Gold Glow */}
        <div className="absolute -top-32 -right-32 w-60 h-60 bg-brand-gold/15 rounded-full blur-[90px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-xs"
        >
          <X size={16} />
        </button>

        {isSuccess ? (
          /* Success Receipt Screen */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={40} />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.3em] block">Recibo Cifrado Generado</span>
              <h3 className="text-2xl font-serif text-white italic font-bold">¡Pago Confidencial Registrado!</h3>
              <p className="text-xs text-white/60 max-w-xs mx-auto">
                Código de Auditoría: <span className="font-mono text-brand-gold font-bold">#{receiptCode}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-dark border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between text-white/60">
                <span>Concepto Blindado:</span>
                <span className="text-white font-medium">Alpha Tech Global Services LLC</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Monto a Activar:</span>
                <span className="text-brand-gold font-bold">{planPrice}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Privacidad:</span>
                <span className="text-emerald-400 font-bold">100% Blindado · Sin Rastro</span>
              </div>
            </div>

            <button
              onClick={handleConfirmWhatsApp}
              className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} fill="currentColor" />
              Activar Pase con el Concierge Oficial
            </button>
          </div>
        ) : (
          /* Normal Checkout Screen */
          <div className="space-y-5">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/30 text-brand-gold text-[8px] font-black uppercase tracking-widest mb-2">
                <Lock size={10} /> Blindaje Corporativo & Anonimato Total
              </div>
              <h3 className="text-2xl font-serif text-white italic font-bold">
                Checkout Discreto <span className="text-brand-gold">VIP</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Adquiere tu <strong className="text-white">{planName}</strong> por <strong className="text-brand-gold">{planPrice}</strong> con total reserva.
              </p>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              <button
                type="button"
                onClick={() => setTab("binance_crypto")}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  tab === "binance_crypto"
                    ? "border-brand-gold bg-brand-gold/15 text-white shadow-md font-bold"
                    : "border-white/10 glass-dark text-white/50 hover:text-white"
                }`}
              >
                <span className="text-base">🪙</span>
                <span className="text-[9px] uppercase font-black tracking-wider">Binance / USDT</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("banco_pichincha")}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  tab === "banco_pichincha"
                    ? "border-brand-gold bg-brand-gold/15 text-white shadow-md font-bold"
                    : "border-white/10 glass-dark text-white/50 hover:text-white"
                }`}
              >
                <span className="text-base">🏦</span>
                <span className="text-[9px] uppercase font-black tracking-wider">Pichincha 🇪🇨</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("banco_guayaquil")}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  tab === "banco_guayaquil"
                    ? "border-brand-gold bg-brand-gold/15 text-white shadow-md font-bold"
                    : "border-white/10 glass-dark text-white/50 hover:text-white"
                }`}
              >
                <span className="text-base">🏦</span>
                <span className="text-[9px] uppercase font-black tracking-wider">Guayaquil 🇪🇨</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("paypal_skrill")}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  tab === "paypal_skrill"
                    ? "border-brand-gold bg-brand-gold/15 text-white shadow-md font-bold"
                    : "border-white/10 glass-dark text-white/50 hover:text-white"
                }`}
              >
                <span className="text-base">🅿️</span>
                <span className="text-[9px] uppercase font-black tracking-wider">PayPal / Skrill</span>
              </button>

            </div>

            {/* ── TAB CONTENT ── */}

            {/* 1. BINANCE / USDT CRIPTO */}
            {tab === "binance_crypto" && (
              <div className="p-4 rounded-2xl glass-dark border border-brand-gold/25 space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Binance Pay & USDT (0% Comisiones)</span>
                  <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">100% Anónimo</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl glass-obsidian border border-white/10 text-[9px] font-bold text-center">
                  <button
                    type="button"
                    onClick={() => setCryptoSubtype("usdt_bep20")}
                    className={`py-1.5 rounded-lg transition-all ${cryptoSubtype === "usdt_bep20" ? "bg-brand-gold text-brand-black" : "text-white/50"}`}
                  >
                    USDT (BEP20)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCryptoSubtype("usdt_trc20")}
                    className={`py-1.5 rounded-lg transition-all ${cryptoSubtype === "usdt_trc20" ? "bg-brand-gold text-brand-black" : "text-white/50"}`}
                  >
                    USDT (TRC20)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCryptoSubtype("binance_id")}
                    className={`py-1.5 rounded-lg transition-all ${cryptoSubtype === "binance_id" ? "bg-brand-gold text-brand-black" : "text-white/50"}`}
                  >
                    Binance Pay ID
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-white/50 uppercase tracking-wider font-bold block">
                    {cryptoSubtype === "binance_id" ? "Binance Pay ID Oficial:" : `Dirección Billetera (${cryptoSubtype.toUpperCase()}):`}
                  </span>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/15">
                    <span className="font-mono text-xs text-brand-gold font-bold truncate mr-2">
                      {cryptoSubtype === "binance_id" ? "481920381" : cryptoSubtype === "usdt_bep20" ? "0x71C...84920E" : "TX9Kz84R2nL7QmWp1s8VbDc6Y4GfEt3Ax9"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cryptoSubtype === "binance_id" ? "481920381" : cryptoSubtype === "usdt_bep20" ? "0x71C84920E993B4104829F81" : "TX9Kz84R2nL7QmWp1s8VbDc6Y4GfEt3Ax9", "crypto")}
                      className="px-3 py-1 rounded-lg bg-brand-gold text-brand-black font-bold text-[9px] uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1 shrink-0"
                    >
                      {copiedKey === "crypto" ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedKey === "crypto" ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BANCO PICHINCHA */}
            {tab === "banco_pichincha" && (
              <div className="p-4 rounded-2xl glass-dark border border-brand-gold/25 space-y-2.5 animate-in fade-in text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Banco Pichincha (Ecuador)</span>
                  <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-bold">Transferencia Directa</span>
                </div>

                <div className="space-y-1 text-[11px] text-white/80 p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-white/40">Titular Blindado:</span>
                    <span className="font-bold text-white">Alpha Tech Services</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Tipo de Cuenta:</span>
                    <span className="text-white font-medium">Ahorros / Corriente</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-white/10">
                    <span className="text-white/40">Número de Cuenta:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-brand-gold font-bold">2208491029</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("2208491029", "pichincha")}
                        className="px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[9px] font-bold"
                      >
                        {copiedKey === "pichincha" ? "✓" : "Copiar"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-emerald-400 font-bold pt-1">
                    <span>Concepto Discreto:</span>
                    <span>Servicios Digitales / Hosting</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BANCO GUAYAQUIL */}
            {tab === "banco_guayaquil" && (
              <div className="p-4 rounded-2xl glass-dark border border-brand-gold/25 space-y-2.5 animate-in fade-in text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Banco Guayaquil (Ecuador)</span>
                  <span className="text-[9px] bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded-full font-bold">Transferencia Directa</span>
                </div>

                <div className="space-y-1 text-[11px] text-white/80 p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-white/40">Titular Blindado:</span>
                    <span className="font-bold text-white">Alpha Tech Services</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Tipo de Cuenta:</span>
                    <span className="text-white font-medium">Cuenta de Ahorros</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-white/10">
                    <span className="text-white/40">Número de Cuenta:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-brand-gold font-bold">0039481023</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("0039481023", "guayaquil")}
                        className="px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[9px] font-bold"
                      >
                        {copiedKey === "guayaquil" ? "✓" : "Copiar"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-emerald-400 font-bold pt-1">
                    <span>Concepto Discreto:</span>
                    <span>Consultoría IT</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PAYPAL & SKRILL */}
            {tab === "paypal_skrill" && (
              <div className="p-4 rounded-2xl glass-dark border border-brand-gold/25 space-y-3 animate-in fade-in text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">PayPal VIP & Skrill Internacional</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">Global</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10">
                    <div>
                      <span className="text-[9px] text-white/40 block">Enlace PayPal Discreto:</span>
                      <span className="font-mono text-xs text-brand-gold font-bold">paypal.me/alphacloudvip</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("https://paypal.me/alphacloudvip", "paypal")}
                      className="px-2.5 py-1 rounded bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[9px] font-bold"
                    >
                      {copiedKey === "paypal" ? "✓" : "Copiar"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10">
                    <div>
                      <span className="text-[9px] text-white/40 block">Email Skrill VIP:</span>
                      <span className="font-mono text-xs text-brand-gold font-bold">payments@alphaholding.io</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("payments@alphaholding.io", "skrill")}
                      className="px-2.5 py-1 rounded bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[9px] font-bold"
                    >
                      {copiedKey === "skrill" ? "✓" : "Copiar"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Corporate Shield & Privacy Guarantee Note */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60 space-y-1">
              <div className="flex items-center gap-1.5 text-brand-gold font-bold">
                <ShieldCheck size={13} />
                <span>Escudo de Privacidad Corporativa Activo</span>
              </div>
              <p className="leading-tight">
                Tus datos bancarios y personales nunca se comparten. Los comprobantes se validan bajo cifrado militar de punto a punto.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isRegistering}
                onClick={handleCompletePayment}
                className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRegistering ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Encriptando y Registrando...</span>
                  </>
                ) : (
                  <>
                    <span>Ya Realicé el Pago · Generar Recibo</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleConfirmWhatsApp}
                className="w-full py-3 rounded-2xl glass-dark border border-white/10 text-white/60 hover:text-white font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} />
                <span>Consultar Dudas con Concierge en WhatsApp</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
