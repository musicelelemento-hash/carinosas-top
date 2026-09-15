"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  HeartPulse,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Users,
  UserPlus,
  CreditCard,
  Zap,
  ArrowRight,
  Loader2,
  Globe,
  Lock,
  Film,
  Gift,
  BarChart3,
  PlusCircle,
  LayoutDashboard,
  KeyRound,
  ServerCrash,
} from "lucide-react";
import { getAdminMetricsAction } from "@/app/actions/admin";
import { sound } from "@/lib/soundEngine";

interface ControlRoomProps {
  onSelectTab?: (tab: string) => void;
}

interface HealthStatus {
  ok: boolean;
  ts: string;
  latencyMs: number;
}

interface EnvStatus {
  key: string;
  configured: boolean;
}

interface DBCounts {
  models: number | null;
  leads: number | null;
  verificationPending: number | null;
  vipPassesActive: number | null;
  bookings: number | null;
  trackingEvents7d: number | null;
}

interface MetricsKPIs {
  totalModels: number | null;
  verified4kPercent: number | null;
  eventsToday: number | null;
  activePasses: number | null;
}

const CRITICAL_ENVS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NOWPAYMENTS_API_KEY",
  "NOWPAYMENTS_IPN_SECRET",
  "CLOUDFLARE_TURNSTILE_SITE_KEY",
  "NEXT_PUBLIC_WHATSAPP_CONCIERGE",
] as const;

export default function AdminControlRoom({ onSelectTab }: ControlRoomProps) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [envStatuses, setEnvStatuses] = useState<EnvStatus[]>([]);
  const [dbCounts, setDbCounts] = useState<DBCounts>({
    models: null,
    leads: null,
    verificationPending: null,
    vipPassesActive: null,
    bookings: null,
    trackingEvents7d: null,
  });
  const [kpis, setKpis] = useState<MetricsKPIs>({
    totalModels: null,
    verified4kPercent: null,
    eventsToday: null,
    activePasses: null,
  });
  const [actionQueue, setActionQueue] = useState({
    verificationPending: 0,
    newLeads: 0,
    pendingPayments: 0,
  });
  const [dbLoading, setDbLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const start = performance.now();
      const res = await fetch("/api/health", { cache: "no-store" });
      const latencyMs = Math.round(performance.now() - start);
      const data = await res.json();
      setHealth({ ok: data.ok === true, ts: data.ts || new Date().toISOString(), latencyMs });
    } catch {
      setHealth({ ok: false, ts: new Date().toISOString(), latencyMs: -1 });
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const fetchEnvStatuses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/env-check", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEnvStatuses(data.envs || []);
      }
    } catch {
      // If endpoint doesn't exist yet, show all as unknown
      setEnvStatuses(CRITICAL_ENVS.map((key) => ({ key, configured: false })));
    }
  }, []);

  const fetchDBCounts = useCallback(async () => {
    setDbLoading(true);
    try {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch("/api/admin/db-counts", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDbCounts(data);
      }
    } catch {
      // silently fail
    } finally {
      setDbLoading(false);
    }
  }, []);

  const fetchActionQueue = useCallback(async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/action-queue", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setActionQueue(data);
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(false);
    }
  }, []);

  const fetchKPIs = useCallback(async () => {
    try {
      const metrics = await getAdminMetricsAction();
      if (metrics) {
        setKpis({
          totalModels: metrics.totalModels ?? null,
          verified4kPercent: metrics.verified4kShare ?? null,
          eventsToday: (metrics.funnel || []).reduce(
            (acc: number, f: { event: string; count: number }) => acc + f.count,
            0
          ) || null,
          activePasses: null,
        });
      }
    } catch {
      // silently fail
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchHealth(), fetchEnvStatuses(), fetchDBCounts(), fetchActionQueue(), fetchKPIs()]);
    setLastRefresh(new Date());
    setRefreshing(false);
  }, [fetchHealth, fetchEnvStatuses, fetchDBCounts, fetchActionQueue, fetchKPIs]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleNav = (tab: string) => {
    sound.playSubtleClick();
    onSelectTab?.(tab);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-gold via-[#FFE088] to-[#AA7C11] rounded-2xl flex items-center justify-center text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.35)]">
              <LayoutDashboard size={18} />
            </div>
            <h2 className="text-xl font-serif font-bold text-white tracking-tight">
              Panel de Control Total
            </h2>
          </div>
          <p className="text-[10px] text-[#A1A1AA] uppercase tracking-widest font-mono ml-[46px]">
            Cockpit de operaciones · Vista integral del negocio
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-dark border border-white/15 hover:border-brand-gold/40 text-[10px] font-black uppercase tracking-wider text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Actualizar Todo
        </button>
      </div>

      {/* ── ROW 1: HEALTH + ENV ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Salud del Sistema */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse size={16} className="text-brand-gold" />
              <span className="text-[10px] uppercase font-black tracking-widest text-[#A1A1AA]">
                Salud del Sistema
              </span>
            </div>
            <button
              onClick={fetchHealth}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RefreshCw size={12} className={`text-[#A1A1AA] ${healthLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* API Health */}
          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            health?.ok
              ? "bg-emerald-500/10 border-emerald-500/30"
              : health === null
                ? "bg-white/5 border-white/10"
                : "bg-rose-500/10 border-rose-500/30"
          }`}>
            {health === null ? (
              <Loader2 size={16} className="text-[#A1A1AA] animate-spin" />
            ) : health.ok ? (
              <CheckCircle2 size={16} className="text-emerald-400" />
            ) : (
              <ServerCrash size={16} className="text-rose-400" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${health?.ok ? "text-emerald-300" : health === null ? "text-[#A1A1AA]" : "text-rose-300"}`}>
                API /api/health: {health === null ? "Verificando..." : health.ok ? "Operativo" : "Fallo detectado"}
              </p>
              {health && (
                <p className="text-[9px] text-[#A1A1AA] font-mono mt-0.5">
                  Latencia: {health.latencyMs >= 0 ? `${health.latencyMs}ms` : "N/A"} · {new Date(health.ts).toLocaleTimeString("es-EC")}
                </p>
              )}
            </div>
          </div>

          {/* DB Counts */}
          <div className="space-y-2">
            <p className="text-[9px] uppercase font-black tracking-widest text-[#A1A1AA]">
              Base de Datos · Tablas Clave
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: "Modelos", value: dbCounts.models, icon: <Users size={12} /> },
                { label: "Verif. Pendientes", value: dbCounts.verificationPending, icon: <ShieldCheck size={12} /> },
                { label: "Pases VIP Activos", value: dbCounts.vipPassesActive, icon: <Gift size={12} /> },
                { label: "Booking Requests", value: dbCounts.bookings, icon: <CreditCard size={12} /> },
                { label: "Leads Reclut.", value: dbCounts.leads, icon: <UserPlus size={12} /> },
                { label: "Eventos 7d", value: dbCounts.trackingEvents7d, icon: <Activity size={12} /> },
              ].map((item) => (
                <div key={item.label} className="glass-dark border border-white/5 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#A1A1AA]">
                    {item.icon}
                    <span className="text-[8px] uppercase font-bold tracking-wider">{item.label}</span>
                  </div>
                  {dbLoading ? (
                    <div className="h-5 flex items-center">
                      <Loader2 size={12} className="text-brand-gold/50 animate-spin" />
                    </div>
                  ) : (
                    <p className="text-base font-serif font-bold text-white">
                      {item.value !== null ? item.value.toLocaleString() : <span className="text-[10px] text-[#A1A1AA] font-sans">Sin datos aún</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Env Config Status */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound size={16} className="text-brand-gold" />
            <span className="text-[10px] uppercase font-black tracking-widest text-[#A1A1AA]">
              Variables de Entorno
            </span>
          </div>
          <div className="space-y-1.5">
            {envStatuses.map((env) => (
              <div
                key={env.key}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                  env.configured
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Lock size={11} className="text-[#A1A1AA] shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-white/80 truncate">
                    {env.key}
                  </span>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${
                  env.configured ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {env.configured ? "Set ✅" : "Falta ⚠️"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: KPIs + ACTION QUEUE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* KPIs del Día */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-brand-gold" />
            <span className="text-[10px] uppercase font-black tracking-widest text-[#A1A1AA]">
              KPIs del Día
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Perfiles Activos",
                value: kpis.totalModels,
                icon: <Users size={14} />,
                color: "text-white",
              },
              {
                label: "Verificados 4K",
                value: kpis.verified4kPercent !== null ? `${kpis.verified4kPercent}%` : null,
                icon: <ShieldCheck size={14} />,
                color: "text-brand-gold",
              },
              {
                label: "Eventos Totales",
                value: kpis.eventsToday,
                icon: <Activity size={14} />,
                color: "text-emerald-400",
              },
              {
                label: "Pases Activos",
                value: kpis.activePasses,
                icon: <Gift size={14} />,
                color: "text-[#FF0062]",
              },
            ].map((kpi) => (
              <div key={kpi.label} className="glass-dark border border-white/5 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[#A1A1AA]">
                  {kpi.icon}
                  <span className="text-[9px] uppercase font-bold tracking-wider">{kpi.label}</span>
                </div>
                <p className={`text-2xl font-serif font-bold ${kpi.color}`}>
                  {kpi.value !== null && kpi.value !== undefined ? (
                    kpi.value
                  ) : (
                    <span className="text-xs text-[#A1A1AA] font-sans">Sin datos aún</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cola de Acción */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand-gold" />
            <span className="text-[10px] uppercase font-black tracking-widest text-[#A1A1AA]">
              Cola de Acción Pendiente
            </span>
          </div>
          <div className="space-y-3">
            {/* Verification */}
            <ActionRow
              icon={<ShieldCheck size={15} className="text-brand-gold" />}
              label="Solicitudes Verificación 4K"
              count={actionQueue.verificationPending}
              loading={actionLoading}
              buttonText="Ir a Verificación"
              onClick={() => handleNav("verification")}
            />
            {/* Recruitment leads */}
            <ActionRow
              icon={<UserPlus size={15} className="text-emerald-400" />}
              label="Leads de Reclutamiento"
              count={actionQueue.newLeads}
              loading={actionLoading}
              buttonText="Ir a Reclutamiento"
              onClick={() => handleNav("recruitment")}
            />
            {/* Pending VIP payments */}
            <ActionRow
              icon={<CreditCard size={15} className="text-[#FF0062]" />}
              label="Pagos VIP Pendientes"
              count={actionQueue.pendingPayments}
              loading={actionLoading}
              buttonText="Ir a Pases VIP"
              onClick={() => handleNav("passes")}
            />
          </div>
        </div>
      </div>

      {/* ── ROW 3: LAUNCH CHECKLIST ── */}
      <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-brand-gold" />
          <span className="text-[10px] uppercase font-black tracking-widest text-[#A1A1AA]">
            Checklist de Lanzamiento
          </span>
          <span className="ml-auto text-[8px] text-[#A1A1AA]/50 font-mono uppercase">Manual de operador</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              title: "Rotar claves de Supabase",
              desc: "Regenerar service role + anon en el panel de Supabase tras cada despliegue sensible.",
            },
            {
              title: "Verificar variables de entorno",
              desc: "Confirmar arriba que todas las envs críticas muestran Set ✅.",
            },
            {
              title: "DNS & dominio apuntando",
              desc: "Carinosas.top resolviendo a Vercel/Cloudflare con SSL activo y redirección www.",
            },
            {
              title: "Webhook NOWPayments IPN",
              desc: "Endpoint /api/webhooks/vip-pass registrado y respondiendo 200 con IPN secret válido.",
            },
            {
              title: "Turnstile antibot activo",
              desc: "Site key + secret emparejados en Cloudflare y formularios de registro/publciación protegidos.",
            },
            {
              title: "Canal de WhatsApp concierge",
              desc: "NEXT_PUBLIC_WHATSAPP_CONCIERGE apuntando al número operativo y respondiendo.",
            },
            {
              title: "Copias de seguridad automatizadas",
              desc: "Confirmar snapshot diario de la base en Supabase (Backups) retención mínima 7 días.",
            },
            {
              title: "Telegram de alertas conectado",
              desc: "Ajustar TELEGRAM para recibir notificaciones de verificación y pagos.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl glass-dark border border-white/5">
              <Globe size={13} className="text-brand-gold mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">{item.title}</p>
                <p className="text-[9px] text-[#A1A1AA] leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 4: ATAJOS ── */}
      <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-brand-gold" />
          <span className="text-[10px] uppercase font-black tracking-widest text-[#A1A1AA]">
            Atajos Rápidos
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { tab: "catalog", label: "Flota de Modelos", icon: <Users size={16} /> },
            { tab: "upload", label: "Publicar Express", icon: <PlusCircle size={16} /> },
            { tab: "verification", label: "Verificación 4K", icon: <ShieldCheck size={16} /> },
            { tab: "passes", label: "Pases VIP", icon: <Gift size={16} /> },
            { tab: "metrics", label: "Métricas", icon: <BarChart3 size={16} /> },
            { tab: "stories", label: "Historias 4K", icon: <Film size={16} /> },
            { tab: "recruitment", label: "Reclutamiento", icon: <UserPlus size={16} /> },
            { tab: "payments", label: "Pagos", icon: <CreditCard size={16} /> },
            { tab: "security", label: "Seguridad", icon: <Lock size={16} /> },
            { tab: "control", label: "Control Total", icon: <Zap size={16} /> },
          ].map((shortcut) => (
            <button
              key={shortcut.tab}
              onClick={() => handleNav(shortcut.tab)}
              className="glass-dark border border-white/10 hover:border-brand-gold/40 rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-all hover:bg-brand-gold/5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 group-hover:bg-brand-gold/20 flex items-center justify-center text-brand-gold transition-colors">
                {shortcut.icon}
              </div>
              <span className="text-[9px] uppercase font-black tracking-wider text-[#A1A1AA] group-hover:text-brand-gold transition-colors text-center">
                {shortcut.label}
              </span>
              <ArrowRight size={12} className="text-[#A1A1AA]/30 group-hover:text-brand-gold/60 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Last Refresh */}
      {lastRefresh && (
        <p className="text-[9px] text-[#A1A1AA]/50 text-center font-mono">
          Última actualización: {lastRefresh.toLocaleTimeString("es-EC")}
        </p>
      )}
    </div>
  );
}

function ActionRow({
  icon,
  label,
  count,
  loading,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  loading: boolean;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl glass-dark border border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-white">{label}</p>
          <p className="text-[9px] text-[#A1A1AA] font-mono mt-0.5">
            {loading ? (
              <Loader2 size={10} className="inline animate-spin" />
            ) : count > 0 ? (
              <span className="text-brand-gold font-bold">{count} pendiente{count !== 1 ? "s" : ""}</span>
            ) : (
              <span className="text-emerald-400">0 — todo al día</span>
            )}
          </p>
        </div>
      </div>
      {count > 0 && (
        <button
          onClick={onClick}
          className="px-3 py-1.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-black text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
        >
          {buttonText}
          <ArrowRight size={10} />
        </button>
      )}
    </div>
  );
}
