"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DIRECTORY_NOTES = [
  "✦ BUSCA PERFILES POR CIUDAD Y SECTOR",
  "✦ EL ESTADO EN LÍNEA SE ACTUALIZA AL ABRIR EL DIRECTORIO",
  "✦ NO MOSTRAMOS UBICACIONES GPS EXACTAS",
  "✦ CONTACTA DESDE LA INFORMACIÓN PUBLICADA EN CADA PERFIL",
];

export default function LiveCountBanner() {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void supabase
      .from("models")
      .select("id", { count: "exact", head: true })
      .eq("is_online", true)
      .not("id", "like", "a1000000-0000-0000-0000-0000000000%")
      .then(({ count, error }) => {
        if (active && !error) setOnlineCount(count ?? 0);
      });
    return () => { active = false; };
  }, []);

  const tickerContent = [...DIRECTORY_NOTES, ...DIRECTORY_NOTES];

  return (
    <div className="w-full relative overflow-hidden z-40" style={{ background: "linear-gradient(90deg, #060608 0%, #0E0E0A 50%, #060608 100%)", borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), rgba(201,168,76,1), rgba(201,168,76,0.6), transparent)" }} />
      <div className="flex items-stretch h-[44px]">
        <div className="flex-shrink-0 flex items-center gap-3 px-6 border-r border-brand-gold/10">
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/75 whitespace-nowrap">Directorio</span>
        </div>
        <div className="flex-shrink-0 flex items-center gap-3 px-6 border-r border-brand-gold/10">
          <span className="text-base font-serif font-bold gold-text-mask">{onlineCount ?? "—"}</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45 whitespace-nowrap">Perfiles marcados en línea</span>
        </div>
        <div className="flex-1 overflow-hidden flex items-center ticker-wrap">
          <div className="ticker-inner flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold/35 whitespace-nowrap">
            {tickerContent.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 px-6 border-l border-brand-gold/10">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">Actualizado al cargar</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)" }} />
    </div>
  );
}
