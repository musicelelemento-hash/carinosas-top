"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

interface WhatsAppTransitionProps {
  modelName: string;
  isOpen: boolean;
  onComplete: () => void;
}

export default function WhatsAppTransition({ modelName, isOpen, onComplete }: WhatsAppTransitionProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-brand-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck size={32} className="text-brand-gold" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-serif text-brand-gold tracking-tight">Acceso Privado</h2>
          <p className="text-brand-white/70 text-lg leading-relaxed">
            Conectando con la línea segura de <span className="text-brand-white font-bold">{modelName}</span>...
          </p>
        </div>

        <div className="glass-dark border border-brand-gold/10 p-4 rounded-2xl">
          <div className="flex items-center justify-center gap-3 text-brand-white/40 text-[10px] uppercase tracking-[0.3em] font-black">
            <Loader2 size={14} className="animate-spin" />
            Encriptación de Extremo a Extremo
          </div>
        </div>

        <p className="text-[10px] text-brand-pink uppercase tracking-widest font-black animate-pulse">
          Discreción Garantizada
        </p>
      </div>
    </div>
  );
}
