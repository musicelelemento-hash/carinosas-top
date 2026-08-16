"use client";

import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminQuickUpload from "@/components/AdminQuickUpload";
import AdminModelList from "@/components/AdminModelList";
import AdminPaymentSettings from "@/components/AdminPaymentSettings";
import AdminGentlemenPasses from "@/components/AdminGentlemenPasses";
import { LogOut, LayoutDashboard, PlusCircle, Users, Loader2, CreditCard, Gift } from "lucide-react";
import { checkAdminSessionAction, logoutAdminAction } from "@/app/actions/admin";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<'catalog' | 'upload' | 'passes' | 'payments'>('catalog');

  useEffect(() => {
    async function checkSession() {
      const active = await checkAdminSessionAction();
      setIsAdmin(active);
      setCheckingSession(false);
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
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

  const TABS: { id: 'catalog' | 'upload' | 'passes' | 'payments'; label: string; icon: React.ReactNode }[] = [
    { id: 'catalog', label: 'Flota de Modelos', icon: <Users size={16} /> },
    { id: 'upload', label: 'Publicación Express', icon: <PlusCircle size={16} /> },
    { id: 'passes', label: 'Pases VIP Caballeros', icon: <Gift size={16} /> },
    { id: 'payments', label: 'Métodos de Pago & Billeteras', icon: <CreditCard size={16} /> },
  ];

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-12">
      <nav className="fixed top-0 w-full z-[60] glass-premium border-b border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand-black shadow-lg shadow-brand-gold/20">
                <LayoutDashboard size={20} />
             </div>
             <div className="flex flex-col">
                <span className="font-serif text-brand-gold uppercase tracking-[0.2em] text-sm leading-none">Torre de Control</span>
                <span className="text-[8px] text-brand-white/30 uppercase tracking-[0.3em] font-black mt-1">Nivel: Master CEO / Dueño</span>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 p-1 bg-brand-black/40 border border-white/5 rounded-2xl">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-brand-gold text-brand-black shadow-lg' 
                  : 'text-brand-white/40 hover:text-brand-gold'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] text-brand-white/30 uppercase font-black hover:text-brand-pink transition-colors group"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-brand-pink/10 transition-colors">
              <LogOut size={14} />
            </div>
            <span className="hidden sm:inline">Desconectar</span>
          </button>
        </div>

        {/* Mobile Sub-tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto no-scrollbar px-4 py-2 border-t border-white/5 bg-[#08080C]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id 
                ? 'bg-brand-gold text-brand-black' 
                : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mt-8">
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
      </div>

      {/* Floating Alerts Area for Admin */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
        <div className="glass-premium border-brand-pink/20 px-6 py-4 rounded-2xl flex items-center gap-4 animate-bounce pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest">Sincronización GPS: Activa</span>
        </div>
      </div>
    </main>
  );
}
