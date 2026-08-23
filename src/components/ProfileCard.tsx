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
}

export default function ProfileCard({
  id, name, age, location, imageUrl, images,
  isBoosted = false, whatsapp,
  is_verified_4k = false
}: ProfileCardProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        className="rounded-2xl overflow-hidden border border-white/[0.07] bg-[#101014] cursor-pointer group"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={cover}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(10,10,13,.92) 0%, rgba(10,10,13,.45) 30%, transparent 60%)" }}
          />

          {isBoosted && (
            <span className="absolute top-3 left-3 px-2.5 py-[5px] rounded-md bg-[rgba(212,168,67,.92)] text-[#08080C] font-mono text-[11px] font-bold tracking-[0.08em]">
              TOP
            </span>
          )}

          <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-[5px] rounded-md bg-[rgba(10,10,13,.72)] backdrop-blur-md font-mono text-[11px] text-white">
            <Navigation size={11} className="text-brand-gold" />
            Cerca
          </span>

          <div className="absolute left-3.5 right-3.5 bottom-3 flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[26px] font-bold leading-none text-white">{name}</span>
              <span className="text-sm text-white/60">{age}</span>
              {is_verified_4k && <BadgeCheck size={15} className="text-brand-gold" />}
            </div>
            <span className="text-[13px] text-white/[0.62]">{location}</span>
          </div>
        </div>

        <div className="px-3.5 py-3 flex items-center justify-between border-t border-white/[0.06]">
          <span className="font-mono text-[11px] text-white/[0.42]">En línea</span>
          <button
            onClick={handleContact}
            className={`flex items-center gap-[7px] px-3.5 py-[9px] rounded-[9px] text-[13px] font-bold transition-all ${
              isBoosted
                ? "bg-brand-gold text-brand-black border border-brand-gold hover:brightness-110"
                : "bg-transparent text-white border border-white/[0.14] hover:border-brand-gold/40"
            }`}
          >
            <MessageCircle size={14} />
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
