"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "h-16 bg-brand-black/40 backdrop-blur-2xl border-b border-brand-gold/10" 
        : "h-24 bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex-shrink-0">
            <Link href="/" className="group flex flex-col">
              <span className="text-2xl md:text-3xl font-serif text-brand-gold tracking-[0.2em] group-hover:text-white transition-colors duration-500">
                CARIÑOSAS<span className="text-white group-hover:text-brand-gold transition-colors duration-500">.TOP</span>
              </span>
              <span className="text-[8px] text-brand-gold/40 uppercase tracking-[0.5em] font-black -mt-1 group-hover:text-brand-gold/60 transition-colors">
                Elite Experiences
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="hidden md:block text-[10px] text-white/60 hover:text-brand-gold uppercase tracking-[0.3em] font-black transition-colors"
            >
              Explorar
            </Link>
            <Link 
              href="/registro" 
              className="relative group overflow-hidden bg-brand-gold text-brand-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-gold hover:shadow-gold/40"
            >
              <span className="relative z-10">Publicar Anuncio</span>
              <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0 opacity-20" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
