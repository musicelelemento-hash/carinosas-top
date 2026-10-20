"use client";

import React, { useCallback } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { sound } from "@/lib/soundEngine";

interface WhatsAppConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phone: string, name: string, city?: string) => void;
  phone: string;
  name: string;
  city?: string;
}

export default function WhatsAppConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  phone,
  name,
  city,
}: WhatsAppConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = useCallback(() => {
    sound.playGoldChime();
    const cleanPhone = phone.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("593") ? cleanPhone : `593${cleanPhone.replace(/^0/, "")}`;
    onConfirm(fullPhone, name, city);
  }, [phone, name, city, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar contacto por WhatsApp"
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="w-full max-w-md p-4 mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-premium border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mb-2">
              <Phone size={32} className="text-brand-gold" />
            </div>

            <h2 className="font-serif font-bold text-2xl text-white leading-tight">
              ¿Escribir a <span className="italic text-brand-gold">{name}</span>?
            </h2>

            <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
              Serás redirigido a WhatsApp para iniciar el chat con {name} {city ? `en ${city}` : ""}. Tu número no se expone públicamente.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="flex-1 px-5 py-3 rounded-xl bg-transparent border border-white/[0.1] text-white/60 font-bold text-sm uppercase tracking-wider hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-5 py-3 rounded-xl btn-gold-premium text-[#08080B] font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(212,168,67,0.3)]"
              >
                <Send size={16} className="mr-2" />
                Sí, escribir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
