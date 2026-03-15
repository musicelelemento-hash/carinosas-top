"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, Send, Bot, User } from "lucide-react";
import { StitchEngine } from "@/lib/stitch";

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function AvailabilityChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '¡Hola! Soy el asistente VIP de Cariñosas.top. ¿Deseas consultar la disponibilidad de una modelo ahora?' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate Stitch AI Response
    setTimeout(() => {
      let response = "La modelo está actualmente activa y disponible. Para una respuesta inmediata, te sugiero contactarla por WhatsApp presionando su botón dorado.";
      
      if (input.toLowerCase().includes("norte") || input.toLowerCase().includes("quito")) {
        response = "Confirmado. Hay disponibilidad en el sector Norte de Quito ahora mismo. ¿Deseas el link directo de WhatsApp?";
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-brand-gold text-brand-black rounded-full shadow-gold flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        {isOpen ? <Sparkles size={24} className="animate-spin-slow" /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[350px] h-[450px] glass-dark rounded-3xl border border-brand-gold/30 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
          {/* Header */}
          <div className="p-4 border-b border-brand-gold/20 flex items-center gap-3 bg-brand-gold/5">
            <div className="w-2 h-2 bg-brand-pink rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Disponibilidad Live</span>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-pink text-white rounded-tr-none' 
                    : 'bg-white/5 text-brand-white border border-white/10 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-brand-gold/20">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunta por disponibilidad..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 pr-12 text-sm text-brand-white focus:border-brand-gold outline-none transition-colors"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1.5 p-2 text-brand-gold hover:text-brand-pink transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
