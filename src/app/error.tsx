"use client";

import React, { useEffect } from "react";
import { RefreshCw, ShieldAlert, Home, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Platform Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08080C] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[#131317]/90 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 sm:p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <ShieldAlert size={32} />
        </div>

        <span className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-[10px] font-black tracking-widest uppercase mb-4">
          Protocolo de Seguridad Activado
        </span>

        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-3 text-white">
          Interrupción Temporal
        </h1>

        <p className="text-neutral-400 text-xs leading-relaxed mb-8">
          Hemos detectado una anomalía en la conexión segura. Tus datos y navegación permanecen 100% protegidos y encriptados.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-gold to-amber-500 text-brand-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <RefreshCw size={15} />
            Reintentar Conexión
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 text-white font-medium text-xs tracking-wider hover:bg-white/10 transition-all"
          >
            <Home size={15} className="text-brand-gold" />
            Volver al Inicio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
