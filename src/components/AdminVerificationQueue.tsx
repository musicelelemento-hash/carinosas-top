"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Loader2, ShieldCheck } from "lucide-react";
import {
  listPendingVerificationsAction,
  reviewVerificationAction,
} from "@/app/actions/verification";

interface PendingItem {
  id: string;
  model_id: string | null;
  phone: string | null;
  selfie_url: string | null;
  gesture_url: string | null;
  created_at: string | null;
  model?: { name?: string; city?: string } | { name?: string; city?: string }[] | null;
}

export default function AdminVerificationQueue() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await listPendingVerificationsAction();
    if (res.success && res.data) {
      setItems(res.data as unknown as PendingItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleReview = async (id: string, approve: boolean) => {
    setBusyId(id);
    setMessage(null);
    const res = await reviewVerificationAction(id, approve);
    setBusyId(null);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage(approve ? "Solicitud aprobada: sello 4K activado." : "Solicitud rechazada.");
    } else {
      setMessage(res.error || "Error al revisar.");
    }
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#101014] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-white">Verificación 4K — Cola de revisión humana</h2>
          <p className="text-[12px] text-white/50 mt-1">Aprobar activa el sello 4K real del perfil. El material no se publica y se borra a los 30 días.</p>
        </div>
        <button onClick={load} className="text-[11px] font-bold uppercase tracking-wider text-brand-gold border border-brand-gold/40 rounded-xl px-3 py-2">
          Actualizar
        </button>
      </div>

      {message && <p className="text-sm text-brand-gold">{message}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="text-center text-white/45 text-sm py-10">No hay solicitudes de verificación pendientes.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const model = Array.isArray(item.model) ? item.model[0] : item.model;
            return (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-white/[0.08] bg-[#0C0C10] p-4">
                <div className="flex gap-4">
                  {item.selfie_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.selfie_url} alt="Selfie" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
                  )}
                  {item.gesture_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.gesture_url} alt="Gesto" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-brand-gold" />
                    <span className="font-bold text-white">{model?.name || "Perfil sin nombre"}</span>
                    <span className="text-white/45 text-xs">{model?.city || ""}</span>
                  </div>
                  {item.phone && <p className="text-white/55 text-xs mt-1">WhatsApp: {item.phone}</p>}
                  <p className="text-white/40 text-[11px] font-mono mt-1">
                    {item.created_at ? new Date(item.created_at).toLocaleString("es-EC") : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReview(item.id, true)}
                    disabled={busyId === item.id}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold text-xs disabled:opacity-50"
                  >
                    <Check size={14} /> Aprobar
                  </button>
                  <button
                    onClick={() => handleReview(item.id, false)}
                    disabled={busyId === item.id}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 font-bold text-xs disabled:opacity-50"
                  >
                    <X size={14} /> Rechazar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
