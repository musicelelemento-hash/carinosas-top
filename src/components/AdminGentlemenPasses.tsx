"use client";

import React, { useState, useEffect } from "react";
import { 
  Crown, 
  Sparkles, 
  Gift, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  Flame, 
  Lock,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import { 
  getAdminVIPPassesAction, 
  createAdminVIPPassAction, 
  toggleAdminVIPPassAction, 
  deleteAdminVIPPassAction 
} from "@/app/actions/admin";

interface VIPPass {
  id: string;
  code: string;
  targetCity: string;
  durationDays: number;
  vaultBonusUsd: number;
  maxUses: number;
  usedCount: number;
  createdAt: string;
  isActive: boolean;
}

const DEFAULT_PASSES: VIPPass[] = [
  {
    id: "pass-1",
    code: "VIP-MACHALA-ORO",
    targetCity: "Machala",
    durationDays: 30,
    vaultBonusUsd: 100,
    maxUses: 50,
    usedCount: 14,
    createdAt: "2026-08-10",
    isActive: true
  },
  {
    id: "pass-2",
    code: "VIP-GUAYAQUIL-ALPHA",
    targetCity: "Guayaquil",
    durationDays: 60,
    vaultBonusUsd: 250,
    maxUses: 20,
    usedCount: 7,
    createdAt: "2026-08-12",
    isActive: true
  },
  {
    id: "pass-3",
    code: "VIP-QUITO-DIAMANTE",
    targetCity: "Quito",
    durationDays: 30,
    vaultBonusUsd: 150,
    maxUses: 30,
    usedCount: 18,
    createdAt: "2026-08-15",
    isActive: true
  }
];

export default function AdminGentlemenPasses() {
  const [passes, setPasses] = useState<VIPPass[]>(DEFAULT_PASSES);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Pass Form
  const [newCode, setNewCode] = useState("");
  const [newCity, setNewCity] = useState("Machala");
  const [newDays, setNewDays] = useState(30);
  const [newBonus, setNewBonus] = useState(100);
  const [newMaxUses, setNewMaxUses] = useState(50);

  useEffect(() => {
    async function loadPasses() {
      try {
        const dbPasses = await getAdminVIPPassesAction();
        if (dbPasses && dbPasses.length > 0) {
          const mapped: VIPPass[] = dbPasses.map((p: any) => ({
            id: p.id,
            code: p.pass_code,
            targetCity: p.holder_name || "Nacional",
            durationDays: 30,
            vaultBonusUsd: 100,
            maxUses: 50,
            usedCount: 1,
            createdAt: p.created_at ? p.created_at.split("T")[0] : "2026-08-16",
            isActive: p.status === "active"
          }));
          setPasses(mapped);
          return;
        }
      } catch (err) {
        console.warn("DB VIP passes fetch notice:", err);
      }

      // Fallback to local storage
      const local = localStorage.getItem("carinosas_vip_passes");
      if (local) {
        try {
          setPasses(JSON.parse(local));
        } catch {}
      }
    }
    loadPasses();
  }, []);

  const savePasses = (newPassList: VIPPass[]) => {
    setPasses(newPassList);
    localStorage.setItem("carinosas_vip_passes", JSON.stringify(newPassList));
  };

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const pass: VIPPass = {
      id: `pass-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      targetCity: newCity,
      durationDays: Number(newDays),
      vaultBonusUsd: Number(newBonus),
      maxUses: Number(newMaxUses),
      usedCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true
    };

    const updated = [pass, ...passes];
    savePasses(updated);
    setIsCreating(false);
    setNewCode("");

    // Persist to server
    try {
      await createAdminVIPPassAction({
        pass_code: pass.code,
        holder_name: pass.targetCity,
        tier_type: "gentleman",
        tier_level: "Diamante",
        duration_days: pass.durationDays
      });
    } catch (err) {
      console.warn("Server pass create notice:", err);
    }

    if (typeof window !== "undefined") {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#D4A843", "#FFE088", "#FF0062"]
      });
    }
  };

  const handleCopyLink = (code: string) => {
    const link = `https://carinosas.top/boveda-secreta?gift=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleToggle = async (id: string) => {
    const pass = passes.find(p => p.id === id);
    const newActiveState = pass ? !pass.isActive : true;
    const updated = passes.map(p => p.id === id ? { ...p, isActive: newActiveState } : p);
    savePasses(updated);

    try {
      await toggleAdminVIPPassAction(id, newActiveState ? "active" : "revoked");
    } catch (err) {
      console.warn("Toggle status server notice:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas revocar este pase VIP?")) {
      const updated = passes.filter(p => p.id !== id);
      savePasses(updated);

      try {
        await deleteAdminVIPPassAction(id);
      } catch (err) {
        console.warn("Delete pass server notice:", err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-8 animate-in fade-in duration-500 text-white">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-obsidian border border-brand-gold/30 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/40 text-[9px] font-black uppercase tracking-widest text-brand-gold">
            <Crown size={12} />
            <span>Fidelización & Monopolio de Clientes</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Pases Diamante & Regalos VIP para Caballeros
          </h2>
          <p className="text-xs text-white/60">
            Regala membresías VIP gratuitas a clientes selectos de Machala y Ecuador para crear fidelidad y compras masivas.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_25px_rgba(212,168,67,0.4)] flex items-center gap-2 shrink-0"
        >
          <Gift size={16} />
          <span>Crear Pase de Regalo</span>
        </button>
      </div>

      {/* ── CREATE PASS FORM (COLLAPSIBLE) ── */}
      {isCreating && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreatePass}
          className="glass-obsidian border-2 border-brand-gold/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
        >
          <h3 className="font-serif text-lg font-bold text-brand-gold flex items-center gap-2">
            <Sparkles size={16} />
            <span>Generar Nuevo Pase Diamante de Regalo</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Código de Invitación *</label>
              <input
                type="text"
                required
                placeholder="Ej: VIP-MACHALA-2026"
                value={newCode}
                onChange={e => setNewCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Ciudad Exclusiva</label>
              <select
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#141419] border border-white/10 text-white text-xs"
              >
                <option value="Machala">Machala (El Oro)</option>
                <option value="Guayaquil">Guayaquil (Samborondón)</option>
                <option value="Quito">Quito (La Carolina)</option>
                <option value="Cuenca">Cuenca</option>
                <option value="Ecuador (Nacional)">Ecuador (Nacional Completo)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Días de Membresía Gratis</label>
              <select
                value={newDays}
                onChange={e => setNewDays(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#141419] border border-white/10 text-white text-xs"
              >
                <option value={7}>7 Días (Pase Semanal)</option>
                <option value={15}>15 Días (Quincenal)</option>
                <option value={30}>30 Días (1 Mes Completo)</option>
                <option value={60}>60 Días (2 Meses)</option>
                <option value={365}>365 Días (1 Año VIP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Saldo Bóveda Incluido ($ USD de Regalo)</label>
              <input
                type="number"
                value={newBonus}
                onChange={e => setNewBonus(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Límite de Clientes que pueden usarlo</label>
              <input
                type="number"
                value={newMaxUses}
                onChange={e => setNewMaxUses(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-5 py-2.5 rounded-xl glass-dark border border-white/10 text-white/60 text-xs font-bold uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-black text-xs font-black uppercase tracking-wider shadow-md"
            >
              Emitir Pase VIP
            </button>
          </div>
        </motion.form>
      )}

      {/* ── PASSES LIST ── */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <KeyRound size={18} className="text-brand-gold" />
          <span>Pases & Enlaces de Activación Directa</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {passes.map((pass) => (
            <div
              key={pass.id}
              className={`rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                pass.isActive
                  ? 'glass-obsidian border border-brand-gold/40 shadow-xl'
                  : 'glass-dark border border-white/5 opacity-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                    {pass.targetCity}
                  </span>

                  <button
                    onClick={() => handleToggle(pass.id)}
                    className="text-[9px] font-mono font-bold"
                  >
                    {pass.isActive ? (
                      <span className="text-emerald-400">🟢 Activo</span>
                    ) : (
                      <span className="text-white/40">⚪ Pausado</span>
                    )}
                  </button>
                </div>

                <div>
                  <h4 className="font-mono font-bold text-lg text-white tracking-wider">{pass.code}</h4>
                  <span className="text-xs text-white/60 block mt-0.5">
                    {pass.durationDays} Días VIP · ${pass.vaultBonusUsd} Saldo Bóveda
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-white/60 font-mono">Usos Registrados:</span>
                  <span className="text-xs font-mono font-bold text-brand-gold">
                    {pass.usedCount} / {pass.maxUses}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleCopyLink(pass.code)}
                  className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-white text-brand-black text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  {copiedCode === pass.code ? (
                    <>
                      <Check size={14} />
                      <span>¡Enlace Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar Enlace de Regalo</span>
                    </>
                  )}
                </button>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(pass.id)}
                    className="text-[9px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 mt-1"
                  >
                    <Trash2 size={11} /> Revocar Pase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
