"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Crown, 
  ShieldCheck, 
  Send, 
  Mic, 
  Sparkles, 
  ArrowLeft, 
  Lock, 
  CheckCheck, 
  MapPin, 
  Star, 
  MessageCircle, 
  AlertTriangle,
  Flame,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { sound } from "@/lib/soundEngine";
import { trackEvent } from "@/lib/track";

interface AssistantModel {
  id: string;
  name: string;
  city: string;
  sector?: string;
  plan_type?: string;
  age?: number;
  imageUrl: string;
  is_verified_4k?: boolean;
  rate?: string;
  whatsapp?: string;
}

interface Message {
  id: string;
  sender: "concierge" | "user";
  text: string;
  timestamp: string;
  models?: AssistantModel[];
  modelCard?: {
    name: string;
    city: string;
    sector: string;
    rate: string;
    imageUrl: string;
    isVerified: boolean;
    whatsapp: string;
  };
}

export default function ConciergeChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "concierge",
      text: "Buenas noches, distinguido caballero. Soy su Concierge Privado de Cariñosas.top. ¿En qué ciudad de Ecuador o qué tipo de acompañamiento exclusivo desea coordinar hoy?",
      timestamp: "Ahora"
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isTyping) return;

    // Demanda: primer mensaje real del usuario al concierge (una vez por sesión).
    try {
      if (!sessionStorage.getItem("concierge_started_seen")) {
        sessionStorage.setItem("concierge_started_seen", "1");
        trackEvent("concierge_chat_started", { city: "via_concierge" });
      }
    } catch {}

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: "Ahora"
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);
    sound.playSubtleClick();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();
      sound.playGoldChime();
      setIsTyping(false);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "concierge",
        text: data.reply || "He procesado su solicitud con máxima discreción.",
        timestamp: "Ahora",
        models: data.models || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "concierge",
          text: "He tenido una pequeña demora en la conexión satelital segura. Cuénteme su preferencia y con gusto le asistiré de inmediato.",
          timestamp: "Ahora"
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white pt-20 pb-28 md:pb-12 noise-overlay flex flex-col justify-between">
      <div className="max-w-3xl mx-auto px-4 w-full flex-1 flex flex-col">

        {/* ── TOP CONCIERGE HEADER BAR ── */}
        <div className="glass-obsidian border border-brand-gold/30 rounded-3xl p-4 sm:p-5 mb-4 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-gold via-[#FFE088] to-brand-gold p-0.5 shadow-[0_0_20px_rgba(212,168,67,0.4)]">
                <div className="w-full h-full rounded-full bg-[#141419] flex items-center justify-center text-brand-gold">
                  <Crown size={22} className="animate-pulse" />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#08080C] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-base sm:text-lg font-bold text-white">Concierge VIP Élite</h1>
                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-brand-gold text-brand-black uppercase">
                  24/7
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <Lock size={10} /> Privacidad y Discreción Total · Canal Directo
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "https://www.google.com";
              }
            }}
            className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-black uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle size={11} />
            <span>Pánico (ESC)</span>
          </button>
        </div>

        {/* ── SECURITY NOTICE BANNER ── */}
        <div className="p-3 rounded-2xl glass-dark border border-white/10 text-center mb-4 text-[10px] text-[#A1A1AA] font-mono flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-brand-gold" />
          <span>Sesión Encriptada Confidencial · Los mensajes se auto-destruyen en 24 horas.</span>
        </div>

        {/* ── QUICK ACTION CHIPS ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-2">
          {[
            "📍 Machala VIP (Hotel Oro Verde)",
            "🥂 Cena Ejecutiva",
            "👑 Acompañante Diamante",
            "🔞 Acceso Bóveda 4K",
            "📍 Guayaquil Samborondón"
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full glass-obsidian border border-brand-gold/30 hover:border-brand-gold text-[10px] text-brand-gold/90 font-bold uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── CHAT MESSAGES CONTAINER ── */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 min-h-[350px] custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs leading-relaxed space-y-3 ${
                  msg.sender === "user"
                    ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-white rounded-br-none shadow-[0_5px_25px_rgba(212,168,67,0.2)]"
                    : "bg-[#18181B] border border-white/15 text-zinc-100 shadow-xl rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>

                {/* Dynamic Models Recommendation Cards */}
                {msg.models && msg.models.length > 0 && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-brand-gold block">
                      Modelos recomendadas en vivo:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.models.map((model) => (
                        <div key={model.id} className="rounded-2xl overflow-hidden glass-dark border border-brand-gold/30 p-2.5 text-white space-y-2 bg-black/60 hover:border-brand-gold transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-brand-gold/40">
                              <Image
                                src={model.imageUrl}
                                alt={model.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-serif font-bold text-xs text-white truncate">{model.name}</span>
                                {model.is_verified_4k && (
                                  <span className="text-[8px] bg-brand-gold text-brand-black px-1.5 py-0.2 rounded font-black">4K</span>
                                )}
                              </div>
                              <span className="text-[9px] text-[#A1A1AA] block truncate">{model.sector || model.city}</span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 pt-1">
                            <Link
                              href={`/profile/${model.id}`}
                              className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold text-center transition-colors"
                            >
                              Ver Perfil
                            </Link>
                            <a
                              href={`https://wa.me/${model.whatsapp || '593987654321'}?text=${encodeURIComponent(`Hola ${model.name}, te vi recomendada por el Concierge VIP de Cariñosas.top y deseo coordinar una reserva.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 rounded-lg bg-brand-gold hover:bg-white text-brand-black text-[9px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                            >
                              <MessageCircle size={10} fill="currentColor" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy single modelCard fallback */}
                {msg.modelCard && (
                  <div className="rounded-2xl overflow-hidden glass-dark border border-brand-gold/40 p-3 text-white space-y-3 mt-2 bg-black/60">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-brand-gold/40">
                        <Image
                          src={msg.modelCard.imageUrl}
                          alt={msg.modelCard.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-white">{msg.modelCard.name}</span>
                          <span className="font-serif font-bold text-brand-gold text-xs">{msg.modelCard.rate}</span>
                        </div>
                        <span className="text-[10px] text-[#A1A1AA] block">{msg.modelCard.sector} · {msg.modelCard.city}</span>
                        <div className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={9} /> Disponibilidad Confirmada
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${msg.modelCard.whatsapp}?text=${encodeURIComponent(`Hola ${msg.modelCard.name}, el Concierge VIP de Cariñosas.top me confirmó tu disponibilidad para coordinar un encuentro exclusivo.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-white text-brand-black text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle size={13} fill="currentColor" />
                      <span>Coordinar Llegada Discreta</span>
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[9px] text-[#A1A1AA] font-mono">
                  <span>{msg.timestamp}</span>
                  <CheckCheck size={12} className="text-brand-gold" />
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-brand-gold/80 text-[10px] font-mono px-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:0.4s]" />
              <span>Concierge escribiendo respuesta confidencial...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── MESSAGE INPUT FORM ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="glass-obsidian border border-brand-gold/40 rounded-full p-2 pl-5 flex items-center gap-2 shadow-2xl mt-2"
        >
          <input
            type="text"
            placeholder="Escribe tu solicitud confidencial (ej. Machala, Guayaquil, Suite 5★)..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-[#A1A1AA]"
          />

          <button
            type="button"
            className="w-10 h-10 rounded-full glass-dark border border-white/10 text-[#A1A1AA] hover:text-brand-gold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Mic size={16} />
          </button>

          <button
            type="submit"
            className="w-11 h-11 rounded-full bg-brand-gold hover:bg-white text-brand-black flex items-center justify-center transition-all shadow-[0_0_20px_rgba(212,168,67,0.4)] shrink-0 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
