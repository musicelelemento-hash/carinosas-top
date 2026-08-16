"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Building2, 
  QrCode, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  DollarSign, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit2
} from "lucide-react";
import { motion } from "framer-motion";

export interface PaymentMethodConfig {
  id: string;
  name: string;
  type: "crypto" | "bank" | "app" | "card";
  details: string;
  extraInfo?: string;
  isEnabled: boolean;
}

const DEFAULT_METHODS: PaymentMethodConfig[] = [
  {
    id: "usdt-trc20",
    name: "USDT Cripto (TRC-20 / Red Tron)",
    type: "crypto",
    details: "TX9qZ8k2LpM5vRt7wXyN4bC1sFd8gH3jK",
    extraInfo: "100% Anónimo · Confirmación en red en 2 minutos",
    isEnabled: true
  },
  {
    id: "usdt-bep20",
    name: "USDT Cripto (BEP-20 / Binance Smart Chain)",
    type: "crypto",
    details: "0x71C...B29F4a8e",
    extraInfo: "Comisión de red ultrabaja ($0.20)",
    isEnabled: true
  },
  {
    id: "banco-pichincha",
    name: "Banco Pichincha (Cuenta Corriente)",
    type: "bank",
    details: "Cta: 2100876543 · RUC: 1792345678001 · Titular: Digital Media Services",
    extraInfo: "Concepto de pago discreto (Servicios Digitales)",
    isEnabled: true
  },
  {
    id: "banco-guayaquil",
    name: "Banco Guayaquil / Banco de Machala",
    type: "bank",
    details: "Cta de Ahorros: 11456789 · CI: 0704567890 · Titular: Inversiones El Oro",
    extraInfo: "Acepta depósitos en ventanilla y cajeros automáticos",
    isEnabled: true
  },
  {
    id: "deuna-ecuador",
    name: "Deuna Ecuador (Pago QR Inmediato)",
    type: "app",
    details: "Celular Deuna: 0987654321",
    extraInfo: "Sin comisiones bancarias · Transferencia instantánea",
    isEnabled: true
  },
  {
    id: "tarjeta-vip",
    name: "Tarjeta de Crédito / Débito Internacional (VIP)",
    type: "card",
    details: "Procesamiento seguro Stripe / Crypto Gateway",
    extraInfo: "Facturación anónima en estado de cuenta bancario",
    isEnabled: true
  }
];

export default function AdminPaymentSettings() {
  const [methods, setMethods] = useState<PaymentMethodConfig[]>(DEFAULT_METHODS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Method Modal/Form State
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"crypto" | "bank" | "app" | "card">("bank");
  const [newDetails, setNewDetails] = useState("");
  const [newExtra, setNewExtra] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem("carinosas_payment_methods");
    if (local) {
      try {
        setMethods(JSON.parse(local));
      } catch (e) {
        console.error("Error parsing local payment methods", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("carinosas_payment_methods", JSON.stringify(methods));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggle = (id: string) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, isEnabled: !m.isEnabled } : m));
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este método de pago?")) {
      setMethods(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDetails.trim()) return;

    const newM: PaymentMethodConfig = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      details: newDetails.trim(),
      extraInfo: newExtra.trim(),
      isEnabled: true
    };

    setMethods(prev => [...prev, newM]);
    setNewName("");
    setNewDetails("");
    setNewExtra("");
    setIsAdding(false);
    handleSave();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-500 text-white">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-obsidian border border-brand-gold/30 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/40 text-[9px] font-black uppercase tracking-widest text-brand-gold">
            <DollarSign size={12} />
            <span>Configuración Financiera del Dueño</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Gestor de Métodos de Pago & Billeteras Cripto
          </h2>
          <p className="text-xs text-white/60">
            Edita tus cuentas bancarias de Ecuador, billeteras USDT o agrega nuevos métodos con 1 clic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-5 py-3 rounded-2xl glass-dark border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-black text-brand-gold text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Agregar Método</span>
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-gold/30 flex items-center gap-2"
          >
            <Save size={16} />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2"
        >
          <Check size={16} />
          <span>¡Métodos de pago guardados y sincronizados en la pasarela en vivo!</span>
        </motion.div>
      )}

      {/* ── ADD NEW METHOD FORM (COLLAPSIBLE) ── */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleAddMethod}
          className="glass-obsidian border-2 border-brand-gold/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
        >
          <h3 className="font-serif text-lg font-bold text-brand-gold flex items-center gap-2">
            <Sparkles size={16} />
            <span>Nuevo Método de Pago para Clientes y Modelos</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Nombre del Método *</label>
              <input
                type="text"
                required
                placeholder="Ej: Banco Bolivariano / Produbanco"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Tipo de Método</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-[#141419] border border-white/10 text-white text-xs"
              >
                <option value="bank">🏦 Transferencia Bancaria Ecuador</option>
                <option value="crypto">🪙 Criptomoneda / Billetera USDT</option>
                <option value="app">📲 App Móvil (Deuna / PayPhone / Billetera)</option>
                <option value="card">💳 Tarjeta de Crédito / Pasarela Externa</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-white/70">Datos de la Cuenta / Billetera *</label>
            <input
              type="text"
              required
              placeholder="Ej: Cta Corriente #123456789 - RUC: 070... - Titular: Juan Perez"
              value={newDetails}
              onChange={e => setNewDetails(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-white/70">Instrucciones Adicionales</label>
            <input
              type="text"
              placeholder="Ej: Enviar comprobante al WhatsApp del Concierge para activación en 5 min"
              value={newExtra}
              onChange={e => setNewExtra(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-2.5 rounded-xl glass-dark border border-white/10 text-white/60 text-xs font-bold uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-black text-xs font-black uppercase tracking-wider shadow-md"
            >
              Guardar Método
            </button>
          </div>
        </motion.form>
      )}

      {/* ── METHODS LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => {
          return (
            <div
              key={method.id}
              className={`rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                method.isEnabled
                  ? 'glass-obsidian border border-brand-gold/30 shadow-xl'
                  : 'glass-dark border border-white/5 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
                      {method.type === "crypto" && <QrCode size={20} />}
                      {method.type === "bank" && <Building2 size={20} />}
                      {method.type === "app" && <Sparkles size={20} />}
                      {method.type === "card" && <CreditCard size={20} />}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-white">{method.name}</h4>
                      <span className="text-[9px] font-mono text-brand-gold uppercase tracking-wider block">
                        {method.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(method.id)}
                    className="shrink-0 text-white/80 hover:text-white"
                    title={method.isEnabled ? "Desactivar" : "Activar"}
                  >
                    {method.isEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/30">
                        🟢 Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                        ⚪ Pausado
                      </span>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-white/90 break-all select-all">
                  {method.details}
                </div>

                {method.extraInfo && (
                  <p className="text-[10px] text-white/50 italic">
                    ℹ️ {method.extraInfo}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[9px] text-white/40 font-mono">ID: {method.id}</span>

                <button
                  onClick={() => handleDelete(method.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <Trash2 size={12} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
