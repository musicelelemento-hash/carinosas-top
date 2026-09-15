"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, BadgeCheck, CalendarPlus, CalendarCheck, Send, X, Loader2 } from "lucide-react";
import {
  getOrCreateThreadAction,
  getMessagesAction,
  sendMessageAction,
  createBookingFromChatAction,
} from "@/app/actions/chat";

interface Msg {
  id: string;
  sender: string;
  text: string;
  created_at: string;
}

const DAYS = ["Jueves 25", "Viernes 26", "Sábado 27"];
const HOURS = ["19:00", "21:00", "23:00", "01:00"];
const MEETING_TYPES = ["Cena o evento", "Visita a domicilio", "Hotel"];

function getSessionKey(): string {
  if (typeof window === "undefined") return "";
  try {
    let key = localStorage.getItem("carinosas_session");
    if (!key) {
      key = crypto.randomUUID();
      localStorage.setItem("carinosas_session", key);
    }
    return key;
  } catch {
    return "";
  }
}

export default function ChatConversationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const modelId = params.id;

  const [sessionKey, setSessionKey] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [day, setDay] = useState(DAYS[0]);
  const [hour, setHour] = useState(HOURS[1]);
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
  const listRef = useRef<HTMLDivElement>(null);

  // Inicializa la sesión y crea/carga el hilo de conversación real.
  useEffect(() => {
    const sk = getSessionKey();
    setSessionKey(sk);
    (async () => {
      const thread = await getOrCreateThreadAction(modelId, sk);
      if (!thread.threadId) { setLoading(false); return; }
      setThreadId(thread.threadId);
      const res = await getMessagesAction(thread.threadId);
      if (res.messages) setMsgs(res.messages as unknown as Msg[]);
      setLoading(false);
    })();
  }, [modelId]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || !threadId) return;
    setMsgs((prev) => [...prev, { id: `temp-${Date.now()}`, sender: "guest", text, created_at: new Date().toISOString() }]);
    setDraft("");
    const res = await sendMessageAction(threadId, text);
    if (res.message) {
      setMsgs((prev) =>
        prev.map((m) => (m.id === `temp-${Date.now()}` ? (res.message as unknown as Msg) : m))
      );
    }
  };

  const confirmBooking = async () => {
    if (!threadId) return;
    const res = await createBookingFromChatAction({
      modelId,
      sessionKey,
      city: "Machala", // TODO: usar ciudad real detectada del usuario.
      serviceDuration: "1h",
      meetingType,
      day,
      time: hour,
    });
    if (res.success) {
      setBookingMsg(`Reserva solicitada: ${day} · ${hour} · ${meetingType}`);
      setMsgs((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, sender: "guest", text: `Quiero reservar: ${day} a las ${hour} (${meetingType})`, created_at: new Date().toISOString() },
      ]);
      setAgendaOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080B] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
        <button onClick={() => router.push("/")} className="w-9 h-9 rounded-full flex items-center justify-center text-white/70" aria-label="Atrás">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-white truncate">Conversación privada</span>
            <BadgeCheck size={14} className="text-brand-gold shrink-0" />
          </div>
          <span className="font-mono text-[11px] text-brand-green">en línea</span>
        </div>
        <button
          onClick={() => setAgendaOpen(true)}
          className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-brand-gold shrink-0"
          aria-label="Agendar"
        >
          <CalendarPlus size={17} />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" ref={listRef}>
        {loading ? (
          <div className="flex justify-center py-10 text-white/40"><Loader2 className="animate-spin" /></div>
        ) : msgs.length === 0 ? (
          <p className="text-center text-white/40 text-sm py-8">
            Esta conversación es privada y se guarda en tu dispositivo. Escribe para agendar.
          </p>
        ) : (
          msgs.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "guest" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[14px] leading-[1.45] ${
                  m.sender === "guest"
                    ? "bg-brand-gold text-[#08080C] rounded-br-[4px]"
                    : "bg-white/[0.06] rounded-bl-[4px]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
        {bookingMsg && (
          <div className="flex justify-center">
            <span className="font-mono text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-3 py-1.5">
              <CalendarCheck size={12} className="inline mr-1" /> {bookingMsg}
            </span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.07]">
        <button
          onClick={() => setAgendaOpen(true)}
          className="w-11 h-11 rounded-xl bg-brand-gold text-[#08080B] flex items-center justify-center shrink-0"
          aria-label="Agendar"
        >
          <CalendarPlus size={18} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 text-sm text-white placeholder:text-white/35 outline-none"
          style={{ height: 46 }}
        />
        <button
          onClick={sendMessage}
          className="w-11 h-11 rounded-xl bg-brand-gold text-[#08080B] flex items-center justify-center shrink-0"
          aria-label="Enviar"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Agenda / reserva */}
      {agendaOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end" onClick={() => setAgendaOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#101014] rounded-t-[22px] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-white">Agendar encuentro</span>
              <button onClick={() => setAgendaOpen(false)} aria-label="Cerrar" className="text-white/60"><X size={20} /></button>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/45">Día</span>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {DAYS.map((d) => (
                  <button key={d} onClick={() => setDay(d)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${day === d ? "bg-brand-gold text-[#08080B]" : "bg-white/[0.05] text-white/70"}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/45">Hora</span>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                {HOURS.map((h) => (
                  <button key={h} onClick={() => setHour(h)}
                    className={`py-2 rounded-xl text-xs font-bold ${hour === h ? "bg-brand-gold text-[#08080B]" : "bg-white/[0.05] text-white/70"}`}>{h}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/45">Encuentro</span>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {MEETING_TYPES.map((t) => (
                  <button key={t} onClick={() => setMeetingType(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${meetingType === t ? "bg-brand-gold text-[#08080B]" : "bg-white/[0.05] text-white/70"}`}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={confirmBooking} className="btn-gold w-full" style={{ minHeight: 52 }}>Confirmar reserva</button>
          </div>
        </div>
      )}
    </div>
  );
}
