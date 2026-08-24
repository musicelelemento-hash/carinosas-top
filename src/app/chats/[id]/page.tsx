"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, BadgeCheck, CalendarPlus, CalendarCheck, Send, X } from "lucide-react";
import { MOCK_CHATS } from "@/lib/mockChats";

interface Msg {
  id: string;
  me: boolean;
  t: string;
  booking?: { day: string; time: string; type: string };
}

const DAYS = ["Jueves 25", "Viernes 26", "Sábado 27"];
const HOURS = ["19:00", "21:00", "23:00", "01:00"];
const MEETING_TYPES = ["Cena o evento", "Visita a domicilio", "Hotel"];

export default function ChatConversationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const contact = MOCK_CHATS.find((c) => c.id === params.id) || MOCK_CHATS[0];

  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m1", me: false, t: `Hola, gracias por escribir 🙂 ¿En qué te puedo ayudar?` },
    { id: "m2", me: true, t: "Hola, quisiera coordinar una cita." },
    { id: "m3", me: false, t: "Claro, dime qué día te queda bien y lo agendamos." },
  ]);
  const [draft, setDraft] = useState("");
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [day, setDay] = useState(DAYS[0]);
  const [hour, setHour] = useState(HOURS[1]);
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMsgs((prev) => [...prev, { id: `u-${Date.now()}`, me: true, t: draft.trim() }]);
    setDraft("");
  };

  const confirmBooking = () => {
    setMsgs((prev) => [
      ...prev,
      { id: `b-${Date.now()}`, me: true, t: "", booking: { day, time: hour, type: meetingType } },
    ]);
    setAgendaOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#08080B] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
        <button onClick={() => router.push("/chats")} className="w-9 h-9 rounded-full flex items-center justify-center text-white/70" aria-label="Atrás">
          <ArrowLeft size={18} />
        </button>
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#101014]">
          <Image src={contact.avatar} alt={contact.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-white truncate">{contact.name}</span>
            <BadgeCheck size={14} className="text-brand-gold shrink-0" />
          </div>
          {contact.online && <span className="font-mono text-[11px] text-brand-green">en línea</span>}
        </div>
        <button
          onClick={() => setAgendaOpen(true)}
          className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-brand-gold shrink-0"
          aria-label="Agendar"
        >
          <CalendarPlus size={17} />
        </button>
      </div>

      {/* Aviso de expiración */}
      <div className="flex justify-center py-3">
        <span className="font-mono text-[11px] text-white/45 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,.04)" }}>
          Hoy · los mensajes se borran en 7 días
        </span>
      </div>

      {/* Mensajes */}
      <div className="flex-1 flex flex-col gap-2.5 px-4 pb-4 overflow-y-auto">
        {msgs.map((m) =>
          m.booking ? (
            <div
              key={m.id}
              className="self-end max-w-[78%] rounded-2xl p-3.5 space-y-1"
              style={{ border: "1px solid rgba(212,168,67,.4)", background: "rgba(212,168,67,.06)" }}
            >
              <div className="flex items-center gap-2 text-brand-gold">
                <CalendarCheck size={16} />
                <span className="text-[13px] font-bold">Reserva confirmada</span>
              </div>
              <p className="text-[13px] text-white/72">
                {m.booking.day} · {m.booking.time} · {m.booking.type}
              </p>
            </div>
          ) : (
            <div
              key={m.id}
              className="max-w-[78%] px-4 py-2.5 text-[14px] leading-[1.45]"
              style={{
                alignSelf: m.me ? "flex-end" : "flex-start",
                background: m.me ? "#D4A843" : "rgba(255,255,255,.06)",
                color: m.me ? "#08080B" : "#F0F0EC",
                borderRadius: m.me ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              }}
            >
              {m.t}
            </div>
          )
        )}
      </div>

      {/* Barra de entrada */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.07]">
        <button
          onClick={() => setAgendaOpen(true)}
          className="w-[46px] h-[46px] rounded-xl bg-brand-gold text-[#08080B] flex items-center justify-center shrink-0"
          aria-label="Agendar"
        >
          <CalendarPlus size={19} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 text-[14px] text-white placeholder:text-white/35 outline-none"
          style={{ height: 46 }}
        />
        <button
          onClick={sendMessage}
          className="w-[46px] h-[46px] rounded-xl bg-brand-gold text-[#08080B] flex items-center justify-center shrink-0"
          aria-label="Enviar"
        >
          <Send size={17} />
        </button>
      </div>

      {/* ── HOJA DE AGENDA ── */}
      {agendaOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end" onClick={() => setAgendaOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div onClick={(e) => e.stopPropagation()} className="relative bg-[#101014] rounded-t-[22px] p-5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xl text-white">Agenda</span>
              <button onClick={() => setAgendaOpen(false)} aria-label="Cerrar" className="text-white/60">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">Día</span>
              <div className="grid grid-cols-3 gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    className="rounded-xl border text-[13px] font-semibold py-2.5 transition-colors"
                    style={{
                      background: day === d ? "rgba(212,168,67,.1)" : "transparent",
                      borderColor: day === d ? "#D4A843" : "rgba(255,255,255,.1)",
                      color: day === d ? "#D4A843" : "rgba(240,240,236,.72)",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">Hora</span>
              <div className="grid grid-cols-3 gap-2">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHour(h)}
                    className="rounded-xl text-[13px] font-bold"
                    style={{
                      height: 48,
                      background: hour === h ? "#D4A843" : "rgba(255,255,255,.05)",
                      color: hour === h ? "#08080B" : "rgba(240,240,236,.72)",
                      border: `1px solid ${hour === h ? "#D4A843" : "rgba(255,255,255,.1)"}`,
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">Encuentro</span>
              <div className="space-y-2">
                {MEETING_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setMeetingType(t)}
                    className="w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left"
                    style={{ borderColor: meetingType === t ? "#D4A843" : "rgba(255,255,255,.1)" }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border shrink-0 flex items-center justify-center"
                      style={{ borderColor: meetingType === t ? "#D4A843" : "rgba(255,255,255,.3)" }}
                    >
                      {meetingType === t && <span className="w-2 h-2 rounded-full bg-brand-gold" />}
                    </span>
                    <span className="text-[14px] text-white">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.07]">
              <span className="font-serif font-bold text-xl text-brand-gold">Reserva $60</span>
              <button onClick={confirmBooking} className="btn-gold px-6" style={{ minHeight: 52 }}>
                Confirmar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
