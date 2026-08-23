"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Radar, ChevronRight, MessageCircle, BadgeCheck } from "lucide-react";
import ProfileCard from "./ProfileCard";

interface FeedModel {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  isBoosted?: boolean;
  is_verified_4k?: boolean;
  whatsapp?: string;
  sector?: string | null;
  tags?: string[] | null;
  plan_type?: string;
  personal_note?: string;
}

interface MobileHomeFeedProps {
  models: FeedModel[];
}

const CHIPS = [
  { id: "cerca", label: "Cerca" },
  { id: "online", label: "En línea" },
  { id: "nuevas", label: "Nuevas" },
  { id: "hoy", label: "Hoy" },
] as const;

/** Recreación mobile-first exacta de screenHome del mockup: chips + feed de tarjetas anchas + teaser de radar + fila de contacto. */
export default function MobileHomeFeed({ models }: MobileHomeFeedProps) {
  const router = useRouter();
  const [chip, setChip] = useState<(typeof CHIPS)[number]["id"]>("cerca");
  const second = models[1];

  return (
    <div className="lg:hidden flex flex-col">
      {/* Chips — calcado de chip() del mockup */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" style={{ padding: "0 20px 12px" }}>
        {CHIPS.map((c) => (
          <button
            key={c.id}
            onClick={() => setChip(c.id)}
            className="shrink-0 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors"
            style={{
              padding: "9px 14px",
              background: chip === c.id ? "#D4A843" : "rgba(255,255,255,.05)",
              color: chip === c.id ? "#08080C" : "rgba(240,240,236,.7)",
              border: `1px solid ${chip === c.id ? "#D4A843" : "rgba(255,255,255,.1)"}`,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Feed — calcado de feedCard() del mockup, con teaser de radar y fila de contacto rápido tras la primera tarjeta */}
      <div className="flex flex-col gap-3.5" style={{ padding: "0 20px 24px" }}>
        {models.map((m, i) => (
          <React.Fragment key={m.id}>
            <ProfileCard {...m} layout="feed" />

            {i === 0 && (
              <button
                onClick={() => router.push("/radar")}
                className="flex items-center gap-3 text-left rounded-2xl cursor-pointer"
                style={{ padding: 14, border: "1px solid rgba(212,168,67,.24)", background: "rgba(212,168,67,.06)" }}
              >
                <Radar size={20} className="text-brand-gold shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white">{models.length} disponibles a menos de 5 km</span>
                  <span className="text-xs text-white/50">Abrir el radar</span>
                </div>
                <ChevronRight size={18} className="text-white/40 shrink-0" />
              </button>
            )}

            {i === 0 && second && (
              <div
                className="flex items-center gap-3 rounded-2xl"
                style={{ padding: 12, background: "#101014", border: "1px solid rgba(255,255,255,.07)" }}
              >
                <div className="relative w-[54px] h-[54px] rounded-xl overflow-hidden shrink-0 bg-[#08080C]">
                  <Image
                    src={second.images?.[0] || second.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"}
                    alt={second.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-bold text-white truncate">{second.name}, {second.age}</span>
                    {second.is_verified_4k && <BadgeCheck size={15} className="text-brand-gold shrink-0" />}
                  </div>
                  <span className="text-xs text-white/50 truncate">{second.sector || second.location} · en línea</span>
                </div>
                <a
                  href={second.whatsapp ? `https://wa.me/${second.whatsapp.replace(/\D/g, "")}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-11 h-11 rounded-xl border border-white/[0.14] flex items-center justify-center shrink-0"
                >
                  <MessageCircle size={17} className="text-white" />
                </a>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
