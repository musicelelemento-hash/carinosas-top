"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Sparkles, MapPin, Diamond, Bot, ShieldCheck, Flame, Globe, Crown, Volume2, VolumeX } from "lucide-react";
import AuthModal from "./AuthModal";
import LiveCountBanner from "./LiveCountBanner";
import type { Country } from "@/lib/countries";
import { sound } from "@/lib/soundEngine";

interface NavbarProps {
  currentCountry?: Country;
  onChangeLocation?: () => void;
}

export default function Navbar({ currentCountry, onChangeLocation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [vipPass, setVipPass] = useState<string | null>(null);
  const [modelAuth, setModelAuth] = useState<string | null>(null);

  useEffect(() => {
    setIsMuted(sound.getMuted());

    const checkLogins = () => {
      try {
        const storedPass = localStorage.getItem("vip_pass_code") || localStorage.getItem("carinosas_vip_pass");
        const storedModel = localStorage.getItem("model_token") || localStorage.getItem("model_authenticated");
        setVipPass(storedPass);
        setModelAuth(storedModel);
      } catch {}
    };

    checkLogins();
    window.addEventListener("storage", checkLogins);
    window.addEventListener("vip_pass_updated", checkLogins);
    return () => {
      window.removeEventListener("storage", checkLogins);
      window.removeEventListener("vip_pass_updated", checkLogins);
    };
  }, []);

  const handleToggleSound = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      sound.playGoldChime();
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#08080C]/95 backdrop-blur-2xl border-b border-brand-gold/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        
        {/* Top Ticker Bar: NEVER overlaps with navbar logo */}
        <LiveCountBanner />

        {/* Main Navbar */}
        <nav className="w-full">

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
                  Red Élite Iberoamérica
                </span>
              </div>
            </Link>

            {/* CENTER: Navigation Links */}
            <div className="hidden lg:flex items-center gap-2">
              {[
                { href: '/radar', icon: <MapPin size={13} />, label: 'Geo-Radar' },
                { href: '/concierge', icon: <Bot size={13} className="text-brand-gold" />, label: 'Concierge VIP' },
                { href: '/boveda-secreta', icon: <Diamond size={13} className="text-brand-gold" />, label: 'Bóveda 4K' },
                { href: '/#collection', icon: <Sparkles size={13} />, label: 'Catálogo' },
              ].map(({ href, icon, label }) => (
                <Link key={href} href={href}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full text-[10px] text-white/70 hover:text-white font-black uppercase tracking-[0.2em] transition-all glass-obsidian border border-transparent hover:border-brand-gold/40 shadow-sm"
                >
                  <span className="text-brand-gold group-hover:scale-110 transition-transform">{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3 md:gap-5">

              {/* Sound Toggle Button */}
              <button
                onClick={handleToggleSound}
                className="w-9 h-9 rounded-full glass-obsidian border border-white/10 flex items-center justify-center text-brand-gold hover:border-brand-gold/50 transition-all hover:scale-105 active:scale-95 shadow-sm"
                title={isMuted ? "Activar audio de lujo" : "Silenciar efectos"}
              >
                {isMuted ? <VolumeX size={14} className="text-white/40" /> : <Volume2 size={14} className="text-brand-gold animate-pulse" />}
              </button>

              {/* Change Location / Country */}
              {onChangeLocation && (
                <button
                  onClick={onChangeLocation}
                  className="flex items-center gap-2 text-[9px] text-brand-gold hover:text-white uppercase tracking-widest font-bold transition-all px-3.5 py-1.5 rounded-full glass-obsidian border border-brand-gold/40 shadow-[0_0_15px_rgba(212,168,67,0.2)] hover:border-brand-gold"
                  title="Cambiar país o cantón"
                >
                  <span className="text-xs">{currentCountry?.flag || "🇪🇨"}</span>
                  <span className="truncate max-w-[90px] sm:max-w-none">{currentCountry?.name || "Ecuador"}</span>
                  <span className="text-white/30 text-[8px]">▼</span>
                </button>
              )}

              {/* Active Session Status or Login Trigger */}
              {vipPass ? (
                <Link
                  href="/boveda-secreta"
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/50 text-brand-gold text-[9px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(212,168,67,0.3)] animate-pulse"
                  title="Pase VIP Activo · Ir a Bóveda Secreta"
                >
                  <Crown size={12} className="fill-brand-gold" />
                  <span>Socio VIP Activo</span>
                </Link>
              ) : modelAuth ? (
                <Link
                  href="/panel-modelo"
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-pink/15 border border-brand-pink/50 text-brand-pink text-[9px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,110,0.3)]"
                  title="Ir a Mi Panel de Modelo"
                >
                  <Sparkles size={12} />
                  <span>Mi Estudio</span>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-obsidian border border-white/15 text-[#A1A1AA] hover:text-white hover:border-brand-gold/40 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  <User size={12} />
                  <span>Acceder</span>
                </button>
              )}

              {/* Publish Ad CTA (Desktop/Tablet) */}
              <Link
                href="/publicar-anuncio"
                className="hidden sm:flex relative group overflow-hidden px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-300 active:scale-95 shadow-[0_4px_25px_rgba(212,168,67,0.4)] bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black hover:brightness-110 items-center gap-2"
              >
                <Diamond size={12} className="fill-current" />
                <span>Publicar Anuncio VIP</span>
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
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass-obsidian border-t border-brand-gold/20 px-8 py-6 space-y-4 shadow-2xl">
            <Link href="/radar" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <MapPin size={14} className="text-brand-gold" /> Geo-Radar GPS en Vivo
            </Link>
            <Link href="/concierge" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/80 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <Bot size={14} className="text-brand-gold" /> Concierge VIP 24/7
            </Link>
            <Link href="/boveda-secreta" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/80 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <Diamond size={14} className="text-brand-gold" /> Bóveda Secreta 4K
            </Link>
            <Link href="/publicar-anuncio" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <Crown size={14} className="text-brand-gold" /> Publicar Anuncio VIP
            </Link>
            <Link href="/#collection" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/70 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <Sparkles size={14} className="text-brand-gold" /> Catálogo General
            </Link>
            
            {vipPass ? (
              <Link 
                href="/boveda-secreta"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left flex items-center gap-3 text-xs text-brand-gold uppercase tracking-widest font-bold pt-2 border-t border-white/5"
              >
                <Crown size={14} /> Socio VIP Activo ({vipPass})
              </Link>
            ) : modelAuth ? (
              <Link 
                href="/panel-modelo"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left flex items-center gap-3 text-xs text-brand-pink uppercase tracking-widest font-bold pt-2 border-t border-white/5"
              >
                <Sparkles size={14} /> Panel Estudio de Modelo
              </Link>
            ) : (
              <button 
                onClick={() => { setMenuOpen(false); setIsAuthOpen(true); }} 
                className="w-full text-left flex items-center gap-3 text-xs text-white/50 hover:text-white uppercase tracking-widest font-bold transition-colors pt-2 border-t border-white/5 cursor-pointer"
              >
                <User size={14} /> Iniciar Sesión / Mi Cuenta
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>

    <AuthModal
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
    />
  </>
  );
}
