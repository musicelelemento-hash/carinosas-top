"use client";

import React from "react";
import Link from "next/link";
import { User, Sparkles, MapPin, Diamond } from "lucide-react";

export default function Navbar() {
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
          ? "py-0 bg-brand-black/80 backdrop-blur-[30px] border-b border-brand-gold/8 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "py-0 bg-transparent"
      }`}>

        {/* Top ultra-thin gold line */}
        <div className={`h-[1px] w-full transition-opacity duration-700 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), rgba(201,168,76,0.8), rgba(201,168,76,0.5), transparent)' }}
        />

        <div className="max-w-[1700px] mx-auto px-8 md:px-14">
          <div className={`flex justify-between items-center transition-all duration-700 ${scrolled ? 'h-[68px]' : 'h-[88px]'}`}>

            {/* LEFT: Logo */}
            <Link href="/" className="group flex flex-col items-start gap-0.5 relative">
              <div className="flex items-baseline gap-0">
                <span className={`font-serif font-bold tracking-[0.08em] transition-all duration-700 leading-none ${scrolled ? 'text-[1.7rem]' : 'text-[2.1rem]'}`}
                  style={{
                    background: 'linear-gradient(135deg, #F5E0A0 0%, #C9A84C 40%, #9A7B35 65%, #C9A84C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  CARIÑOSAS
                </span>
                <span className={`font-serif font-bold tracking-[0.08em] text-white/90 transition-all duration-700 leading-none ${scrolled ? 'text-[1.7rem]' : 'text-[2.1rem]'}`}>
                  .TOP
                </span>
              </div>
              <div className="flex items-center gap-2.5 group-hover:opacity-80 transition-opacity">
                <div className="h-px w-6 bg-brand-gold/50" />
                <span className="text-[8px] text-brand-gold/50 uppercase tracking-[0.55em] font-black">
                  Directorio Élite Digital
                </span>
              </div>
            </Link>

            {/* CENTER: Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { href: '/#mapa', icon: <MapPin size={11} />, label: 'Radar en Vivo' },
                { href: '/#collection', icon: <Sparkles size={11} />, label: 'Catálogo' },
              ].map(({ href, icon, label }) => (
                <Link key={href} href={href}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] text-white/35 hover:text-white font-black uppercase tracking-[0.3em] transition-all hover:bg-white/4"
                >
                  <span className="text-brand-gold/50 group-hover:text-brand-gold transition-colors">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>

            {/* RIGHT: CTA */}
            <div className="flex items-center gap-5 md:gap-8">
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-2.5 text-[10px] text-white/40 hover:text-white/80 uppercase tracking-[0.28em] font-black transition-all"
              >
                <User size={14} className="text-brand-gold/60" />
                Ingreso de Miembros
              </Link>

              <Link
                href="/registro"
                className="relative group overflow-hidden px-8 py-3.5 rounded-full font-black text-[9px] uppercase tracking-[0.35em] transition-all duration-400 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #D4B060 0%, #C9A84C 50%, #B8962A 100%)',
                  color: '#060608',
                  boxShadow: '0 0 30px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Diamond size={10} className="fill-current" />
                  Únete a la Élite
                </span>
                {/* Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-in-out" />
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl border border-white/6 flex flex-col items-center justify-center gap-1.5 text-white/40 hover:text-white hover:border-brand-gold/30 transition-all"
              >
                <span className={`w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <span className={`w-3.5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`w-5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-brand-black/95 backdrop-blur-[30px] border-t border-white/4 px-8 py-6 space-y-4">
            <Link href="/#mapa" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-[10px] text-white/40 hover:text-white uppercase tracking-[0.3em] font-black transition-colors">
              <MapPin size={13} className="text-brand-gold" /> Radar en Vivo
            </Link>
            <Link href="/#collection" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-[10px] text-white/40 hover:text-white uppercase tracking-[0.3em] font-black transition-colors">
              <Sparkles size={13} className="text-brand-gold" /> Catálogo
            </Link>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .border-brand-gold\\/8 { border-color: rgba(201,168,76,0.08); }
        .bg-white\\/4 { background: rgba(255,255,255,0.04); }
      `}</style>
    </>
  );
}
