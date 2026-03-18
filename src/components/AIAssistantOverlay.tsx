"use client";

import React from "react";
import { Sparkles, X, MessageSquare, Send } from "lucide-react";

export default function AIAssistantOverlay() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-50 group flex items-center gap-3 bg-brand-gold text-brand-black px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all duration-500"
      >
        <Sparkles size={16} className="animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
          Asistente Élite
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[350px] z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="glass-premium rounded-[2rem] overflow-hidden border-brand-gold/30 shadow-2xl flex flex-col h-[500px]">
        {/* Header */}
        <div className="p-6 bg-brand-gold text-brand-black flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-black/10 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest">Concierge Élite</h4>
              <p className="text-[8px] font-bold uppercase tracking-tighter opacity-60">IA Personalizada</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-brand-black/10 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-brand-black/20">
          <div className="glass-dark p-4 rounded-2xl rounded-tl-none border-white/5 max-w-[85%]">
            <p className="text-[11px] text-white/80 leading-relaxed italic">
              "Bienvenido al círculo más exclusivo de Ecuador. ¿Buscas algo específico hoy? Puedo ayudarte a encontrar la compañía perfecta según tus preferencias."
            </p>
          </div>
          
          <div className="flex justify-end">
             <div className="bg-brand-gold/10 p-4 rounded-2xl rounded-tr-none border border-brand-gold/20 max-w-[85%]">
                <p className="text-[11px] text-brand-gold leading-relaxed">
                  Busco modelos VIP en Quito para esta noche.
                </p>
             </div>
          </div>

          <div className="glass-dark p-4 rounded-2xl rounded-tl-none border-white/5 max-w-[85%]">
            <p className="text-[11px] text-white/80 leading-relaxed italic">
              "Excelente elección. En Quito contamos con 12 modelos Élite Gold disponibles. ¿Prefieres alguna categoría en especial o te gustaría ver las más recomendadas?"
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-brand-black/40 border-t border-brand-gold/10">
          <div className="relative">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Habla con tu Concierge..."
              className="w-full bg-brand-black/40 border border-brand-gold/20 rounded-full py-4 pl-6 pr-14 text-xs text-white placeholder:text-white/20 focus:border-brand-gold/50 outline-none transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-gold text-brand-black p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
