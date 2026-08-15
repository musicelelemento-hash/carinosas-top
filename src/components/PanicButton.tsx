"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, LogOut } from "lucide-react";

export default function PanicButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Double Escape key to quickly exit
    let lastEsc = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const now = Date.now();
        if (now - lastEsc < 600) {
          window.location.replace("https://www.google.com");
        }
        lastEsc = now;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePanic = () => {
    window.location.replace("https://www.google.com");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handlePanic}
      className="fixed bottom-20 md:bottom-6 left-4 md:left-auto md:right-28 z-[80] group flex items-center gap-2.5 glass-obsidian border border-white/15 px-3.5 sm:px-4 py-2.5 rounded-full hover:border-brand-pink/60 hover:bg-brand-pink/15 transition-all active:scale-95 shadow-2xl"
      title="Salida Rápida Discreta (Doble Esc)"
    >
      <div className="relative">
        <ShieldAlert className="text-brand-pink group-hover:animate-pulse" size={16} />
      </div>
      <span className="text-[10px] font-black text-white/60 group-hover:text-white uppercase tracking-wider hidden sm:inline">
        Salida Rápida
      </span>
    </button>
  );
}
