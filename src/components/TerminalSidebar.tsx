"use client";

import React, { useMemo, useState } from "react";
import { Home, Radar, Play, MessageCircle, Bookmark, type LucideIcon } from "lucide-react";

interface SidebarModel {
  is_verified_4k?: boolean;
  isBoosted?: boolean;
  tags?: string[] | null;
}

interface TerminalSidebarProps {
  models: SidebarModel[];
  onOpenReels: () => void;
  onOpenRadar: () => void;
}

function NavRow({ icon: Icon, label, count, active, onClick }: { icon: LucideIcon; label: string; count?: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-[11px] rounded-[10px] text-left transition-colors"
      style={{
        background: active ? "rgba(212,168,67,.12)" : "transparent",
        color: active ? "#D4A843" : "rgba(240,240,236,.72)",
      }}
    >
      <Icon size={16} />
      <span className="text-[13px] font-semibold">{label}</span>
      {count && <span className="ml-auto font-mono text-[11px] text-white/40">{count}</span>}
    </button>
  );
}

export default function TerminalSidebar({ models, onOpenReels, onOpenRadar }: TerminalSidebarProps) {
  const [privateMode, setPrivateMode] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const counts = useMemo(() => {
    const verified = models.filter((m) => m.is_verified_4k).length;
    const cerca = models.filter((m) => m.isBoosted).length;
    const cenas = models.filter((m) => m.tags?.some((t) => /cena|evento/i.test(t))).length;
    return {
      total: models.length,
      verified,
      cerca: cerca || models.length,
      cenas,
      disponibles: models.length,
    };
  }, [models]);

  return (
    <div className="hidden lg:flex flex-col gap-[26px] w-[196px] shrink-0 border-r border-white/[0.07] bg-[#0C0C10] px-3.5 py-5">
      <nav className="flex flex-col gap-0.5">
        <NavRow
          icon={Home}
          label="Inicio"
          count={String(counts.total)}
          active
          onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
        />
        <NavRow icon={Radar} label="Radar" onClick={onOpenRadar} />
        <NavRow icon={Play} label="Reels" count="61" onClick={onOpenReels} />
        <NavRow icon={MessageCircle} label="Chats" count="3" onClick={() => showToast("Chats: próximamente")} />
        <NavRow icon={Bookmark} label="Guardados" count="12" onClick={() => showToast("Guardados: próximamente")} />
      </nav>

      <div className="flex flex-col gap-2.5">
        <span className="px-3 font-mono text-[11px] tracking-[0.18em] uppercase text-white/30">Filtros</span>
        <div className="flex flex-col gap-0.5">
          {[
            { label: "En línea ahora", count: counts.total },
            { label: "Verificada 4K", count: counts.verified },
            { label: "A menos de 5 km", count: counts.cerca },
            { label: "Cenas y eventos", count: counts.cenas },
            { label: "Disponible hoy", count: counts.disponibles },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between px-3 py-[9px] rounded-[10px]">
              <span className="text-[13px] text-white/70">{f.label}</span>
              <span className="font-mono text-[11px] text-white/35">{f.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 rounded-xl p-3.5 border border-[rgba(212,168,67,.22)] bg-[rgba(212,168,67,.05)]">
        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-brand-gold">Modo privado</span>
        <p className="text-[12px] leading-[1.5] text-white/55 m-0">Oculta la app al salir de la pestaña. Sin historial.</p>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-white">{privateMode ? "Activo" : "Inactivo"}</span>
          <button
            onClick={() => setPrivateMode((v) => !v)}
            className="relative w-[34px] h-5 rounded-full transition-colors"
            style={{ background: privateMode ? "#D4A843" : "rgba(255,255,255,.14)" }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-[#08080C] transition-all"
              style={{ left: privateMode ? "16px" : "2px" }}
            />
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-[210px] z-[70] px-4 py-2 rounded-full bg-[#0C0C10] border border-brand-gold/30 text-white text-xs shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
