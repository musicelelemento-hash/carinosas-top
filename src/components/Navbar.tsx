"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Sparkles, MapPin, Diamond, Bot, Search, ChevronDown, Globe, Crown, Volume2, VolumeX } from "lucide-react";
import AuthModal from "./AuthModal";
import LiveCountBanner from "./LiveCountBanner";
import type { Country } from "@/lib/countries";
import { sound } from "@/lib/soundEngine";

interface NavbarProps {
  currentCountry?: Country;
  onChangeLocation?: () => void;
  onSearch?: (term: string) => void;
}

export default function Navbar({ currentCountry, onChangeLocation, onSearch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [vipPass, setVipPass] = useState<string | null>(null);
  const [modelAuth, setModelAuth] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

    const openAuth = () => setIsAuthOpen(true);
    window.addEventListener("open-auth-modal", openAuth);
    return () => {
      window.removeEventListener("storage", checkLogins);
      window.removeEventListener("vip_pass_updated", checkLogins);
      window.removeEventListener("open-auth-modal", openAuth);
    };
  }, []);

  const handleToggleSound = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      sound.playGoldChime();
    }
  };

  const submitSearch = () => {
    if (searchTerm.trim()) {
      onSearch?.(searchTerm.trim());
    }
    const el = document.getElementById("collection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#0C0C10] border-b border-white/[0.07]">
        <div className="lg:hidden">
          <LiveCountBanner />
        </div>

        {/* ── DESKTOP "TERMINAL" HEADER — 64px, calcado del mockup 1a ── */}
        <nav className="hidden lg:flex items-center h-16 px-6 gap-7">
          <Link href="/" className="flex items-baseline shrink-0">
            <span className="font-serif font-bold text-[22px] tracking-[0.04em] leading-none text-brand-gold">
              CARIÑOSAS
            </span>
            <span className="font-serif font-bold text-[22px] tracking-[0.04em] leading-none text-white">
              .TOP
            </span>
          </Link>

          {onChangeLocation ? (
            <button
              onClick={onChangeLocation}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.07] text-white hover:border-brand-gold/40 transition-colors shrink-0 cursor-pointer"
              title="Cambiar país o cantón"
            >
              <MapPin size={14} className="text-brand-gold" />
              <span className="text-[13px] font-semibold">{currentCountry?.name || "Ecuador"}</span>
              <ChevronDown size={14} className="text-white/40" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.07] shrink-0">
              <MapPin size={14} className="text-brand-gold" />
              <span className="text-[13px] font-semibold text-white">Machala · El Oro</span>
            </div>
          )}

          {/* Search pill — centrada */}
          <div className="flex items-center gap-2.5 flex-1 max-w-[420px] mx-8 px-3.5 py-2.5 rounded-[10px] bg-white/[0.04] border border-white/[0.08]">
            <Search size={15} className="text-white/35 shrink-0" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Buscar por nombre, sector o ciudad"
              className="flex-1 bg-transparent outline-none border-none text-[13px] text-white placeholder:text-white/35"
            />
            <span className="ml-auto font-mono text-[11px] text-white/[0.28] border border-white/10 rounded-[5px] px-1.5 py-px shrink-0">/</span>
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <button
              onClick={handleToggleSound}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-brand-gold transition-colors"
              title={isMuted ? "Activar audio" : "Silenciar efectos"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-brand-gold" />}
            </button>

            {vipPass ? (
              <Link href="/boveda-secreta" className="flex items-center gap-1.5 text-brand-gold text-[13px] font-semibold">
                <Crown size={13} className="fill-brand-gold" />
                Socio VIP
              </Link>
            ) : modelAuth ? (
              <Link href="/panel-modelo" className="flex items-center gap-1.5 text-brand-pink text-[13px] font-semibold">
                <Sparkles size={13} />
                Mi Estudio
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-[13px] font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Acceder
              </button>
            )}

            <Link
              href="/publicar-anuncio"
              className="px-[18px] py-2.5 rounded-[10px] bg-brand-gold text-brand-black text-[13px] font-bold hover:brightness-110 transition-all"
            >
              Publicar anuncio
            </Link>
          </div>
        </nav>

        {/* ── MOBILE HEADER — logo compacto + ubicación + búsqueda + menú ── */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 gap-3">
          <Link href="/" className="flex items-baseline shrink-0">
            <span className="font-serif font-bold text-[21px] leading-none text-brand-gold">CARIÑOSAS</span>
            <span className="font-serif font-bold text-[21px] leading-none text-white">.TOP</span>
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onChangeLocation}
              className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-white/5 border border-white/[0.08] text-white shrink-0"
            >
              <MapPin size={15} className="text-brand-gold" />
              <span className="text-[13px] font-semibold">{currentCountry?.name || "Machala"}</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("search-box-hero");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-white shrink-0"
            >
              <Search size={17} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.08] flex flex-col items-center justify-center gap-1.5 text-white shrink-0"
            >
              <span className={`w-4 h-[1.5px] bg-brand-gold rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
              <span className={`w-3 h-[1.5px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-4 h-[1.5px] bg-brand-gold rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown — solo lo que no cubre el bottom nav */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-[#0C0C10] border-t border-white/[0.07] px-6 py-5 space-y-4">
            <Link href="/concierge" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/80 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <Bot size={14} className="text-brand-gold" /> Concierge VIP 24/7
            </Link>
            <Link href="/boveda-secreta" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xs text-white/80 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
              <Diamond size={14} className="text-brand-gold" /> Bóveda Secreta 4K
            </Link>
            <button
              onClick={handleToggleSound}
              className="flex items-center gap-3 text-xs text-white/60 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-brand-gold" />}
              {isMuted ? "Activar audio" : "Silenciar efectos"}
            </button>
            {onChangeLocation && (
              <button
                onClick={() => { setMenuOpen(false); onChangeLocation(); }}
                className="flex items-center gap-3 text-xs text-brand-gold uppercase tracking-widest font-bold transition-colors cursor-pointer"
              >
                <Globe size={14} /> Cambiar país ({currentCountry?.name || "Ecuador"})
              </button>
            )}

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
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}
