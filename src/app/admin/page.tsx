"use client";

import React, { useState } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminQuickUpload from "@/components/AdminQuickUpload";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => setIsAdmin(true)} />;
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-12">
      <nav className="fixed top-0 w-full z-[60] glass-premium border-b border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center text-brand-black">
                <LayoutDashboard size={18} />
             </div>
             <span className="font-serif text-brand-gold uppercase tracking-widest text-sm">Panel Maestro</span>
          </div>
          <button 
            onClick={() => setIsAdmin(false)}
            className="flex items-center gap-2 text-[10px] text-brand-white/40 uppercase font-black hover:text-brand-pink transition-colors"
          >
            <LogOut size={14} /> Salir Segure
          </button>
        </div>
      </nav>

      <AdminQuickUpload />
    </main>
  );
}
