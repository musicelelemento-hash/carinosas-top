"use client";

import React, { useState, useEffect } from "react";
import { getModelBookingsAction, type BookingRequestItem } from "@/app/actions/booking";
import { Calendar, ShieldCheck, Clock, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AgendaViewProps {
  modelId: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-amber-400" },
  confirmed: { label: "Confirmada", color: "text-emerald-400" },
  cancelled: { label: "Cancelada", color: "text-rose-400" },
  completed: { label: "Completada", color: "text-brand-gold" },
};

export default function AgendaView({ modelId }: AgendaViewProps) {
  const [bookings, setBookings] = useState<BookingRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsAccount, setNeedsAccount] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        if (active) {
          setNeedsAccount(true);
          setLoading(false);
        }
        return;
      }
      const data = await getModelBookingsAction(modelId, session.access_token);
      if (active) {
        if (data === null) setNeedsAccount(true);
        else setBookings(data);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [modelId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-brand-gold/10 rounded-full" />
        <div className="absolute inset-0 border-t-2 border-brand-gold rounded-full animate-spin" />
        <p className="mt-4 text-[10px] text-white/40 italic uppercase tracking-widest">Cargando agenda...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    if (needsAccount) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full border border-brand-gold/30 bg-brand-gold/5 flex items-center justify-center mb-4">
            <Lock size={22} className="text-brand-gold" />
          </div>
          <h4 className="text-lg font-serif text-white italic font-bold">Agenda privada</h4>
          <p className="text-[10px] text-white/50 max-w-sm mx-auto leading-relaxed">
            Inicia sesión con la cuenta asociada a este perfil para consultar sus solicitudes.
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full border border-brand-gold/30 bg-brand-gold/5 flex items-center justify-center mb-4">
          <Calendar size={24} className="text-brand-gold" />
        </div>
        <h4 className="text-lg font-serif text-white italic font-bold">Sin reservas solicitadas aún</h4>
        <p className="text-[10px] text-white/50 max-w-sm mx-auto leading-relaxed">
          Las solicitudes de reserva de clientes aparecerán aquí en tiempo real.
        </p>
      </div>
    );
  }

  const bookingCards = bookings.map((b) => {
    const status = STATUS_LABELS[b.status] || STATUS_LABELS.pending;
    return (
      <div key={b.id} className="glass-obsidian p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[8px] text-white/40 uppercase tracking-wider font-bold block">
              Ciudad
            </span>
            <span className="text-sm font-bold text-white">{b.requested_city}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <Clock size={14} className="text-brand-gold/40" />
          <span className="text-[9px] text-white/60">{b.service_duration}</span>
        </div>

        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[8px] text-white/30 uppercase font-black tracking-widest">
          <span>Solicitada</span>
          <span>{new Date(b.created_at).toLocaleDateString("es-EC", { day: "numeric", month: "short" })}</span>
        </div>
      </div>
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif text-white italic font-bold">Agenda de Reservas</h3>
          <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mt-0.5">Solicitudes de clientes VIP</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-obsidian border border-brand-gold/30 text-brand-gold text-[9px] font-black uppercase tracking-wider">
          <ShieldCheck size={14} />
          {bookings.length} activas
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookingCards}
      </div>
    </div>
  );
}
