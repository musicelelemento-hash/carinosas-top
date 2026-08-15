"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Home, 
  Compass, 
  Sparkles, 
  Crown, 
  Flame, 
  UserPlus,
  ShieldCheck,
  MessageCircle
} from "lucide-react";

export default function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Keep visible or subtle hide on fast down-scroll
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(true); // Always keep available for one-thumb reach
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
        navigator.vibrate(15); // Subtle tactile haptic tick on mobile
      } catch {
        // Silent catch for browsers without vibration permissions
      }
    }
  };

  const navItems = [
    { id: "home", label: "Catálogo", icon: Home, href: "/#collection" },
    { id: "radar", label: "Radar GPS", icon: Compass, href: "/#mapa" },
    { id: "ai", label: "Concierge", icon: Sparkles, href: "/#ai-assistant", isAi: true },
    { id: "vip", label: "Club VIP", icon: Crown, href: "/#vip-lounge" },
    { id: "registro", label: "Publicar", icon: UserPlus, href: "/registro" },
  ];

  return (
    <div 
      className={`md:hidden fixed bottom-0 inset-x-0 z-[140] transition-all duration-500 pb-[env(safe-area-inset-bottom,16px)] pointer-events-none ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className="max-w-md mx-auto px-4 pb-2 pointer-events-auto">
        <nav className="glass-obsidian border border-brand-gold/40 rounded-full px-3 py-2 shadow-[0_15px_50px_rgba(0,0,0,0.95)] flex items-center justify-between backdrop-blur-2xl">
          {navItems.map(({ id, label, icon: Icon, href, isAi }) => {
            const isActive = activeTab === id;

            if (isAi) {
              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => handleHaptic(id)}
                  className="flex flex-col items-center justify-center -mt-5 relative group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-gold via-white to-brand-gold p-[2px] shadow-[0_0_25px_rgba(212,168,67,0.6)] group-active:scale-95 transition-transform">
                    <div className="w-full h-full bg-[#08080C] rounded-full flex items-center justify-center text-brand-gold">
                      <Sparkles size={20} className="animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-gold mt-1">
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={id}
                href={href}
                onClick={() => handleHaptic(id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
                  isActive ? "text-brand-gold scale-105" : "text-white/40 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-brand-gold" : "text-white/40"} />
                <span className={`text-[8px] font-bold uppercase tracking-wider mt-1 ${
                  isActive ? "text-brand-gold font-black" : "text-white/40"
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
