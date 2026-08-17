"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Server,
  UserCheck,
  Zap,
  Globe
} from "lucide-react";
import { getAdminAuditLogsAction } from "@/app/actions/admin";
import { sound } from "@/lib/soundEngine";

export default function AdminSecurityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminAuditLogsAction();
      setLogs(data);
    } catch (err) {
      console.warn("Logs fetch notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getBadgeStyle = (eventType: string) => {
    switch (eventType) {
      case "admin_login_success":
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          icon: <ShieldCheck size={14} />,
          label: "ACCESO EXITOSO"
        };
      case "admin_login_failed":
        return {
          bg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
          icon: <ShieldAlert size={14} />,
          label: "CLAVE INCORRECTA"
        };
      case "admin_login_rate_limited":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          icon: <AlertTriangle size={14} />,
          label: "BLOQUEO RATE LIMIT"
        };
      case "admin_vip_pass_created":
        return {
          bg: "bg-brand-gold/15 border-brand-gold/30 text-brand-gold",
          icon: <KeyRound size={14} />,
          label: "PASE VIP EMITIDO"
        };
      case "payment_settings_sync":
        return {
          bg: "bg-blue-500/15 border-blue-500/30 text-blue-400",
          icon: <Server size={14} />,
          label: "PAGOS SINCRONIZADOS"
        };
      default:
        return {
          bg: "bg-white/10 border-white/20 text-white/80",
          icon: <Zap size={14} />,
          label: eventType.toUpperCase()
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-obsidian border border-brand-gold/30 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/40 text-[9px] font-black uppercase tracking-widest text-brand-gold">
            <Lock size={12} />
            <span>Auditoría Ofensiva & Registro Criptográfico</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Registro de Seguridad & Trazabilidad en Vivo
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            Monitoreo en tiempo real de accesos, intentos de intrusión bloqueados y operaciones sensibles de base de datos.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playSubtleClick();
            fetchLogs();
          }}
          className="px-5 py-3 rounded-2xl glass-dark border border-white/15 hover:border-brand-gold/40 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw size={15} className={`text-brand-gold ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Logs</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest font-mono">Sincronizando auditoría...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-[#A1A1AA] space-y-2">
            <ShieldCheck size={36} className="text-brand-gold mx-auto opacity-50" />
            <p className="text-sm font-bold">No hay incidentes de seguridad registrados.</p>
            <p className="text-xs text-[#A1A1AA]/60 font-mono">Tu sistema opera con 100% de integridad.</p>
          </div>
        ) : (
          <div className="space-y-2.5 divide-y divide-white/5">
            {logs.map((log) => {
              const badge = getBadgeStyle(log.event_type);
              const dateStr = log.created_at ? new Date(log.created_at).toLocaleString("es-EC") : "Reciente";
              return (
                <div key={log.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.02] p-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black tracking-wider border ${badge.bg}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-xs font-mono text-white/90">
                      {log.metadata?.ip_key || log.metadata?.pass_code || log.event_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-[#A1A1AA]">
                    {log.metadata?.count !== undefined && (
                      <span className="text-brand-gold font-bold">
                        {log.metadata.count} registros afectados
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {dateStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
