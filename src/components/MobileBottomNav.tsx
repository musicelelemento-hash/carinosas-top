"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Radar, Play, MessageCircle, User, Sparkles } from "lucide-react";

export default function MobileBottomNav() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [modelAuth, setModelAuth] = useState<string | null>(null);

  useEffect(() => {
    const checkSessions = () => {
      try {
        setModelAuth(localStorage.getItem("model_token") || localStorage.getItem("model_authenticated"));
      } catch {}
    };
    checkSessions();
    window.addEventListener("storage", checkSessions);
    return () => window.removeEventListener("storage", checkSessions);
  }, []);

  const haptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(15); } catch {}
    }
  };

  const navItems: { id: string; label: string; icon: typeof Home; onClick: () => void }[] = [
    {
      id: "home", label: "Inicio", icon: Home, onClick: () => {
        document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "radar", label: "Radar", icon: Radar, onClick: () => {
        router.push("/radar");
      },
    },
    {
      id: "reels", label: "Reels", icon: Play, onClick: () => {
        window.dispatchEvent(new CustomEvent("open-reels-feed"));
      },
    },
    {
      id: "chats", label: "Chats", icon: MessageCircle, onClick: () => {
        router.push("/chats");
      },
    },
    {
      id: "tu", label: "Tú", icon: User, onClick: () => {
        router.push(modelAuth ? "/panel-modelo" : "/cuenta");
      },
    },
  ];

  return (
    <>
      <div
        className="md:hidden mobile-bottom-nav"
      >
        {navItems.map(({ id, label, icon: Icon, onClick }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => { setActiveTab(id); haptic(); onClick(); }}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={22} className="nav-icon" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* FAB Concierge IA — fuera del bottom nav */}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-ai-concierge"))}
        className="md:hidden fixed z-[61] w-12 h-12 rounded-full flex items-center justify-center btn-gold-premium text-[12px] font-black"
        style={{
          right: 16,
          bottom: "calc(96px + env(safe-area-inset-bottom, 16px))",
        }}
        aria-label="Abrir Concierge IA"
      >
        <Sparkles size={20} className="text-[#08080B]" />
      </button>
    </>
  );
}
