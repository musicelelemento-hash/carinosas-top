"use client";

import React from "react";
import { Lock, ShieldAlert } from "lucide-react";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [passkey, setPasskey] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real staging app, this would be an env var
    if (passkey === "elite2026") {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-6">
      <div className="max-w-md w-full glass-premium rounded-[2.5rem] p-10 border-brand-gold/20 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto border border-brand-gold/20 text-brand-gold">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-[0.3em]">Acceso Maestro</h2>
          <p className="text-[10px] text-brand-white/40 uppercase tracking-[0.5em] font-black">Elite Protocol Alpha</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Ingresar Clave Maestra"
              className={`w-full bg-brand-black/40 border ${error ? 'border-brand-pink' : 'border-brand-gold/20'} rounded-2xl py-4 px-6 text-center text-brand-gold placeholder:text-brand-gold/20 outline-none focus:border-brand-gold/50 transition-all font-serif text-xl tracking-widest`}
              autoFocus
            />
            {error && (
              <div className="absolute -bottom-6 left-0 right-0 text-center animate-in fade-in slide-in-from-top-2">
                <span className="text-[8px] text-brand-pink font-black uppercase tracking-widest flex items-center justify-center gap-1">
                  <ShieldAlert size={10} /> Clave Incorrecta
                </span>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-gold text-brand-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-gold hover:scale-[1.02] active:scale-95 transition-all"
          >
            Desbloquear Portal
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-brand-gold/5 text-center">
            <p className="text-[8px] text-brand-white/20 uppercase tracking-[0.2em]">Cariñosas.top Admin Infrastructure</p>
        </div>
      </div>
    </div>
  );
}
