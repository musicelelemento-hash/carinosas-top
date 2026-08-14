"use client";

import React from "react";
import Link from "next/link";
import { User, Sparkles, MapPin, Diamond } from "lucide-react";

interface NavbarProps {
  onChangeLocation?: () => void;
}

export default function Navbar({ onChangeLocation }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        scrolled
          ? "bg-[#08080C]/90 backdrop-blur-[30px] border-b border-[rgba(212,168,67,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.7)]"
          : "bg-transparent"
      }`}>

        {/* Top ultra-thin gold line */}
        <div className={`h-[1px] w-full transition-opacity duration-700 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.6), rgba(212,168,67,0.9), rgba(212,168,67,0.6), transparent)' }}
        />

        <div className="max-w-[1700px] mx-auto px-8 md:px-14">
          <div className={`flex justify-between items-center transition-all duration-700 ${scrolled ? 'h-[68px]' : 'h-[88px]'}`}>

            {/* LEFT: Logo */}
            <Link href="/" className="group flex flex-col items-start gap-0.5 relative">
              <div className="flex items-baseline gap-0">
                <span className={`font-serif font-bold tracking-[0.08em] transition-all duration-700 leading-none ${scrolled ? 'text-[1.7rem]' : 'text-[2.1rem]'}`}
                  style={{
                    background: 'linear-gradient(135deg, #F8E5AE 0%, #D4A843 40%, #9A7830 65%, #D4A843 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  CARIÑOSAS
                </span>
                <span className={`font-serif font-bold tracking-[0.08em] text-white/95 transition-all duration-700 leading-none ${scrolled ? 'text-[1.7rem]' : 'text-[2.1rem]'}`}>
                  .TOP
                </span>
              </div>
              <div className="flex items-center gap-2.5 group-hover:opacity-80 transition-opacity">
                <div className="h-px w-6 bg-brand-gold/60" />
                <span className="text-[10px] text-brand-gold/60 uppercase tracking-[0.45em] font-bold">
                  Directorio Élite Digital
                </span>
              </div>
            </Link>

            {/* CENTER: Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { href: '/#mapa', icon: <MapPin size={12} />, label: 'Radar en Vivo' },
                { href: '/#collection', icon: <Sparkles size={12} />, label: 'Catálogo' },
              ].map(({ href, icon, label }) => (
                <Link key={href} href={href}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] text-white/55 hover:text-white font-bold uppercase tracking-[0.22em] transition-all hover:bg-white/5"
                >
                  <span className="text-brand-gold/60 group-hover:text-brand-gold transition-colors">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>

            {/* RIGHT: CTA */}
            <div className="flex items-center gap-4 md:gap-6">

              {/* Location change button */}
              {onChangeLocation && (
                <button
                  onClick={onChangeLocation}
                  className="hidden sm:flex items-center gap-1.5 text-[10px] text-white/40 hover:text-brand-gold/80 uppercase tracking-[0.2em] font-bold transition-all"
                >
                  <MapPin size={12} className="text-brand-gold/50" />
                  <span>Ubicación</span>
                </button>
              )}

              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-2 text-[11px] text-white/50 hover:text-white/90 uppercase tracking-[0.22em] font-bold transition-all"
              >
                <User size={14} className="text-brand-gold/70" />
                Ingreso
              </Link>

              <Link
                href="/registro"
                className="relative group overflow-hidden px-7 py-3 rounded-xl font-bold text-[11px] uppercase tracking-[0.25em] transition-all duration-300 active:scale-95 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #E8BC50 0%, #D4A843 50%, #BC8E2C 100%)',
                  color: '#0A0808',
                  boxShadow: '0 4px 20px rgba(212,168,67,0.4), 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Diamond size={11} className="fill-current" />
                  Únete a la Élite
                </span>
                {/* Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out" />
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-1.5 text-white/55 hover:text-white hover:border-brand-gold/40 transition-all"
              >
                <span className={`w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <span className={`w-3.5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-52 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-[#08080C]/98 backdrop-blur-[30px] border-t border-white/6 px-8 py-6 space-y-5">
            <Link href="/#mapa" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-[11px] text-white/55 hover:text-white uppercase tracking-[0.25em] font-bold transition-colors">
              <MapPin size={14} className="text-brand-gold" /> Radar en Vivo
            </Link>
            <Link href="/#collection" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-[11px] text-white/55 hover:text-white uppercase tracking-[0.25em] font-bold transition-colors">
              <Sparkles size={14} className="text-brand-gold" /> Catálogo
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-[11px] text-white/55 hover:text-white uppercase tracking-[0.25em] font-bold transition-colors">
              <User size={14} className="text-brand-gold" /> Ingreso de Miembros
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
