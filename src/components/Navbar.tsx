"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Sparkles, MapPin, Diamond, Bot, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onChangeLocation?: () => void;
}

export default function Navbar({ onChangeLocation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        scrolled
          ? "bg-[#08080C]/90 backdrop-blur-2xl border-b border-brand-gold/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
          : "bg-transparent"
      }`}>

        {/* Top gold line */}
        <div className={`h-[1px] w-full transition-opacity duration-700 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.6), rgba(212,168,67,0.9), rgba(212,168,67,0.6), transparent)' }}
        />

        <div className="max-w-[1700px] mx-auto px-6 md:px-12">
          <div className={`flex justify-between items-center transition-all duration-700 ${scrolled ? 'h-[70px]' : 'h-[90px]'}`}>

            {/* LEFT: Brand Logo */}
            <Link href="/" className="group flex flex-col items-start gap-0.5 relative">
              <div className="flex items-baseline">
                <span className={`font-serif font-bold tracking-[0.06em] transition-all duration-700 leading-none ${scrolled ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}`}
                  style={{
                    background: 'linear-gradient(135deg, #F8E5AE 0%, #D4A843 40%, #9A7830 65%, #D4A843 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  CARIÑOSAS
                </span>
                <span className={`font-serif font-bold tracking-[0.06em] text-white transition-all duration-700 leading-none ${scrolled ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}`}>
                  .TOP
                </span>
              </div>
              <div className="flex items-center gap-2 group-hover:opacity-80 transition-opacity">
                <div className="h-px w-5 bg-brand-gold/60" />
                <span className="text-[8px] md:text-[9px] text-brand-gold/70 uppercase tracking-[0.4em] font-bold">
                  Directorio Élite Ecuador
                </span>
              </div>
            </Link>

            {/* CENTER: Navigation Links */}
            <div className="hidden lg:flex items-center gap-2">
              {[
                { href: '/#mapa', icon: <MapPin size={13} />, label: 'Radar GPS' },
                { href: '/#collection', icon: <Sparkles size={13} />, label: 'Catálogo 4K' },
              ].map(({ href, icon, label }) => (
                <Link key={href} href={href}
                  className="group flex items-center gap-2 px-5 py-2 rounded-full text-[10px] text-white/60 hover:text-white font-black uppercase tracking-[0.2em] transition-all glass-obsidian border border-transparent hover:border-brand-gold/30"
                >
                  <span className="text-brand-gold group-hover:scale-110 transition-transform">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3 md:gap-5">

              {/* Change Location */}
              {onChangeLocation && (
                <button
                  onClick={onChangeLocation}
                  className="hidden sm:flex items-center gap-1.5 text-[9px] text-white/50 hover:text-brand-gold uppercase tracking-widest font-bold transition-all px-3 py-1.5 rounded-full glass-dark border border-white/10"
                >
                  <MapPin size={11} className="text-brand-gold" />
                  <span>Ciudad</span>
                </button>
              )}

              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-2 text-[10px] text-white/50 hover:text-white uppercase tracking-widest font-bold transition-all"
              >
                <User size={13} className="text-brand-gold" />
                Admin
              </Link>

              {/* Join as Model CTA */}
              <Link
                href="/registro"
                className="relative group overflow-hidden px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-300 active:scale-95 shadow-[0_4px_20px_rgba(212,168,67,0.35)] bg-brand-gold text-brand-black hover:bg-white flex items-center gap-2"
              >
                <Diamond size={12} className="fill-current" />
                <span>Únete a la Élite</span>
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 rounded-2xl glass-obsidian border border-white/15 flex flex-col items-center justify-center gap-1.5 text-white hover:border-brand-gold/50 transition-all"
              >
                <span className={`w-4 h-[1.5px] bg-brand-gold rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
                <span className={`w-3 h-[1.5px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-4 h-[1.5px] bg-brand-gold rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass-obsidian border-t border-brand-gold/20 px-8 py-6 space-y-4 shadow-2xl">
            <Link href="/#mapa" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/70 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <MapPin size={14} className="text-brand-gold" /> Radar GPS en Vivo
            </Link>
            <Link href="/#collection" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/70 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <Sparkles size={14} className="text-brand-gold" /> Catálogo 4K
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/70 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <User size={14} className="text-brand-gold" /> Panel de Administración
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
