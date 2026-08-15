"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Crown, ShieldCheck, Sparkles, MessageCircle, Star, MapPin, Eye, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import VIPCheckoutModal from "./VIPCheckoutModal";

interface HiddenModel {
  id: string;
  codename: string;
  age: number;
  city: string;
  category: "Universitaria VIP" | "Alta Sociedad" | "Gira Internacional" | "Modelo de Pasarela";
  rate: string;
  blurImage: string;
  tags: string[];
  bio: string;
}

const HIDDEN_MODELS: HiddenModel[] = [
  {
    id: "hidden-1",
    codename: "Muse Alpha · 'S'",
    age: 23,
    city: "Quito (Cumbayá Privado)",
    category: "Alta Sociedad",
    rate: "$250/h",
    blurImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    tags: ["Solo Hoteles 5★", "Cena de Gala", "Discreción Máxima"],
    bio: "Perfil no público. Atiende exclusivamente a caballeros con verificación VIP previa."
  },
  {
    id: "hidden-2",
    codename: "Muse Alpha · 'V'",
    age: 22,
    city: "Guayaquil (Samborondón)",
    category: "Universitaria VIP",
    rate: "$220/h",
    blurImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    tags: ["Estudiante", "Sutil", "Trato de Pareja"],
    bio: "Exclusiva para socios del círculo cerrado. Sin presencia en redes sociales públicas."
  },
  {
    id: "hidden-3",
    codename: "Muse Alpha · 'M'",
    age: 24,
    city: "Medellín (El Poblado) / Giras",
    category: "Gira Internacional",
    rate: "$300/h",
    blurImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    tags: ["Giras VIP", "Yates & Eventos", "Bilingüe"],
    bio: "Disponible para viajes y eventos de negocios de alto nivel."
  }
];

export default function HiddenModelsLounge() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-obsidian border border-brand-gold/40 text-brand-gold text-[9px] font-black uppercase tracking-[0.35em] shadow-[0_0_25px_rgba(212,168,67,0.2)]">
          <Lock size={12} />
          <span>Directorio Oculto No Público</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white italic tracking-tight">
          Modelos <span className="text-gold-shimmer">Alpha Secretas</span>
        </h2>

        <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
          Acompañantes de alta sociedad y universitarias que no aparecen en el catálogo abierto. Su identidad está blindada y solo atienden a miembros VIP comprobados.
        </p>
      </div>

      {/* Grid of Frosted Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {HIDDEN_MODELS.map((model, idx) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative rounded-[2.5rem] overflow-hidden glass-obsidian border border-brand-gold/30 p-6 flex flex-col justify-between space-y-6 shadow-2xl hover:border-brand-gold transition-colors"
          >
            {/* Top Tag & Code */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[8px] px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold font-mono font-bold uppercase tracking-wider border border-brand-gold/30">
                {model.category}
              </span>
              <span className="text-[10px] text-white/40 font-mono">ID: SEC-{idx + 1}</span>
            </div>

            {/* Blurred Image Showcase */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 my-2">
              <Image
                src={model.blurImage}
                alt="Hidden Model"
                fill
                className="object-cover blur-lg scale-110 brightness-50"
              />
              <div className="absolute inset-0 bg-brand-gold/10 backdrop-blur-md" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center z-10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-[0_0_20px_rgba(212,168,67,0.4)]">
                  <Lock size={20} />
                </div>
                <span className="text-xs font-serif font-bold text-white italic">{model.codename}</span>
                <span className="text-[9px] text-brand-gold font-mono">{model.rate}</span>
              </div>
            </div>

            {/* Location & Tags */}
            <div className="space-y-3 z-10">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <MapPin size={13} className="text-brand-gold" />
                <span>{model.city}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {model.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-[8px] text-white/50 bg-white/5 border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Unlock Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-black border border-brand-gold/40 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <Crown size={14} />
              <span>Desbloquear con Pase Alpha</span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Checkout Modal */}
      <VIPCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName="Pase Alpha Founder"
        planPrice={49}
      />

    </section>
  );
}
