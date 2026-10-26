"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, BadgeCheck, UserRound } from "lucide-react";
import { trackEvent } from "@/lib/track";
import WhatsAppConfirmDialog from "./WhatsAppConfirmDialog";

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
  is_online?: boolean;
  /** 'grid' = tarjeta densa del Terminal desktop (aspect 4/5). 'feed' = tarjeta ancha del feed mobile (altura fija 296px), calcada de feedCard() del mockup. */
  layout?: "grid" | "feed";
}

export default function ProfileCard({
  id, name, age, location, imageUrl, images,
  isBoosted = false, whatsapp,
  is_verified_4k = false,
  is_online = false,
  layout = "grid",
}: ProfileCardProps) {
  const [showWhatsAppConfirm, setShowWhatsAppConfirm] = useState(false);
  const isFeed = layout === "feed";

  const cover = images?.[0] || imageUrl || "";

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!whatsapp) return;
    trackEvent("whatsapp_cta_click", { modelId: id });
    setShowWhatsAppConfirm(true);
  };

  return (
    <>
      <article className={`overflow-hidden border border-white/[0.09] bg-[#101014] group relative ${isFeed ? "rounded-[20px]" : "rounded-2xl"} transition-[border-color,transform] duration-300 hover:border-brand-gold/35`}>
        <div
          className={`relative overflow-hidden bg-[#17171B] ${isFeed ? "" : "aspect-[4/5]"}`}
          style={isFeed ? { height: 250 } : undefined}
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_35%,rgba(212,168,67,0.12),transparent_55%)] text-white/35">
              <UserRound size={34} strokeWidth={1.2} />
              <span className="text-xs">Foto no disponible</span>
            </div>
          )}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/25 to-black/5" />

          {id && (
            <Link
              href={`/profile/${id}`}
              aria-label={`Ver perfil de ${name}, ${age} años`}
              className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-gold"
            >
              <span className="sr-only">Ver perfil de {name}</span>
            </Link>
          )}

          {isBoosted && (
            <span
              className={`pointer-events-none absolute z-20 ${isFeed ? "top-3 left-3 px-2.5 py-1.5 rounded-full text-xs" : "top-3 left-3 px-2.5 py-1 rounded-full text-[11px]"} bg-[#D4A843] font-semibold text-[#08080B]`}
            >
              Destacado
            </span>
          )}

          {is_online && <span className="pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-[#101014]/80 px-2.5 py-1.5 text-xs text-emerald-100 backdrop-blur-sm"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />En línea</span>}

          <div className={`pointer-events-none absolute z-20 flex flex-col gap-1.5 ${isFeed ? "left-4 right-4 bottom-3.5" : "left-3.5 right-3.5 bottom-3"}`}>
            <div className="flex items-baseline gap-2">
              <h2 className={`min-w-0 truncate font-serif font-semibold leading-none text-white ${isFeed ? "text-[26px]" : "text-[24px]"}`}>{name}</h2>
              <span className={isFeed ? "shrink-0 text-sm text-white/75" : "shrink-0 text-sm text-white/75"}>{age}</span>
              {is_verified_4k && <span title="Verificación 4K" className="inline-flex shrink-0"><BadgeCheck size={16} aria-label="Verificación 4K" className="text-brand-gold" /></span>}
            </div>
            <span className="truncate text-[13px] text-white/75">{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-3.5 py-3">
          <span className={`min-w-0 truncate ${isFeed ? "text-xs" : "text-[11px]"} ${is_online ? "text-emerald-200/80" : "text-white/55"}`}>{is_online ? "En línea" : "Consulta disponibilidad"}</span>
          <button
            onClick={handleContact}
            disabled={!whatsapp}
            aria-label={whatsapp ? `Contactar a ${name}` : `Contacto no publicado para ${name}`}
            className={`z-20 flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${whatsapp ? "bg-brand-gold text-brand-black hover:bg-brand-gold-light" : "cursor-not-allowed border border-white/10 bg-white/5 text-white/40"}`}
          >
            <MessageCircle size={15} aria-hidden="true" />
            {whatsapp ? "Contactar" : "Sin contacto"}
          </button>
        </div>
      </article>

      <WhatsAppConfirmDialog
        isOpen={showWhatsAppConfirm}
        onClose={() => setShowWhatsAppConfirm(false)}
        phone={whatsapp ?? ""}
        name={name}
        city={location}
        onConfirm={(fullPhone, modelName, modelCity) => {
          const suffix = modelCity ? ` (${modelCity})` : "";
          const text = encodeURIComponent(`Hola ${modelName}, vi tu perfil en Cariñosas.top${suffix}`);
          window.open(`https://wa.me/${fullPhone}?text=${text}`, "_blank");
          setShowWhatsAppConfirm(false);
        }}
      />
    </>
  );
}
