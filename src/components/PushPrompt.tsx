"use client";

import React, { useState, useEffect } from "react";
import { 
  Download, 
  X, 
  ShieldCheck, 
  Sparkles, 
  CloudSun, 
  FileText, 
  Calculator, 
  Crown,
  Smartphone,
  Share,
  PlusSquare,
  Lock,
  Check
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PushPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisguise, setSelectedDisguise] = useState<'weather' | 'notes' | 'calc' | 'vip'>('weather');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream;
    setIsIOS(isIosDevice);

    // Listen for PWA install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show floating teaser after 4 seconds if not closed
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem("carinosas_pwa_dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setTimeout(() => setIsModalOpen(false), 2000);
      }
      setDeferredPrompt(null);
    }
  };

  const disguises = [
    { id: 'weather', name: 'Clima Ecuador', icon: CloudSun, color: 'text-sky-400', desc: 'Icono de pronóstico del tiempo' },
    { id: 'notes', name: 'Mis Notas Seguras', icon: FileText, color: 'text-amber-400', desc: 'Icono de libreta de apuntes' },
    { id: 'calc', name: 'Calc Pro', icon: Calculator, color: 'text-emerald-400', desc: 'Icono de calculadora financiera' },
    { id: 'vip', name: 'Cariñosas VIP', icon: Crown, color: 'text-brand-gold', desc: 'Icono original de lujo' },
  ] as const;

  return (
    <>
      {/* ── Discreet Corner Floating Button (Desktop) ── */}
      {isVisible && !isModalOpen && (
        <div className="hidden md:block fixed bottom-6 left-6 z-[50] animate-in slide-in-from-left-6 duration-500">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full glass-obsidian border border-[#D4AF37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)] hover:border-[#D4AF37] transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <Smartphone size={14} />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] block leading-none">App Secreta</span>
              <span className="text-[7px] text-white/50 uppercase tracking-widest font-bold">Modo Camuflaje</span>
            </div>
          </button>
        </div>
      )}

      {/* ── PWA Modal with Camouflage Selector ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-md glass-obsidian border border-brand-gold/40 rounded-[2.5rem] p-7 md:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95)] overflow-hidden">
            
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/15 rounded-full blur-[70px] pointer-events-none" />

            <button 
              onClick={() => { setIsModalOpen(false); setIsVisible(false); }}
              className="absolute top-6 right-6 w-9 h-9 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-xs"
            >
              ✕
            </button>

            <div className="text-center space-y-6">
              
              {/* Header Icon */}
              <div className="w-16 h-16 rounded-3xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center mx-auto text-brand-gold shadow-[0_0_30px_rgba(212,168,67,0.3)]">
                <Smartphone size={30} />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.3em] block">Discreción Absoluta</span>
                <h3 className="text-2xl font-serif text-white italic font-bold">Instalar App en tu Móvil</h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                  Guarda el acceso directo en tu pantalla de inicio con un icono y nombre que nadie sospechará.
                </p>
              </div>

              {/* Camouflage Selector */}
              <div className="space-y-2.5 text-left">
                <span className="text-[9px] text-white/40 uppercase font-black tracking-widest block ml-1">Selecciona el Camuflaje:</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {disguises.map(({ id, name, icon: Icon, color, desc }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedDisguise(id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                        selectedDisguise === id
                          ? 'border-brand-gold bg-brand-gold/15 shadow-[0_0_20px_rgba(212,168,67,0.2)]'
                          : 'border-white/10 glass-dark hover:border-white/20'
                      }`}
                    >
                      {selectedDisguise === id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-gold text-brand-black flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </div>
                      )}
                      <Icon size={18} className={`${color} mb-1.5`} />
                      <span className="text-[10px] font-bold text-white block">{name}</span>
                      <span className="text-[7px] text-white/40 uppercase tracking-tight block">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons based on OS */}
              <div className="space-y-3 pt-2">
                {isIOS ? (
                  <div className="p-4 rounded-2xl glass-dark border border-white/10 text-left space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-brand-gold font-bold">
                      <Share size={14} /> Paso 1: Toca el botón &quot;Compartir&quot; en Safari
                    </div>
                    <div className="flex items-center gap-2 text-white/80 font-medium">
                      <PlusSquare size={14} className="text-white" /> Paso 2: Selecciona &quot;Añadir a pantalla de inicio&quot;
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,168,67,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Instalar con Camuflaje Elegido
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 text-[8px] text-white/40 uppercase font-bold tracking-wider">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  100% Privado · Sin Rastro en el Historial
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
