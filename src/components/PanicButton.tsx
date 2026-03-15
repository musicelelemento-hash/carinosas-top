"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

export default function PanicButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePanic = () => {
    // Immediate redirect to Google News for discretion
    window.location.href = "https://news.google.com";
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handlePanic}
      className="fixed bottom-6 left-6 z-[100] group flex items-center gap-3 bg-brand-black/40 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full hover:bg-brand-pink/20 hover:border-brand-pink/50 transition-all active:scale-95 shadow-2xl"
      title="Incógnito Flash (Salida Rápida)"
    >
      <div className="relative">
        <ShieldAlert className="text-brand-pink group-hover:animate-pulse" size={20} />
        <div className="absolute inset-0 bg-brand-pink/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <span className="text-xs font-bold text-brand-white/70 group-hover:text-brand-white uppercase tracking-tighter">
        Salir Rápido
      </span>
    </button>
  );
}
