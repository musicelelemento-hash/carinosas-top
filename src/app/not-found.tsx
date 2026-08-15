"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Home, Sparkles, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08080C] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-[#131317]/80 backdrop-blur-2xl border border-brand-gold/20 rounded-3xl p-8 sm:p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-10"
      >
        {/* Glowing 404 Badge */}
        <div className="w-20 h-20 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <ShieldAlert className="text-brand-gold w-10 h-10 animate-pulse" />
        </div>

        <span className="inline-block px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold text-[10px] font-black tracking-[0.25em] uppercase mb-4">
          Acceso No Encontrado · 404
        </span>

        <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-3 text-white">
          Destino Exclusivo No Disponible
        </h1>

        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-8 font-light">
          El perfil o la sección solicitada ha sido reubicada o protegida por nuestro protocolo de discreción y seguridad.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-gold via-amber-300 to-yellow-500 text-brand-black font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Home size={16} />
            Volver al Directorio VIP
          </Link>

          <Link
            href="/#catalogo"
            className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 text-white font-medium text-xs tracking-wider hover:bg-white/10 transition-all"
          >
            <Search size={15} className="text-brand-gold" />
            Explorar Modelos Disponibles
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>CIFRADO AES-256</span>
          <span className="flex items-center gap-1 text-brand-gold/80">
            <Sparkles size={10} /> CARIÑOSAS.TOP
          </span>
        </div>
      </motion.div>
    </div>
  );
}
