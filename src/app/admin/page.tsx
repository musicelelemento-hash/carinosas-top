"use client";

import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminQuickUpload from "@/components/AdminQuickUpload";
import AdminModelList from "@/components/AdminModelList";
import AdminPaymentSettings from "@/components/AdminPaymentSettings";
import AdminGentlemenPasses from "@/components/AdminGentlemenPasses";
import AdminDashboardHUD from "@/components/AdminDashboardHUD";
import AdminStoriesManager from "@/components/AdminStoriesManager";
import AdminSecurityLogs from "@/components/AdminSecurityLogs";
import { 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Loader2, 
  CreditCard, 
  Gift, 
  Film, 
  ShieldCheck 
} from "lucide-react";
import { checkAdminSessionAction, logoutAdminAction } from "@/app/actions/admin";
import { sound } from "@/lib/soundEngine";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<'catalog' | 'upload' | 'stories' | 'passes' | 'payments' | 'security'>('catalog');

  useEffect(() => {
    async function checkSession() {
      const active = await checkAdminSessionAction();
      setIsAdmin(active);
      setCheckingSession(false);
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    sound.playSubtleClick();
    await logoutAdminAction();
    setIsAdmin(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="text-brand-gold animate-spin" />
        <p className="text-[10px] text-brand-gold/40 uppercase font-black tracking-[0.5em]">Verificando Credenciales...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => setIsAdmin(true)} />;
  }

  const TABS: { id: 'catalog' | 'upload' | 'stories' | 'passes' | 'payments' | 'security'; label: string; icon: React.ReactNode }[] = [
    { id: 'catalog', label: 'Flota de Modelos', icon: <Users size={15} /> },
    { id: 'upload', label: 'Publicación Express', icon: <PlusCircle size={15} /> },
    { id: 'stories', label: 'Historias 4K & Reels', icon: <Film size={15} /> },
    { id: 'passes', label: 'Pases VIP Caballeros', icon: <Gift size={15} /> },
    { id: 'payments', label: 'Métodos de Pago & Billeteras', icon: <CreditCard size={15} /> },
    { id: 'security', label: 'Auditoría & Seguridad', icon: <ShieldCheck size={15} /> },
  ];

  return (
    <main className="min-h-screen bg-[#08080C] text-white pt-24 pb-28 md:pb-12">
      
      {/* ── TOP NAV CONSOLE ── */}
      <nav className="fixed top-0 w-full z-[60] glass-obsidian border-b border-brand-gold/20 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
             <div className="w-10 h-10 bg-gradient-to-br from-[#D4A843] via-[#FFE088] to-[#AA7C11] rounded-2xl flex items-center justify-center text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.35)]">
                <LayoutDashboard size={20} />
             </div>
             <div className="flex flex-col">
                <span className="font-serif text-brand-gold uppercase tracking-[0.2em] text-sm leading-none font-bold">Torre de Control</span>
                <span className="text-[8px] text-[#A1A1AA] uppercase tracking-[0.3em] font-mono mt-1">Nivel: Master CEO / Dueño</span>
             </div>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-2xl">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playSubtleClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id 
                  ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' 
                  : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] text-[#A1A1AA] uppercase font-black hover:text-rose-400 transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-rose-500/10 transition-colors">
              <LogOut size={14} />
            </div>
            <span className="hidden sm:inline">Desconectar</span>
          </button>
        </div>

        {/* Mobile / Tablet Sub-tabs */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto no-scrollbar px-4 py-2 border-t border-white/5 bg-[#0a0a0f]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playSubtleClick();
                setActiveTab(tab.id);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === tab.id 
                ? 'bg-brand-gold text-brand-black shadow-md' 
                : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-8">
        
        {/* Master Executive HUD */}
        <AdminDashboardHUD onSelectTab={(t) => setActiveTab(t as any)} />

        {/* Active Tab View */}
        <div className="pt-2">
          {activeTab === 'upload' && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
              <AdminQuickUpload />
            </div>
          )}
          {activeTab === 'catalog' && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
              <AdminModelList />
            </div>
          )}
          {activeTab === 'stories' && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
              <AdminStoriesManager />
            </div>
          )}
          {activeTab === 'passes' && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
              <AdminGentlemenPasses />
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
              <AdminPaymentSettings />
            </div>
          )}
          {activeTab === 'security' && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
              <AdminSecurityLogs />
            </div>
          )}
        </div>

      </div>

      {/* Floating GPS & Sync Badge */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
        <div className="glass-obsidian border border-brand-gold/40 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[9px] text-brand-gold uppercase font-mono font-bold tracking-widest">
            Soberano · 100% Cripto
          </span>
        </div>
      </div>

    </main>
  );
}
