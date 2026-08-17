"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert, Eye, EyeOff, Loader2, Crown, ShieldCheck } from "lucide-react";
import { loginAdminAction } from "@/app/actions/admin";
import { sound } from "@/lib/soundEngine";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [passkey, setPasskey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginAdminAction(passkey);
      if (res.success) {
        sound.playGoldChime();
        onSuccess();
      } else {
        sound.playSubtleClick();
        setErrorMsg(res.error || "Clave de acceso incorrecta.");
      }
    } catch {
      setErrorMsg("Error de conexión al verificar credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080C] px-4 sm:px-6 noise-overlay">
      <div className="max-w-md w-full glass-obsidian rounded-[2.5rem] p-8 sm:p-10 border border-brand-gold/30 shadow-[0_25px_90px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
        
        {/* Ambient Gold Aura */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4A843]/20 via-[#FFE088]/10 to-[#AA7C11]/20 rounded-3xl flex items-center justify-center mx-auto border border-brand-gold/40 text-brand-gold shadow-[0_0_30px_rgba(212,168,67,0.3)]">
            <Lock size={28} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[9px] font-black uppercase tracking-widest">
            <Crown size={11} />
            <span>Consola de Dueño & CEO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold tracking-tight">Acceso Maestro</h2>
          <p className="text-[10px] text-[#A1A1AA] uppercase tracking-[0.35em] font-mono">Elite Protocol Alpha 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"}
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Ingresar Clave Maestra"
                disabled={isLoading}
                className={`w-full bg-black/50 border ${errorMsg ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'border-brand-gold/30 focus:border-brand-gold'} rounded-2xl py-4 pl-6 pr-14 text-center text-brand-gold placeholder:text-brand-gold/30 outline-none transition-all font-mono text-base tracking-widest disabled:opacity-50`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 p-2 text-[#A1A1AA] hover:text-brand-gold transition-colors cursor-pointer"
                title={showPassword ? "Ocultar clave" : "Mostrar clave"}
                aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center animate-in fade-in slide-in-from-top-1">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <ShieldAlert size={12} className="shrink-0" />
                  <span>{errorMsg}</span>
                </span>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading || !passkey.trim()}
            className="w-full bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_25px_rgba(212,168,67,0.35)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verificando Acceso...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Desbloquear Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10 space-y-1">
          <p className="text-[9px] text-[#A1A1AA] uppercase tracking-widest font-mono">
            Protección Criptográfica · Rate Limiting Activo
          </p>
          <p className="text-[8px] text-white/30">Cariñosas.top Sovereign Infrastructure</p>
        </div>
      </div>
    </div>
  );
}
