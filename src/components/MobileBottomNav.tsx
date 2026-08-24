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
        className="md:hidden fixed bottom-0 inset-x-0 z-[60] flex items-start px-2"
        style={{
          minHeight: 82,
          paddingTop: 12,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          background: "rgba(10,10,13,.96)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        {navItems.map(({ id, label, icon: Icon, onClick }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => { setActiveTab(id); haptic(); onClick(); }}
              className="flex-1 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
              style={{ minHeight: 44 }}
            >
              <Icon size={20} color={isActive ? "#D4A843" : "rgba(240,240,236,.4)"} />
              <span className="text-[11px] font-semibold" style={{ color: isActive ? "#D4A843" : "rgba(240,240,236,.4)" }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAB Concierge IA — fuera del bottom nav, para que el nav quede idéntico al mockup */}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-ai-concierge"))}
        className="md:hidden fixed z-[61] w-12 h-12 rounded-full flex items-center justify-center bg-brand-gold"
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
