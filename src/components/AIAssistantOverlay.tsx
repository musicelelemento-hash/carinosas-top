"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, X, Send, Loader2, MessageCircle, ShieldCheck, Zap, Bot, Star, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/soundEngine";

interface AssistantModel {
  id: string;
  name: string;
  city: string;
  sector?: string;
  plan_type?: string;
  age?: number;
  imageUrl: string;
  is_verified_4k?: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  models?: AssistantModel[];
}

const PREFERENCE_CHIPS = [
  { label: "📍 Quito", query: "Quito" },
  { label: "📍 Guayaquil", query: "Guayaquil" },
  { label: "📍 Cuenca", query: "Cuenca" },
  { label: "📍 Manta", query: "Manta" },
  { label: "📍 Medellín", query: "Medellín" },
  { label: "📍 Lima", query: "Lima" },
  { label: "📍 Miami", query: "Miami" },
  { label: "🥂 Cena VIP", query: "Cena VIP" },
  { label: "💆‍♀️ Masaje Relax", query: "Masaje relax" },
  { label: "🏨 Hotel 5★", query: "Hotel 5 estrellas" },
  { label: "💎 VIP Elite", query: "VIP Elite verificadas" },
];

export default function AIAssistantOverlay() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bienvenido al Círculo Privado de Cariñosas.top. Soy tu Concierge VIP con Inteligencia Artificial. ¿En qué ciudad o qué tipo de compañía exclusiva buscas hoy?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage = queryText.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      sound.playGoldChime();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply, models: data.models }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Disculpa, hubo una interrupción con el satélite de concierge. ¿Podrías reintentar tu búsqueda?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendQuery(input);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const handleWhatsAppConcierge = () => {
    sound.playGoldChime();
    const text = encodeURIComponent("Hola Concierge VIP de Cariñosas.top, deseo asistencia personalizada para una reserva exclusiva.");
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          sound.playSubtleClick();
          setIsOpen(true);
        }}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-[100] group flex items-center gap-3 bg-brand-gold text-brand-black px-5 sm:px-6 py-3.5 sm:py-4 rounded-full font-black text-[10px] uppercase tracking-[0.25em] shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all duration-500 border border-white/20"
      >
        <div className="relative">
          <Sparkles size={16} className="animate-pulse" />
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
        </div>
        <span className="font-serif italic text-xs tracking-normal">Concierge VIP IA</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] z-[100] animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="glass-obsidian rounded-[2.5rem] overflow-hidden border border-brand-gold/40 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col h-[580px]">
        
        {/* Obsidian Elite Concierge Header with Glowing Holographic Orb */}
        <div className="p-5 bg-gradient-to-b from-[#141419] to-[#0a0a0e] border-b border-brand-gold/20 flex justify-between items-center relative overflow-hidden">
          <div className="flex items-center gap-3.5 relative z-10">
            {/* Holographic AI Orb */}
            <div className="relative w-12 h-12 rounded-2xl bg-brand-black border border-brand-gold/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,168,67,0.3)]">
              <div className="absolute inset-1 rounded-xl bg-gradient-to-tr from-brand-gold/30 via-transparent to-brand-pink/20 animate-pulse" />
              <Bot size={22} className="text-brand-gold relative z-10" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-serif text-white italic font-bold">Concierge VIP IA</h4>
                <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-brand-gold text-brand-black font-black uppercase tracking-wider">
                  MATCHMAKER
                </span>
              </div>
              <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-0.5">
                Círculo Exclusivo Ecuador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative z-10">
            <button
              onClick={handleWhatsAppConcierge}
              className="p-2 rounded-xl bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-brand-black transition-all"
              title="Atención Humana por WhatsApp"
            >
              <MessageCircle size={16} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Background subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Preference Filter Chips */}
        <div className="px-4 py-2.5 bg-[#0a0a0e]/60 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
          {PREFERENCE_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => sendQuery(chip.query)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider glass-dark border border-brand-gold/20 text-white/70 hover:text-brand-gold hover:border-brand-gold transition-all active:scale-95 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Conversation Area */}
        <div 
          ref={scrollRef}
          className="flex-1 p-5 overflow-y-auto space-y-4 bg-black/40 scroll-smooth custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "assistant" ? "items-start" : "items-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`p-4 rounded-2xl border ${
                msg.role === "assistant" 
                  ? "glass-obsidian rounded-tl-none border-brand-gold/20 max-w-[90%]" 
                  : "bg-brand-gold text-brand-black rounded-tr-none border-brand-gold max-w-[85%] font-medium"
              }`}>
                <p className={`text-xs leading-relaxed ${msg.role === "assistant" ? "text-white/90 font-serif italic" : "text-brand-black text-xs font-sans font-semibold"}`}>
                  {msg.content}
                </p>
              </div>
              
              {/* Elite Match Cards Carousel */}
              {msg.role === "assistant" && msg.models && msg.models.length > 0 && (
                <div className="w-full mt-3 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {msg.models.map((model: AssistantModel, idx) => (
                    <div
                      key={model.id}
                      className="flex-shrink-0 w-48 p-3 glass-obsidian border border-brand-gold/30 rounded-2xl flex flex-col gap-2.5 group hover:border-brand-gold transition-all shadow-xl"
                    >
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                        <Image 
                          src={model.imageUrl} 
                          alt={model.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {/* 98% Match Gold Badge */}
                        <div className="absolute top-2 left-2 bg-brand-gold text-brand-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5 shadow-md">
                          <Star size={9} fill="currentColor" />
                          {98 - idx * 2}% Match
                        </div>
                        {model.is_verified_4k && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <ShieldCheck size={10} /> 4K
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-serif font-bold text-white group-hover:text-brand-gold transition-colors">{model.name}</h5>
                          {model.age && <span className="text-[9px] text-white/50">{model.age} Años</span>}
                        </div>
                        <p className="text-[9px] text-white/40 uppercase tracking-wider flex items-center gap-1 truncate">
                          <MapPin size={9} className="text-brand-gold/60 flex-shrink-0" />
                          {model.sector || model.city}
                        </p>
                      </div>

                      <div className="flex gap-1.5 pt-1 border-t border-white/10">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push(`/profile/${model.id}`);
                          }}
                          className="flex-1 py-1.5 rounded-xl border border-white/20 text-white hover:border-brand-gold hover:text-brand-gold text-[9px] font-black uppercase tracking-wider transition-all"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="glass-obsidian p-4 rounded-2xl rounded-tl-none border-brand-gold/20 flex gap-2.5 items-center">
                <Loader2 size={14} className="animate-spin text-brand-gold" />
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">
                  Analizando compatibilidad con modelos 4K...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input & WhatsApp Concierge Footer */}
        <div className="p-4 bg-[#0a0a0e] border-t border-brand-gold/20 space-y-2">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="¿Qué tipo de compañía buscas hoy?..."
              className="w-full bg-black/60 border border-brand-gold/25 rounded-full py-3.5 pl-5 pr-14 text-xs text-white placeholder:text-white/30 focus:border-brand-gold outline-none transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-gold text-brand-black p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-40 disabled:scale-100"
            >
              <Send size={13} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

