"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Sparkles, Key, Crown, ShieldAlert, ArrowRight } from "lucide-react";
import VIPCheckoutModal from "./VIPCheckoutModal";

interface VaultItem {
  id: string;
  modelName: string;
  city: string;
  country: string;
  itemType: "video_4k" | "photo_set" | "backstage";
  title: string;
  previewImageUrl: string;
  viewsCount: number;
  badge: string;
}

const SAMPLE_VAULT_ITEMS: VaultItem[] = [
  {
    id: "vault-1",
    modelName: "Mariana",
    city: "Medellín",
    country: "🇨🇴 Colombia",
    itemType: "video_4k",
    title: "Sesión Privada Suite Provenza 4K",
    previewImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    viewsCount: 342,
    badge: "Exclusivo VIP"
  },
  {
    id: "vault-2",
    modelName: "Valentina",
    city: "Quito",
    country: "🇪🇨 Ecuador",
    itemType: "photo_set",
    title: "Book Íntimo Lencería de Seda 4K",
    previewImageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    viewsCount: 520,
    badge: "Bóveda Oro"
  },
  {
    id: "vault-3",
    modelName: "Valeria",
    city: "Ciudad de Panamá",
    country: "🇵🇦 Panamá",
    itemType: "video_4k",
    title: "Paseo Privado en Yate Punta Pacífica",
    previewImageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    viewsCount: 289,
    badge: "Ultra Exclusivo"
  },
  {
    id: "vault-4",
    modelName: "Fiorella",
    city: "Lima",
    country: "🇵🇪 Perú",
    itemType: "backstage",
    title: "Backstage Suite San Isidro 4K",
    previewImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    viewsCount: 415,
    badge: "Bóveda Secreta"
  }
];

export default function SecretVaultTeaser() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedVaultItem, setSelectedVaultItem] = useState<VaultItem | null>(null);

  const handleUnlock = (item: VaultItem) => {
    setSelectedVaultItem(item);
    setIsCheckoutOpen(true);
  };

  return (
    <section id="boveda-vip" className="py-20 px-4 md:px-12 max-w-[1700px] mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">
          <Lock size={12} />
          <span>Acceso Restringido · Pase Alpha</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif text-white italic">
          Bóveda Secreta <span className="text-brand-gold">4K Ultra HD</span>
        </h2>

        <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light">
          Contenido íntimo y exclusivo reservado únicamente para caballeros con Membresía VIP Alpha verificada.
        </p>
      </div>

      {/* Grid of Frosted Vault Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SAMPLE_VAULT_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleUnlock(item)}
            className="group relative rounded-3xl overflow-hidden glass-obsidian border border-brand-gold/25 aspect-[3/4] cursor-pointer shadow-2xl transition-all duration-500 hover:border-brand-gold hover:scale-[1.02]"
          >
            {/* Background Image with Liquid Glass Blur */}
            <Image
              src={item.previewImageUrl}
              alt={item.title}
              fill
              className="object-cover filter blur-[18px] scale-110 opacity-70 group-hover:opacity-85 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 25vw"
            />

            {/* Dark Smoked Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold backdrop-blur-md">
                {item.badge}
              </span>
              <span className="text-[9px] text-white/60 font-bold backdrop-blur-md px-2.5 py-1 rounded-full bg-black/40">
                {item.country}
              </span>
            </div>

            {/* Center Lock Hologram */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-[0_0_30px_rgba(212,168,67,0.35)] group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-500">
                <Lock size={26} className="fill-current" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">
                  {item.modelName} · {item.city}
                </span>
                <h4 className="text-base font-serif text-white font-bold leading-snug">
                  {item.title}
                </h4>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-black font-black text-[10px] uppercase tracking-widest shadow-lg group-hover:bg-white transition-all flex items-center gap-2"
              >
                <Key size={13} />
                <span>Desbloquear con Pase</span>
              </button>
            </div>

            {/* Bottom Views */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[9px] text-white/40 z-10 border-t border-white/10 pt-2">
              <span>{item.viewsCount} visualizaciones</span>
              <span className="text-brand-gold font-bold flex items-center gap-1">
                <Sparkles size={11} /> 4K Nativo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* VIP Checkout Modal integration */}
      <VIPCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName="Pase Diamante Bóveda 4K"
        planPrice="$80 USD"
      />
    </section>
  );
}
