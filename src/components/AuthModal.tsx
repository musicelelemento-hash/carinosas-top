"use client";

import React, { useState } from "react";
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { EmailValidator } from "@/lib/emailValidator";
import { supabase } from "@/lib/supabase";
import { 
  signUpWithEmailAction, 
  signInWithEmailAction, 
  getGoogleOAuthUrlAction 
} from "@/app/actions/authAccount";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "login"
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [role, setRole] = useState<"client" | "model">("client");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Validation
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailError(null);
    setEmailSuggestion(null);

    if (val.includes("@") && val.includes(".")) {
      const res = EmailValidator.validate(val);
      if (!res.isValid) setEmailError(res.error || "Correo inválido");
      if (res.suggestion) setEmailSuggestion(res.suggestion);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setStatusMsg(null);
    try {
      const res = await getGoogleOAuthUrlAction(window.location.pathname);
      if (res.url) {
        window.location.href = res.url;
      } else {
        setStatusMsg({ text: res.error || "Error al conectar con Google.", isError: true });
        setIsGoogleLoading(false);
      }
    } catch {
      setStatusMsg({ text: "Error de conexión con Google.", isError: true });
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    try {
      if (tab === "register") {
        const emailValidation = EmailValidator.validate(email);
        if (!emailValidation.isValid) {
          setEmailError(emailValidation.error || "Correo inválido");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setStatusMsg({ text: "La contraseña debe tener mínimo 6 caracteres.", isError: true });
          setIsLoading(false);
          return;
        }

        const res = await signUpWithEmailAction(email, password, fullName, role);
        setIsLoading(false);

        if (res.success) {
          if (res.session) {
            try {
              await supabase.auth.setSession({
                access_token: res.session.access_token,
                refresh_token: res.session.refresh_token
              });
            } catch (authErr) {
              console.warn("Client setSession notice:", authErr);
            }
          }
          setStatusMsg({ text: res.message, isError: false });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1200);
        } else {
          setStatusMsg({ text: res.message, isError: true });
        }
      } else {
        // Login Flow
        const res = await signInWithEmailAction(email, password);
        setIsLoading(false);

        if (res.success) {
          if (res.session) {
            try {
              await supabase.auth.setSession({
                access_token: res.session.access_token,
                refresh_token: res.session.refresh_token
              });
            } catch (authErr) {
              console.warn("Client setSession notice:", authErr);
            }
          }
          setStatusMsg({ text: res.message, isError: false });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1000);
        } else {
          setStatusMsg({ text: res.message, isError: true });
        }
      }
    } catch {
      setIsLoading(false);
      setStatusMsg({ text: "Error de red al procesar la solicitud.", isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md glass-obsidian border border-brand-gold/40 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.95)] space-y-6 z-10 animate-in zoom-in-95 duration-300 max-h-[90dvh] overflow-y-auto custom-scrollbar pb-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Crown className="text-brand-gold" size={22} />
            <h3 className="text-xl font-serif text-white italic font-bold">Portal Élite Cariñosas.top</h3>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-dark border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── TABS: LOGIN vs REGISTER ── */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl glass-dark border border-white/10">
          <button
            type="button"
            onClick={() => { setTab("login"); setStatusMsg(null); }}
            className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              tab === "login"
                ? "bg-brand-gold text-brand-black shadow-md font-extrabold"
                : "text-white/50 hover:text-white"
            }`}
          >
            Iniciar Sesión
          </button>

          <button
            type="button"
            onClick={() => { setTab("register"); setStatusMsg(null); }}
            className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              tab === "register"
                ? "bg-brand-gold text-brand-black shadow-md font-extrabold"
                : "text-white/50 hover:text-white"
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* ── 1-CLICK GOOGLE SIGN IN BUTTON ── */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-3.5 px-4 rounded-2xl glass-dark border border-white/20 hover:border-brand-gold hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-lg group active:scale-98"
        >
          {isGoogleLoading ? (
            <Loader2 size={18} className="animate-spin text-brand-gold" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.36 7.36 24 12 24Z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15Z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.29 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
            </svg>
          )}
          <span className="text-xs font-bold text-white group-hover:text-brand-gold transition-colors">
            {tab === "register" ? "Registrarse con Google" : "Continuar con Google"}
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">o con tu correo</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ── EMAIL + PASSWORD FORM ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role selector on Register */}
          {tab === "register" && (
            <div className="space-y-1.5">
              <label className="block text-[9px] text-white/40 uppercase font-black tracking-wider">Tipo de Perfil</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    role === "client"
                      ? "border-brand-gold bg-brand-gold/15 text-brand-gold"
                      : "border-white/10 glass-dark text-white/50"
                  }`}
                >
                  🎩 Caballero VIP
                </button>
                <button
                  type="button"
                  onClick={() => setRole("model")}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    role === "model"
                      ? "border-brand-pink bg-brand-pink/15 text-brand-pink"
                      : "border-white/10 glass-dark text-white/50"
                  }`}
                >
                  👑 Modelo / Musa
                </button>
              </div>
            </div>
          )}

          {/* Full Name on Register */}
          {tab === "register" && (
            <div>
              <label className="block text-[10px] text-white/50 mb-1.5 uppercase tracking-wider font-bold">Nombre o Alias</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-3.5 text-white/40" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full glass-dark border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-white outline-none focus:border-brand-gold text-xs"
                  placeholder="Ej: Alexander V. / Valentina"
                />
              </div>
            </div>
          )}

          {/* Email Input with Live Typo & Disposable Blocker */}
          <div>
            <label className="block text-[10px] text-white/50 mb-1.5 uppercase tracking-wider font-bold">Correo Electrónico</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-3.5 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full glass-dark border rounded-2xl pl-11 pr-4 py-3 text-white outline-none text-xs transition-all ${
                  emailError ? "border-red-500/80 bg-red-500/5" : "border-white/15 focus:border-brand-gold"
                }`}
                placeholder="tu_correo@gmail.com"
              />
            </div>
            {emailError && (
              <span className="text-[10px] text-red-400 font-bold mt-1 block">⚠️ {emailError}</span>
            )}
            {emailSuggestion && (
              <span className="text-[10px] text-brand-gold font-bold mt-1 block">💡 {emailSuggestion}</span>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[10px] text-white/50 mb-1.5 uppercase tracking-wider font-bold">Contraseña</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-3.5 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-dark border border-white/15 rounded-2xl pl-11 pr-11 py-3 text-white outline-none focus:border-brand-gold text-xs"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div className={`p-3 rounded-xl text-center text-xs font-bold ${
              statusMsg.isError ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            }`}>
              {statusMsg.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.4)] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{tab === "register" ? "Crear Mi Cuenta" : "Acceder a Mi Cuenta"}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}
