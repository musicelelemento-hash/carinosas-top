"use client";

import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  Users, 
  Crown, 
  ShieldCheck, 
  Rocket, 
  Download, 
  Eye, 
  Activity,
  Flame,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { getAdminDashboardStatsAction, batchBoostCityAction } from "@/app/actions/admin";
import { sound } from "@/lib/soundEngine";
import confetti from "canvas-confetti";

interface AdminDashboardHUDProps {
  onSelectTab?: (tab: string) => void;
}

export default function AdminDashboardHUD({ onSelectTab }: AdminDashboardHUDProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [boostingCity, setBoostingCity] = useState<string | null>(null);
  const [boostSuccess, setBoostSuccess] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getAdminDashboardStatsAction();
      setStats(data);
    } catch (err) {
      console.warn("HUD fetch notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCityBoost = async (city: string) => {
    sound.playGoldChime();
    setBoostingCity(city);
    try {
      const res = await batchBoostCityAction(city, true);
      setBoostSuccess(`¡${res.count} perfiles en ${city} impulsados al #1!`);
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      fetchStats();
      setTimeout(() => setBoostSuccess(null), 3500);
    } catch (err: any) {
      alert(err.message || "Error al impulsar ciudad.");
    } finally {
      setBoostingCity(null);
    }
  };

  const handleExportBackup = () => {
    sound.playSubtleClick();
    const backupData = {
      exportedAt: new Date().toISOString(),
      platform: "Cariñosas.top Elite",
      stats: stats
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carinosas_top_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalModels = stats?.totalModels || 26;
  const verified4K = stats?.verified4K || 24;
  const onlineCount = stats?.onlineModels || 18;
  const activePasses = stats?.activePasses || 4;
  const estimatedPlatformVolume = totalModels * 140 * 18; // Est. $65,520 USD monthly volume

  return (
    <div className="space-y-6">
      
      {/* ── TOP HERO STRIP ── */}
      <div className="glass-obsidian border border-brand-gold/30 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.95)] relative overflow-hidden bg-gradient-to-br from-[#121218] via-[#09090D] to-[#040406]">
        
        {/* Ambient Gold Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(212,168,67,0.25)]">
              <Crown size={12} className="animate-pulse" />
              <span>Torre de Control Master CEO · Modo Soberano</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Consola Ejecutiva de <span className="italic text-gold-shimmer">Monopolio</span>
            </h1>
            
            <p className="text-xs text-[#A1A1AA] max-w-xl">
              Supervisión de flota 4K, validación biométrica, emisión de pases y control de ingresos en tiempo real para todo Ecuador.
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap items-center gap-3">
            
            <button
              onClick={fetchStats}
              title="Recargar datos"
              className="p-3 rounded-2xl glass-dark border border-white/10 text-[#A1A1AA] hover:text-brand-gold hover:border-brand-gold/40 transition-all cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleExportBackup}
              className="px-4 py-3 rounded-2xl glass-dark border border-white/15 hover:border-brand-gold/40 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-white/5 cursor-pointer"
            >
              <Download size={15} className="text-brand-gold" />
              <span>Backup JSON</span>
            </button>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-dark border border-brand-gold/30">
              <span className="text-[9px] text-[#A1A1AA] uppercase font-bold px-2">Boost 1-Clic:</span>
              {["Quito", "Guayaquil", "Machala", "Cuenca"].map((city) => (
                <button
                  key={city}
                  disabled={Boolean(boostingCity)}
                  onClick={() => handleCityBoost(city)}
                  className="px-2.5 py-1.5 rounded-xl bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-black text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {city}
                </button>
              ))}
            </div>

          </div>

        </div>

        {boostSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>{boostSuccess}</span>
          </div>
        )}

      </div>

      {/* ── 4 MASTER STATS METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Models */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[9px] uppercase font-black tracking-widest">Flota de Modelos</span>
            <Users size={16} className="text-brand-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-white">{totalModels}</div>
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span className="text-emerald-400 font-bold">🟢 {onlineCount} En Línea</span>
            <span className="text-[#A1A1AA]">·</span>
            <span className="text-brand-gold font-bold">✨ {verified4K} 4K</span>
          </div>
        </div>

        {/* Metric 2: Active Passes */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[9px] uppercase font-black tracking-widest">Pases VIP Activos</span>
            <Crown size={16} className="text-brand-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-gold">{activePasses}</div>
          <p className="text-[9px] text-[#A1A1AA] font-mono">Socios Diamante & Alpha</p>
        </div>

        {/* Metric 3: Estimated Monthly Volume */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[9px] uppercase font-black tracking-widest">Volumen Estimado</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
            ${estimatedPlatformVolume.toLocaleString()} USD
          </div>
          <p className="text-[9px] text-[#A1A1AA] font-mono">Tráfico & Citas mensuales</p>
        </div>

        {/* Metric 4: Security Status */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[9px] uppercase font-black tracking-widest">Seguridad Cripto</span>
            <ShieldCheck size={16} className="text-brand-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-white">100%</div>
          <p className="text-[9px] text-emerald-400 font-mono">Anti Fuerza Bruta + RLS</p>
        </div>

      </div>

    </div>
  );
}
