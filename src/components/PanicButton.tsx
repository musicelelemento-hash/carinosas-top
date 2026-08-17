"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

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
      aria-label="Salida Rápida Discreta: Redirige instantáneamente a Google o presiona Doble Escape"
      className="hidden md:flex fixed bottom-6 right-28 z-[50] group items-center gap-2 glass-obsidian border border-white/15 px-4 py-2.5 rounded-full hover:border-[#FF0062]/60 hover:bg-[#FF0062]/15 focus-visible:ring-2 focus-visible:ring-[#FF0062] focus-visible:outline-none transition-all active:scale-95 shadow-2xl cursor-pointer"
      title="Salida Rápida Discreta (Doble Esc)"
    >
      <div className="relative">
        <ShieldAlert className="text-[#FF0062] group-hover:animate-pulse" size={15} aria-hidden="true" />
      </div>
      <span className="text-[10px] font-black text-white/70 group-hover:text-white uppercase tracking-wider">
        Salida Rápida
      </span>
    </button>
  );
}
