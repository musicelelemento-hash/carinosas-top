"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  MessageCircle,
  Phone,
  MapPin,
  ShieldCheck,
  ChevronDown,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ClipboardList,
  Target,
  Flame
} from "lucide-react";
import { motion } from "framer-motion";

import {
  addRecruitmentLeadAction,
  updateLeadStatusAction,
  listRecruitmentLeadsAction,
} from "@/app/actions/recruitment";
import type { RecruitmentLead, RecruitmentStatus } from "@/app/actions/recruitment";
import { sound } from "@/lib/soundEngine";

const STATUS_ORDER: RecruitmentStatus[] = [
  "new",
  "contacted",
  "interested",
  "consented",
  "profile_created",
  "declined",
];

const STATUS_META: Record<RecruitmentStatus, { label: string; badge: string }> = {
  new: { label: "Nuevo", badge: "bg-white/10 text-white/70 border-white/20" },
  contacted: { label: "Contactada", badge: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  interested: { label: "Interesada", badge: "bg-brand-gold/15 text-brand-gold border-brand-gold/40" },
  consented: { label: "Consentida", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  profile_created: { label: "Perfil Creado", badge: "bg-emerald-500/25 text-emerald-200 border-emerald-400/50" },
  declined: { label: "Declinada", badge: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
};

const MACHALA_ZONES = [
  "Unioro VIP",
  "Puerto Bolívar & Mar",
  "Machala Centro VIP",
  "Machala Este Residencial",
  "Hotel Oro Verde",
  "Sector Eloy Alfaro",
];

interface AdminRecruitmentTrackerProps {
  onGotoUpload?: () => void;
}

export default function AdminRecruitmentTracker({ onGotoUpload }: AdminRecruitmentTrackerProps) {
  const [leads, setLeads] = useState<RecruitmentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("Machala");
  const [zone, setZone] = useState("");
  const [source, setSource] = useState("whatsapp");
  const [notes, setNotes] = useState("");

  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRecruitmentLeadsAction();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;
    setSubmitting(true);
    try {
      const created = await addRecruitmentLeadAction({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        city: city || "Machala",
        zone: zone || undefined,
        source,
        notes: notes || undefined,
      });
      sound.playGoldChime();
      setLeads(prev => [created, ...prev]);
      setName("");
      setWhatsapp("");
      setZone("");
      setNotes("");
      setShowAddForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al registrar el lead.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: RecruitmentStatus) => {
    setSavingId(id);
    try {
      const updated = await updateLeadStatusAction(id, status);
      setLeads(prev => prev.map(l => (l.id === id ? updated : l)));
      sound.playSubtleClick();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al cambiar de estado.");
      fetchLeads();
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveNote = async (id: string) => {
    const draft = (noteDrafts[id] || "").trim();
    if (!draft) return;
    setSavingId(id);
    try {
      const updated = await updateLeadStatusAction(id, leads.find(l => l.id === id)?.status as RecruitmentStatus, { notes: draft });
      setLeads(prev => prev.map(l => (l.id === id ? updated : l)));
      setNoteDrafts(prev => ({ ...prev, [id]: "" }));
      sound.playSubtleClick();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar la nota.");
    } finally {
      setSavingId(null);
    }
  };

  const counts: Record<RecruitmentStatus, number> = STATUS_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }),
    {} as Record<RecruitmentStatus, number>
  );
  const activeLeads = leads.filter(l => l.status !== "declined" && l.status !== "profile_created").length;

  const waNumber = (whatsapp: string) => whatsapp.replace(/[^0-9]/g, "");
  const dateShort = (iso: string) => new Date(iso).toLocaleDateString("es-EC", { day: "2-digit", month: "short" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-8 animate-in fade-in duration-500 text-white">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-obsidian border border-brand-gold/30 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/40 text-[9px] font-black uppercase tracking-widest text-brand-gold">
            <Target size={12} />
            <span>Operativa de Siembra · Objetivo 10-15 Perfiles Reales</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Reclutamiento de Fundadoras
          </h2>
          <p className="text-xs text-white/60">
            Lleva el embudo diario en la base, sin hojas sueltas: mañana A · mediodía B · tarde C · noche D → perfil.
          </p>
        </div>

        <button
          onClick={() => { sound.playSubtleClick(); setShowAddForm(!showAddForm); }}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_25px_rgba(212,168,67,0.4)] flex items-center gap-2 shrink-0"
        >
          <UserPlus size={16} />
          <span>{showAddForm ? "Cerrar Formulario" : "Registrar Nuevo Lead"}</span>
        </button>
      </div>

      {/* ── FUNNEL SUMMARY ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="glass-dark border border-white/10 rounded-2xl p-4 text-center space-y-1">
            <span className="text-2xl font-serif font-bold text-white">{counts[s]}</span>
            <span className="text-[9px] uppercase font-black tracking-wider text-[#A1A1AA] block">
              {STATUS_META[s].label}
            </span>
            {s === "consented" && counts[s] > 0 && (
              <span className="text-[8px] font-mono text-brand-gold">✍️ listas para perfil</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-[#A1A1AA]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-dark border border-white/10">
          <Flame size={12} className="text-brand-gold" />
          <span>Embudo activo: <strong className="text-brand-gold">{activeLeads}</strong> leads en proceso (sin contar creadas/declinadas)</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-dark border border-white/10">
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span>Listas para publicar: <strong className="text-emerald-400">{counts.consented}</strong></span>
        </span>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
          {error}
        </div>
      )}

      {/* ── ADD LEAD FORM (COLLAPSIBLE) ── */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddLead}
          className="glass-obsidian border-2 border-brand-gold/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
        >
          <h3 className="font-serif text-lg font-bold text-brand-gold flex items-center gap-2">
            <UserPlus size={16} />
            <span>Nuevo Contacto de WhatsApp (mensaje A)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Nombre o Alias *</label>
              <input
                type="text"
                required
                placeholder="Ej: Carla"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">WhatsApp * (09... o 593...)</label>
              <input
                type="tel"
                required
                placeholder="5939XXXXXXXX"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Ciudad</label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#141419] border border-white/10 text-white text-xs"
              >
                <option value="Machala">Machala (El Oro)</option>
                <option value="Pasaje">Pasaje</option>
                <option value="Huaquillas">Huaquillas</option>
                <option value="Santa Rosa">Santa Rosa</option>
                <option value="Arenillas">Arenillas</option>
                <option value="Guayaquil">Guayaquil</option>
                <option value="Quito">Quito</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/70">Zona / Sector</label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#141419] border border-white/10 text-white text-xs"
              >
                <option value="">— Sin especificar —</option>
                {MACHALA_ZONES.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-white/70">Notas iniciales (zona, tarifa, observaciones)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ej: vi su perfil en X, trabaja en Unioro, dispuesta a difuminar rostro..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-xl glass-dark border border-white/10 text-white/60 text-xs font-bold uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-black text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
              <span>Guardar Lead</span>
            </button>
          </div>
        </motion.form>
      )}

      {/* ── LEADS LIST ── */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <ClipboardList size={18} className="text-brand-gold" />
          <span>Pipeline de Reclutamiento</span>
          <span className="text-[10px] font-mono text-[#A1A1AA] font-normal">({leads.length} leads)</span>
        </h3>

        {loading ? (
          <div className="glass-obsidian border border-white/10 rounded-3xl p-14 text-center">
            <Loader2 size={32} className="text-brand-gold animate-spin mx-auto mb-3" />
            <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">Cargando embudo...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="glass-obsidian border border-white/10 rounded-3xl p-14 text-center space-y-3">
            <Target size={36} className="text-brand-gold/60 mx-auto" />
            <p className="font-serif text-lg font-bold text-white">Embudo vacío</p>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Sin datos reales no se crean leads: registra tu primer contacto de WhatsApp aquí y dale seguimiento sin hojas sueltas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className={`rounded-3xl p-5 sm:p-6 transition-all space-y-4 ${
                  lead.status === "declined"
                    ? 'glass-dark border border-white/5 opacity-60'
                    : lead.status === "profile_created"
                      ? 'glass-dark border border-emerald-500/30'
                      : 'glass-obsidian border border-brand-gold/25 shadow-xl'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-serif text-lg font-bold text-white">{lead.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${STATUS_META[lead.status].badge}`}>
                        {STATUS_META[lead.status].label}
                      </span>
                      {lead.consent_confirmed_at && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[8px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                          <ShieldCheck size={9} /> Consentida {dateShort(lead.consent_confirmed_at)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-[#A1A1AA]">
                      <span className="inline-flex items-center gap-1">
                        <Phone size={10} className="text-brand-gold" />
                        {lead.whatsapp}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={10} className="text-brand-gold" />
                        {lead.city}{lead.zone ? ` · ${lead.zone}` : ""}
                      </span>
                      <span>Alta: {dateShort(lead.created_at)}</span>
                      {lead.source && <span className="text-white/40">{lead.source}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {lead.status !== "profile_created" && onGotoUpload && (
                      <button
                        onClick={() => { sound.playGoldChime(); onGotoUpload(); }}
                        className="px-3.5 py-2.5 rounded-xl bg-brand-gold hover:brightness-110 text-brand-black text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-lg"
                        title="Ir a Publicación Express para crear el perfil de fundadora"
                      >
                        <ExternalLink size={12} />
                        <span>Crear Perfil</span>
                      </button>
                    )}
                    {lead.whatsapp && (
                      <a
                        href={`https://wa.me/${waNumber(lead.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl glass-dark border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-500/10 cursor-pointer transition-all"
                      >
                        <MessageCircle size={12} />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                      <ChevronDown size={10} />
                      <span>Estado del embudo (1 toque)</span>
                    </label>
                    <select
                      value={lead.status}
                      disabled={savingId === lead.id}
                      onChange={e => handleStatusChange(lead.id, e.target.value as RecruitmentStatus)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141419] border border-white/10 text-white text-[11px] disabled:opacity-50 cursor-pointer"
                    >
                      {STATUS_ORDER.map(s => (
                        <option key={s} value={s}>{STATUS_META[s].label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                      <ClipboardList size={10} />
                      <span>Añadir nota de seguimiento</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noteDrafts[lead.id] || ""}
                        onChange={e => setNoteDrafts(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        placeholder="Ej: 'respondió a mensaje B, pregunta por verificación'..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] outline-none focus:border-brand-gold"
                      />
                      <button
                        onClick={() => handleSaveNote(lead.id)}
                        disabled={savingId === lead.id || !(noteDrafts[lead.id] || "").trim()}
                        className="px-3.5 py-2.5 rounded-xl bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-black text-[9px] font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer transition-all"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>

                {lead.notes && (
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-[10px] text-white/70 font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                    {lead.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}