"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  ShieldCheck,
  Wallet,
  MapPin,
  Gift,
  RefreshCw,
  Activity,
  Inbox,
} from "lucide-react";
import { getAdminMetricsAction } from "@/app/actions/admin";
import { sound } from "@/lib/soundEngine";

interface MetricsEvent {
  id: string;
  event: string;
  model_id: string | null;
  session_key: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

interface Metrics {
  modelsByCity: Record<string, number>;
  totalModels: number;
  newThisWeek: number;
  verified4k: number;
  verified4kShare: number | null;
  bookings: { total: number; pending: number; confirmed: number };
  funnel: { event: string; count: number }[];
  referralCodes: number;
  referralUses: number;
  events: MetricsEvent[];
}

const FUNNEL_LABELS: Record<string, string> = {
  model_registered: "Modelo registrada",
  model_verified_4k: "Verificada 4K",
  model_plan_upgraded: "Plan actualizado",
  city_page_view: "Vista de ciudad",
  profile_view: "Perfil visto",
  concierge_chat_started: "Concierge iniciado",
  vip_checkout_created: "Checkout VIP creado",
  vip_payment_confirmed: "Pago VIP confirmado",
  referral_visit: "Llegadas por referido",
};

function NumericCell({ value }: { value: number }) {
  if (value <= 0) {
    return <span className="text-[#4B4B55] font-mono text-sm">Sin datos aún</span>;
  }
  return <span className="text-white font-mono text-sm font-bold">{value.toLocaleString()}</span>;
}

export default function AdminMetricsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getAdminMetricsAction();
      setMetrics(data);
    } catch (err) {
      console.warn("Metrics fetch notice:", err);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Agrupar eventos equivalentes del mismo paso del embudo.
  const countFor = (eventName: string) => {
    if (!metrics?.funnel) return 0;
    const row = metrics.funnel.find((f) => f.event === eventName);
    return row?.count || 0;
  };
  const whatsappClicks = countFor("whatsapp_cta_click") + countFor("whatsapp_click");
  const bookings = countFor("booking_requested") + countFor("booking_created");

  const cityRows = Object.entries(metrics?.modelsByCity || {}).sort((a, b) => b[1] - a[1]);

  const offerta = [
    { label: FUNNEL_LABELS.model_registered, count: countFor("model_registered") },
    { label: FUNNEL_LABELS.model_verified_4k, count: countFor("model_verified_4k") },
    { label: FUNNEL_LABELS.model_plan_upgraded, count: countFor("model_plan_upgraded") },
  ];
  const demanda = [
    { label: FUNNEL_LABELS.city_page_view, count: countFor("city_page_view") },
    { label: FUNNEL_LABELS.profile_view, count: countFor("profile_view") },
    { label: "Clics a WhatsApp (CTA)", count: whatsappClicks },
    { label: FUNNEL_LABELS.concierge_chat_started, count: countFor("concierge_chat_started") },
    { label: "Reserva solicitada", count: bookings },
  ];
  const dinero = [
    { label: FUNNEL_LABELS.vip_checkout_created, count: countFor("vip_checkout_created") },
    { label: FUNNEL_LABELS.vip_payment_confirmed, count: countFor("vip_payment_confirmed") },
    { label: "Booking en booking_requests", count: metrics?.bookings.total || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header de la sección */}
      <div className="glass-obsidian border border-brand-gold/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-black flex items-center justify-center shadow-[0_0_20px_rgba(212,168,67,0.35)]">
              <BarChart3 size={22} />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white">
                Métricas del Negocio <span className="italic text-brand-gold">· Oferta · Demanda · Dinero</span>
              </h3>
              <p className="text-[10px] text-[#A1A1AA] font-mono uppercase tracking-widest text-brand-gold/70">
                Datos reales de Supabase · últimos 30 días · sin inventos
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playSubtleClick(); fetchMetrics(); }}
            title="Recargar métricas"
            className="p-3 rounded-2xl glass-dark border border-white/10 text-[#A1A1AA] hover:text-brand-gold hover:border-brand-gold/40 transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading && !metrics ? (
        <div className="glass-obsidian border border-white/10 rounded-3xl p-10 text-center space-y-3">
          <Activity size={28} className="text-brand-gold animate-pulse mx-auto" />
          <p className="text-[10px] text-[#A1A1AA] font-mono uppercase tracking-widest">Cargando métricas reales...</p>
        </div>
      ) : metrics ? (
        <>
          {/* ── KPIs TOP ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A1A1AA]">
                <span className="text-[9px] uppercase font-black tracking-widest">Perfiles activos</span>
                <Users size={16} className="text-brand-gold" />
              </div>
              <NumericCell value={metrics.totalModels} />
              <span className="text-[9px] text-[#A1A1AA] font-mono">{Object.keys(metrics.modelsByCity).length} ciudad(es) con datos</span>
            </div>

            <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A1A1AA]">
                <span className="text-[9px] uppercase font-black tracking-widest">Nuevas esta semana</span>
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <NumericCell value={metrics.newThisWeek} />
              <span className="text-[9px] text-[#A1A1AA] font-mono">modelos creados en los últimos 7 días</span>
            </div>

            <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A1A1AA]">
                <span className="text-[9px] uppercase font-black tracking-widest">Verificadas 4K</span>
                <ShieldCheck size={16} className="text-brand-gold" />
              </div>
              {metrics.verified4kShare === null || metrics.verified4k <= 0 ? (
                <span className="text-[#4B4B55] font-mono text-sm">Sin datos aún</span>
              ) : (
                <div>
                  <span className="text-white font-mono text-sm font-bold">{metrics.verified4k}</span>
                  <span className="text-white/40 font-mono text-sm"> · {metrics.verified4kShare}%</span>
                </div>
              )}
              <span className="text-[9px] text-[#A1A1AA] font-mono">sello real de revisión humana</span>
            </div>

            <div className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A1A1AA]">
                <span className="text-[9px] uppercase font-black tracking-widest">Reservas (tabla)</span>
                <Wallet size={16} className="text-emerald-400" />
              </div>
              <NumericCell value={metrics.bookings.total} />
              <span className="text-[9px] text-[#A1A1AA] font-mono">
                {metrics.bookings.pending} pendientes · {metrics.bookings.confirmed} confirmadas
              </span>
            </div>
          </div>

          {/* ── EMBUDO COMPLETO ── */}
          <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-6">
            <h4 className="text-[10px] text-white/40 uppercase font-black tracking-[0.35em] flex items-center gap-2">
              <Activity size={13} className="text-brand-gold" /> Embudo del negocio (30 días, desde tracking_events)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Oferta", rows: offerta, accent: "text-brand-gold" },
                { title: "Demanda", rows: demanda, accent: "text-brand-pink" },
                { title: "Dinero", rows: dinero, accent: "text-emerald-400" },
              ].map((col) => (
                <div key={col.title} className="space-y-3">
                  <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${col.accent}`}>{col.title}</span>
                  <div className="space-y-2.5">
                    {col.rows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between glass-dark border border-white/10 rounded-2xl px-4 py-3">
                        <span className="text-[11px] text-[#C9C9D3]">{row.label}</span>
                        <NumericCell value={row.count} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-[#4B4B55] font-mono uppercase tracking-wider pt-1 border-t border-white/5">
              whatsapp_click (legacy) y booking_created (legacy) se agrupan en su fila equivalente.
            </p>
          </div>

          {/* ── OFERTA POR CIUDAD + REFERIDOS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-4">
              <h4 className="text-[10px] text-white/40 uppercase font-black tracking-[0.35em] flex items-center gap-2">
                <MapPin size={13} className="text-brand-gold" /> Oferta por ciudad
              </h4>
              {cityRows.length === 0 ? (
                <p className="text-[#4B4B55] font-mono text-sm">Sin datos aún</p>
              ) : (
                <div className="space-y-2.5">
                  {cityRows.map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between glass-dark border border-white/10 rounded-2xl px-4 py-3">
                      <span className="text-[11px] text-white/80">{city}</span>
                      <span className="text-white font-mono text-sm font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-4">
              <h4 className="text-[10px] text-white/40 uppercase font-black tracking-[0.35em] flex items-center gap-2">
                <Gift size={13} className="text-brand-gold" /> Viralidad / Referidos
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-dark border border-white/10 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[9px] text-[#A1A1AA] uppercase font-black tracking-widest block">Códigos</span>
                  <NumericCell value={metrics.referralCodes} />
                </div>
                <div className="glass-dark border border-white/10 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[9px] text-[#A1A1AA] uppercase font-black tracking-widest block">Usos</span>
                  <NumericCell value={metrics.referralUses} />
                </div>
                <div className="glass-dark border border-white/10 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[9px] text-[#A1A1AA] uppercase font-black tracking-widest block">Visitas</span>
                  <NumericCell value={countFor("referral_visit")} />
                </div>
              </div>
            </div>
          </div>

          {/* ── ÚLTIMOS EVENTOS ── */}
          <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-4">
            <h4 className="text-[10px] text-white/40 uppercase font-black tracking-[0.35em] flex items-center gap-2">
              <Inbox size={13} className="text-brand-gold" /> Últimos 50 eventos registrados
            </h4>
            {metrics.events.length === 0 ? (
              <p className="text-[#4B4B55] font-mono text-sm">Sin datos aún — ningún evento ha llegado a tracking_events.</p>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] text-[#4B4B55] uppercase font-black tracking-widest border-b border-white/5">
                      <th className="pb-3 pr-4">Fecha</th>
                      <th className="pb-3 pr-4">Evento</th>
                      <th className="pb-3 pr-4">Modelo</th>
                      <th className="pb-3">Meta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.events.map((e) => (
                      <tr key={e.id} className="border-b border-white/5 last:border-0">
                        <td className="py-2.5 pr-4 font-mono text-[10px] text-[#A1A1AA] whitespace-nowrap">
                          {new Date(e.created_at).toLocaleString("es-EC", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className="text-[11px] text-white font-mono">{e.event}</span>
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-[10px] text-[#A1A1AA]">
                          {e.model_id ? e.model_id.slice(0, 8) : "—"}
                        </td>
                        <td className="py-2.5 font-mono text-[9px] text-white/40 max-w-[220px] truncate">
                          {e.meta ? JSON.stringify(e.meta) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="glass-obsidian border border-white/10 rounded-3xl p-10 text-center space-y-3">
          <Inbox size={28} className="text-[#4B4B55] mx-auto" />
          <p className="text-sm text-[#A1A1AA]">No se pudo cargar métricas (¿configuradas las env de Supabase en el servidor?).</p>
        </div>
      )}
    </div>
  );
}