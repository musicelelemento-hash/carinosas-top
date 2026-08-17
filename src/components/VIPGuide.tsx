"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  HelpCircle, 
  Hotel, 
  EyeOff, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles, 
  Lock, 
  MessageSquare,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/soundEngine";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "¿Cómo se garantiza que mi visita o llamada sea 100% privada?",
    a: "Cariñosas.top no almacena registros de navegación ni cookies de rastreo comercial. La plataforma cuenta con protocolos avanzados de privacidad y discreción total, y todas las conversaciones se canalizan directamente a WhatsApp sin intermediarios ni bases de datos de terceros."
  },
  {
    q: "¿Cómo reservar una suite o habitación en un Hotel 5★ con discreción?",
    a: "Recomendamos reservar la habitación con antelación a tu nombre o solicitar a la modelo que te indique el punto de encuentro en recepción. La mayoría de modelos élite están acostumbradas a ingresar a hoteles como Swissôtel, Marriott, Oro Verde o Sheraton sin levantar preguntas."
  },
  {
    q: "¿Cómo distingo un perfil auténtico de una posible copia?",
    a: "Exige siempre el sello '4K VERIFIED' y escucha la nota de voz original grabada por la modelo en su perfil. Todas las modelos con Pase Alpha han validado su cédula de identidad y sesión fotográfica con nuestro equipo."
  },
  {
    q: "¿Qué sucede si necesito cancelar o reprogramar una cita?",
    a: "Comunícate con al menos 2 horas de anticipación directamente por WhatsApp para mantener tu estatus de Caballero VIP de buena reputación en la plataforma."
  }
];

export default function VIPGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-24 px-5 sm:px-6 relative bg-[#08080C] overflow-hidden" id="vip-guide">
      
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">

        {/* ── HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-obsidian border border-brand-gold/30 text-brand-gold">
            <ShieldCheck size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.35em]">Protocolo de Excelencia & Privacidad</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white italic tracking-tight">
            Guía de Citas VIP & <span className="bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent">Discreción Total</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-serif italic max-w-xl mx-auto">
            Consejos de etiqueta, seguridad hotelera y verificación para una experiencia sin contratiempos en Ecuador.
          </p>
        </motion.div>

        {/* ── 3 PROTOCOL PILLARS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="glass-obsidian p-8 rounded-[2.5rem] border border-white/10 hover:border-brand-gold/40 transition-colors space-y-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
              <Hotel size={26} />
            </div>
            <h3 className="text-xl font-serif text-white italic font-bold">1. Protocolo Hoteles 5★</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Selecciona hoteles con parqueadero subterráneo y ascensores discretos (ej. Swissôtel Quito, Oro Verde Guayaquil o Cumbayá Suites). Consulta tarifas y amenidades previas.
            </p>
            <div className="text-[9px] text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <CheckCircle2 size={12} /> Máxima Privacidad
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="glass-obsidian p-8 rounded-[2.5rem] border border-white/10 hover:border-brand-gold/40 transition-colors space-y-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-pink/15 border border-brand-pink/40 flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform">
              <Volume2 size={26} />
            </div>
            <h3 className="text-xl font-serif text-white italic font-bold">2. Validación Anti-Fraude</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Comprueba el sello <strong>4K Verified</strong> y reproduce la nota de voz oficial en su perfil. Nunca envíes anticipos a perfiles sin verificación comprobada en la web.
            </p>
            <div className="text-[9px] text-brand-pink font-bold uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <CheckCircle2 size={12} /> 100% Cero Suplantación
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="glass-obsidian p-8 rounded-[2.5rem] border border-white/10 hover:border-brand-gold/40 transition-colors space-y-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
              <EyeOff size={26} />
            </div>
            <h3 className="text-xl font-serif text-white italic font-bold">3. Cero Huella Digital</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Utiliza el <strong>Modo Camuflaje</strong> instalando la PWA como aplicación meteorológica o de notas, y aprovecha el atajo de emergencia (Doble `Esc`) en caso de necesitar salir.
            </p>
            <div className="text-[9px] text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <CheckCircle2 size={12} /> Blindaje Total
            </div>
          </motion.div>

        </div>

        {/* ── INTERACTIVE FAQ ACCORDION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-obsidian border border-brand-gold/30 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-3">
            <HelpCircle size={24} className="text-brand-gold" />
            <div>
              <h3 className="text-2xl font-serif text-white italic font-bold">Preguntas Frecuentes Confidenciales</h3>
              <p className="text-xs text-white/50">Resolviendo inquietudes para un acceso sin riesgos.</p>
            </div>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    sound.playSubtleClick();
                    setOpenFaq(openFaq === idx ? null : idx);
                  }}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <span className="font-serif text-sm md:text-base text-white group-hover:text-brand-gold transition-colors font-medium">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-brand-gold shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs text-white/60 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
