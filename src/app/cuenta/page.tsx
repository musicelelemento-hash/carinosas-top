"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  CalendarClock, 
  BarChart3, 
  ShieldQuestion, 
  ChevronRight, 
  Crown, 
  Sparkles, 
  LogOut, 
  AlertTriangle,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { sound } from "@/lib/soundEngine";
import PrivacyModal from "@/components/PrivacyModal";

export default function CuentaPage() {
  const router = useRouter();
  const [vipPass, setVipPass] = useState<string | null>(null);
  const [modelAuth, setModelAuth] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    try {
      const storedPass = localStorage.getItem("vip_pass_code") || localStorage.getItem("carinosas_vip_pass");
      const storedModel = localStorage.getItem("model_token") || localStorage.getItem("model_authenticated");
      const storedModelName = localStorage.getItem("model_name");
      setVipPass(storedPass);
      setModelAuth(storedModel);
      setModelName(storedModelName);
    } catch {}
  }, []);

  const handleLogout = () => {
    sound.playSubtleClick();
    try {
      localStorage.removeItem("vip_pass_code");
      localStorage.removeItem("carinosas_vip_pass");
      localStorage.removeItem("model_token");
      localStorage.removeItem("model_authenticated");
      localStorage.removeItem("model_name");
      window.dispatchEvent(new CustomEvent("vip_pass_updated"));
      window.dispatchEvent(new CustomEvent("model_session_updated"));
    } catch {}
    router.push("/");
  };

  const handleClearCache = () => {
    sound.playGoldChime();
    try {
      localStorage.clear();
      sessionStorage.clear();
      setCacheCleared(true);
      setTimeout(() => {
        setCacheCleared(false);
        router.push("/");
      }, 1200);
    } catch {}
  };

  const isVIP = Boolean(vipPass);
  const isModel = Boolean(modelAuth);

  const rows = [
    { label: "Bóveda Secreta 4K", icon: Lock, onClick: () => router.push("/boveda-secreta"), badge: isVIP ? "Desbloqueada" : "VIP" },
    { label: "Mi Agenda & Mensajes", icon: CalendarClock, onClick: () => router.push("/chats") },
    { 
      label: isModel ? "Estudio & Métricas de Modelo" : "Métricas del Directorio", 
      icon: BarChart3, 
      onClick: () => router.push(isModel ? "/panel-modelo" : "/radar") 
    },
    { 
      label: "Políticas de Privacidad & Discreción", 
      icon: ShieldQuestion, 
      onClick: () => setIsPrivacyOpen(true) 
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080B] text-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-serif font-bold text-xl text-white">Mi Cuenta</h1>
        </div>

        <button
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "https://www.google.com";
          }}
          className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
        >
          <AlertTriangle size={11} />
          <span>Pánico</span>
        </button>
      </div>

      <div className="px-5 space-y-5 pt-4 max-w-lg mx-auto">
        
        {/* Tarjeta de cuenta */}
        <div className="flex items-center gap-3.5 rounded-3xl p-5 glass-obsidian border border-brand-gold/30 shadow-xl">
          <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-brand-gold via-[#FFE088] to-brand-gold p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-[#101014] flex items-center justify-center font-serif font-bold text-xl text-brand-gold">
              {isModel ? (modelName ? modelName[0].toUpperCase() : "M") : isVIP ? "VIP" : "T"}
            </div>
          </div>

          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-white truncate">
                {isModel ? (modelName || "Musa Exclusiva") : isVIP ? "Caballero VIP" : "Socio Invitado"}
              </span>
              {isVIP && <Crown size={14} className="text-brand-gold fill-brand-gold shrink-0" />}
              {isModel && <Sparkles size={14} className="text-brand-pink shrink-0" />}
            </div>

            <span className="block font-mono text-[11px] text-brand-gold/90 font-bold">
              {isVIP ? `Membresía Activa (${vipPass})` : isModel ? "Estudio de Modelo Activo" : "Plan Explorador Gratuito"}
            </span>
          </div>
        </div>

        {/* CTA verificación 4K */}
        {!isVIP && !isModel && (
          <Link
            href="/verificacion"
            className="block rounded-2xl p-4 space-y-1 bg-brand-gold/10 border border-brand-gold/40 hover:bg-brand-gold/15 transition-all shadow-md"
          >
            <div className="flex items-center gap-2 text-brand-gold">
              <ShieldCheck size={18} />
              <span className="text-[14px] font-bold">Verificación 4K Biométrica</span>
            </div>
            <p className="text-[12px] text-white/70">Activa tu sello de autenticidad en el catálogo nacional.</p>
          </Link>
        )}

        {/* Filas interactivas */}
        <div className="rounded-2xl overflow-hidden glass-dark border border-white/[0.08]">
          {rows.map(({ label, icon: Icon, onClick, badge }, i) => (
            <button
              key={label}
              onClick={onClick}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
              style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,.07)" : undefined }}
            >
              <Icon size={18} className="text-brand-gold shrink-0" />
              <span className="flex-1 text-[14px] font-semibold text-white">{label}</span>
              {badge && (
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40 mr-1">
                  {badge}
                </span>
              )}
              <ChevronRight size={18} className="text-white/35 shrink-0" />
            </button>
          ))}
        </div>

        {/* Acciones de Seguridad y Salida */}
        <div className="pt-3 space-y-3">
          <button
            onClick={handleClearCache}
            className="w-full py-3.5 px-4 rounded-2xl glass-dark border border-white/10 hover:border-brand-gold/40 text-xs font-bold text-white/70 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 size={14} className="text-brand-gold" />
            <span>{cacheCleared ? "✓ Rastro local borrado" : "Limpiar historial y rastro local"}</span>
          </button>

          {(isVIP || isModel) && (
            <button
              onClick={handleLogout}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-xs font-bold text-rose-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Cerrar Sesión / Desconectar</span>
            </button>
          )}
        </div>

      </div>

      <PrivacyModal isOpen={isPrivacyOpen} onAccept={() => setIsPrivacyOpen(false)} />
    </div>
  );
}
