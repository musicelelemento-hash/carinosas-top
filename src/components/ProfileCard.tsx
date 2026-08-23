"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, BadgeCheck, Navigation } from "lucide-react";
import WhatsAppTransition from "./WhatsAppTransition";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/soundEngine";

interface ProfileCardProps {
  id?: string;
  name: string;
  age: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  isVip?: boolean;
  isBoosted?: boolean;
  sector?: string | null;
  whatsapp?: string;
  tags?: string[] | null;
  plan_type?: string;
  personal_note?: string;
  is_verified_4k?: boolean;
  /** 'grid' = tarjeta densa del Terminal desktop (aspect 4/5). 'feed' = tarjeta ancha del feed mobile (altura fija 296px), calcada de feedCard() del mockup. */
  layout?: "grid" | "feed";
  status?: string;
}

export default function ProfileCard({
  id, name, age, location, imageUrl, images,
  isBoosted = false, whatsapp,
  is_verified_4k = false,
  layout = "grid",
  status = "En línea",
}: ProfileCardProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFeed = layout === "feed";

  const cover = images?.[0] || imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800';

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playGoldChime();
    setIsTransitioning(true);
    if (whatsapp) {
      const phone = whatsapp.replace(/\D/g, '');
      const fullPhone = phone.startsWith('593') ? phone : `593${phone.replace(/^0/, '')}`;
      setTimeout(() => {
        window.open(`https://wa.me/${fullPhone}?text=Hola%20${encodeURIComponent(name)}%2C%20vi%20tu%20perfil%20en%20Cari%C3%B1osas.top`, '_blank');
        setIsTransitioning(false);
      }, 1100);
    } else {
      setTimeout(() => setIsTransitioning(false), 1500);
    }
  };

  return (
    <>
      <div
        onClick={() => router.push(`/profile/${id}`)}
        className={`overflow-hidden border border-white/[0.07] bg-[#101014] cursor-pointer group ${isFeed ? "rounded-[20px]" : "rounded-2xl"}`}
      >
        <div
          className={`relative overflow-hidden ${isFeed ? "" : "aspect-[4/5]"}`}
          style={isFeed ? { height: 296 } : undefined}
        >
          <Image
            src={cover}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isFeed
                ? "linear-gradient(to top, rgba(16,16,20,.94) 0%, rgba(16,16,20,.4) 28%, transparent 55%)"
                : "linear-gradient(to top, rgba(10,10,13,.92) 0%, rgba(10,10,13,.45) 30%, transparent 60%)",
            }}
          />

          {isBoosted && (
            <span
              className={`absolute font-mono font-bold ${isFeed ? "top-3 left-3 px-2.5 py-[6px] rounded-lg text-xs" : "top-3 left-3 px-2.5 py-[5px] rounded-md text-[11px] tracking-[0.08em]"}`}
              style={{ background: "rgba(212,168,67,.94)", color: "#08080C" }}
            >
              TOP
            </span>
          )}

          <span
            className={`absolute flex items-center gap-1.5 font-mono text-white ${isFeed ? "top-3 right-3 px-2.5 py-[6px] rounded-lg text-xs backdrop-blur-md" : "top-3 right-3 px-2.5 py-[5px] rounded-md text-[11px] backdrop-blur-md"}`}
            style={{ background: isFeed ? "rgba(8,8,11,.7)" : "rgba(10,10,13,.72)" }}
          >
            <Navigation size={isFeed ? 12 : 11} className="text-brand-gold" />
            Cerca
          </span>

          <div className={`absolute flex flex-col gap-1.5 ${isFeed ? "left-4 right-4 bottom-3.5" : "left-3.5 right-3.5 bottom-3"}`}>
            <div className="flex items-baseline gap-2">
              <span className={`font-serif font-bold leading-none text-white ${isFeed ? "text-[28px]" : "text-[26px]"}`}>{name}</span>
              <span className={isFeed ? "text-[15px] text-white/60" : "text-sm text-white/60"}>{age}</span>
              {is_verified_4k && <BadgeCheck size={isFeed ? 17 : 15} className="text-brand-gold" />}
            </div>
            <span className="text-[13px] text-white/[0.62]">{location}</span>
          </div>
        </div>

        <div className="px-3.5 py-3 flex items-center justify-between border-t border-white/[0.06]">
          <span className={`font-mono ${isFeed ? "text-xs text-white/45" : "text-[11px] text-white/[0.42]"}`}>{status}</span>
          <button
            onClick={handleContact}
            className={`flex items-center font-bold transition-all ${
              isFeed ? "gap-2 px-4 py-[11px] rounded-xl text-sm" : "gap-[7px] px-3.5 py-[9px] rounded-[9px] text-[13px]"
            } ${
              isBoosted
                ? "bg-brand-gold text-brand-black border border-brand-gold hover:brightness-110"
                : "bg-transparent text-white border border-white/[0.14] hover:border-brand-gold/40"
            }`}
            style={isFeed ? { minHeight: 44 } : undefined}
          >
            <MessageCircle size={isFeed ? 15 : 14} />
            Escribir
          </button>
        </div>
      </div>

      <WhatsAppTransition
        modelName={name}
        isOpen={isTransitioning}
        onComplete={() => setIsTransitioning(false)}
      />
    </>
  );
}
