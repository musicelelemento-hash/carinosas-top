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
  ArrowRight
} from "lucide-react";

interface VIPCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: string;
}

export default function VIPCheckoutModal({ 
  isOpen, 
  onClose, 
  planName = "Pase Alpha VIP", 
  planPrice = "$50 USD" 
}: VIPCheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank'>('crypto');
  const [cryptoType, setCryptoType] = useState<'usdt' | 'btc'>('usdt');
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const cryptoWallets = {
    usdt: "TX9Kz84R2nL7QmWp1s8VbDc6Y4GfEt3Ax9",
    btc: "bc1q9v8u4x2z5m7k3p1w6t8r0y4e7c3a9"
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmWhatsApp = () => {
    const text = encodeURIComponent(`Hola Concierge de Cariñosas.top, acabo de realizar el pago confidencial de mi ${planName} (${planPrice}) mediante ${paymentMethod === 'crypto' ? 'Cripto ' + cryptoType.toUpperCase() : 'Transferencia Bancaria'}. Adjunto mi comprobante para activación instantánea.`);
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg glass-obsidian border border-brand-gold/40 rounded-[2.5rem] p-7 md:p-9 shadow-[0_50px_120px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Ambient Gold Gradient */}
        <div className="absolute -top-32 -right-32 w-60 h-60 bg-brand-gold/15 rounded-full blur-[90px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-xs"
        >
          <X size={16} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={40} />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.3em] block">Transacción Registrada</span>
              <h3 className="text-3xl font-serif text-white italic font-bold">¡Recibo Encriptado Generado!</h3>
              <p className="text-xs text-white/60 max-w-xs mx-auto">
                Código de Transacción: <span className="font-mono text-brand-gold font-bold">#TX-9482-ALPHA</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-dark border border-white/10 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-white/60">
                <span>Concepto Discreto:</span>
                <span className="text-white font-medium">Alpha Cloud VIP Services</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Monto:</span>
                <span className="text-brand-gold font-bold">{planPrice}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Estado:</span>
                <span className="text-emerald-400 font-bold">Verificación Prioritaria</span>
              </div>
            </div>

            <button
              onClick={handleConfirmWhatsApp}
              className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} fill="currentColor" />
              Activar Pase por WhatsApp Concierge
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/30 text-brand-gold text-[8px] font-black uppercase tracking-widest mb-3">
                <Lock size={10} /> Pasarela Blindada AES-256
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white italic font-bold">
                Checkout Discreto <span className="text-brand-gold">VIP</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Adquiere tu <strong className="text-white">{planName}</strong> ({planPrice}) con 100% de anonimato.
              </p>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-dark border border-white/10">
              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'crypto'
                    ? 'bg-brand-gold text-brand-black shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <QrCode size={14} /> Cripto Anónima
              </button>

              <button
                onClick={() => setPaymentMethod('bank')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'bank'
                    ? 'bg-brand-gold text-brand-black shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <Building size={14} /> Bancos Ecuador
              </button>
            </div>

            {/* Content for Crypto */}
            {paymentMethod === 'crypto' ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCryptoType('usdt')}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${
                      cryptoType === 'usdt'
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 text-white/40'
                    }`}
                  >
                    USDT (TRC-20 / BEP-20)
                  </button>
                  <button
                    onClick={() => setCryptoType('btc')}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${
                      cryptoType === 'btc'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-400'
                        : 'border-white/10 text-white/40'
                    }`}
                  >
                    Bitcoin (BTC)
                  </button>
                </div>

                <div className="p-4 rounded-2xl glass-dark border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-[9px] text-white/40 uppercase font-black tracking-wider">
                    <span>Dirección de Billetera ({cryptoType.toUpperCase()}):</span>
                    <span className="text-emerald-400">Red Rápida</span>
                  </div>

                  <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-xs text-brand-gold break-all">
                    <span className="flex-1 truncate">{cryptoWallets[cryptoType]}</span>
                    <button
                      onClick={() => handleCopy(cryptoWallets[cryptoType])}
                      className="p-1.5 rounded-lg bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all shrink-0"
                      title="Copiar dirección"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                  <p className="text-[8px] text-white/40 text-center uppercase tracking-wider">
                    Envía el equivalente exacto a <strong className="text-white">{planPrice}</strong>
                  </p>
                </div>
              </div>
            ) : (
              /* Content for National Banks */
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 rounded-2xl glass-dark border border-white/10 space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Banco:</span>
                    <span className="font-bold text-white">Banco Pichincha / Produbanco</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Tipo de Cuenta:</span>
                    <span className="text-white">Corriente / Ahorros</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Concepto Discreto:</span>
                    <span className="text-brand-gold font-bold">Consultoría Digital #948</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-white/40">Número de Cuenta:</span>
                    <span className="font-mono text-brand-gold font-bold">2208491840</span>
                  </div>
                </div>

                <p className="text-[8px] text-white/40 text-center uppercase tracking-wider">
                  Tu estado de cuenta reflejará únicamente servicios de marketing o consultoría.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsSuccess(true)}
                className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <span>He Realizado el Pago · Confirmar</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[8px] text-white/40 uppercase font-bold tracking-wider">
                <ShieldCheck size={12} className="text-emerald-400" />
                Cero menciones explícitas en recibos o extractos
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
