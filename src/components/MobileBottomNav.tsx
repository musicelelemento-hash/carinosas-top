"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Home, 
  Compass, 
  Sparkles, 
  Crown, 
  UserPlus
} from "lucide-react";

export default function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [vipPass, setVipPass] = useState<string | null>(null);
  const [modelAuth, setModelAuth] = useState<string | null>(null);

  useEffect(() => {
    const checkSessions = () => {
      try {
        const storedPass = localStorage.getItem("vip_pass_code") || localStorage.getItem("carinosas_vip_pass");
        const storedModel = localStorage.getItem("model_token") || localStorage.getItem("model_authenticated");
        setVipPass(storedPass);
        setModelAuth(storedModel);
      } catch {}
    };

    checkSessions();
    window.addEventListener("storage", checkSessions);
    window.addEventListener("vip_pass_updated", checkSessions);
    return () => {
      window.removeEventListener("storage", checkSessions);
      window.removeEventListener("vip_pass_updated", checkSessions);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleHaptic = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Silent catch for browsers without vibration permissions
      }
    }
  };

  const navItems = [
    { id: "home", label: "Catálogo", icon: Home, href: "/#collection" },
    { id: "radar", label: "Radar GPS", icon: Compass, href: "/#mapa" },
    { id: "ai", label: "Concierge", icon: Sparkles, href: "/#ai-assistant", isAi: true },
    { 
      id: "vip", 
      label: vipPass ? "Socio VIP" : "Club VIP", 
      icon: Crown, 
      href: vipPass ? "/boveda-secreta" : "/#vip-lounge",
      isHighlighted: Boolean(vipPass)
    },
    { 
      id: "registro", 
      label: modelAuth ? "Mi Estudio" : "Publicar", 
      icon: UserPlus, 
      href: modelAuth ? "/panel-modelo" : "/publicar-anuncio" 
    },
  ];

  return (
    <div 
      className={`md:hidden fixed bottom-0 inset-x-0 z-[60] transition-all duration-500 pointer-events-none ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 16px))",
      }}
    >
      <div className="max-w-md mx-auto px-4 pointer-events-auto">
        <nav
          className="rounded-[28px] px-3 py-2.5 shadow-[0_15px_50px_rgba(0,0,0,0.95)] flex items-center justify-between border border-[#D4AF37]/35"
          style={{
            background: "rgba(12, 12, 18, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {navItems.map(({ id, label, icon: Icon, href, isAi }) => {
            const isActive = activeTab === id;

            if (isAi) {
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    handleHaptic(id);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-ai-concierge"));
                    }
                  }}
                  className="flex flex-col items-center justify-center -mt-5 relative group cursor-pointer outline-none"
                  aria-label="Abrir Asistente Concierge VIP"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF1C2] to-[#D4AF37] p-[2px] shadow-[0_0_25px_rgba(212,168,67,0.5)] group-active:scale-95 transition-transform">
                    <div className="w-full h-full bg-[#08080C] rounded-full flex items-center justify-center text-[#D4AF37]">
                      <Sparkles size={20} className="animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] mt-1">
                    {label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={id}
                href={href}
                onClick={() => handleHaptic(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl transition-all ${
                  isActive ? "text-[#D4AF37] scale-105" : "text-white/40 hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "text-[#D4AF37]" : "text-white/40"} />
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isActive ? "text-[#D4AF37]" : "text-white/40"
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
