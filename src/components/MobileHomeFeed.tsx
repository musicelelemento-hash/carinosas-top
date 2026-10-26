"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Radar, ChevronRight } from "lucide-react";
import ProfileCard from "./ProfileCard";
import { EmptyState } from "@/components/ui/VisualComponents";

interface FeedModel {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  isBoosted?: boolean;
  is_verified_4k?: boolean;
  is_online?: boolean;
  whatsapp?: string;
  sector?: string | null;
  tags?: string[] | null;
  plan_type?: string;
  personal_note?: string;
}

interface MobileHomeFeedProps {
  models: FeedModel[];
  onQuickFilter: (filter: "city" | "online" | "week") => void;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

const CHIPS = [
  { id: "city", label: "En tu ciudad" },
  { id: "online", label: "En línea" },
  { id: "week", label: "Esta semana" },
] as const;

export default function MobileHomeFeed({ models, onQuickFilter, isLoading = false, error = "", onRetry }: MobileHomeFeedProps) {
  const router = useRouter();
  const [chip, setChip] = useState<(typeof CHIPS)[number]["id"]>("city");
  const applyQuickFilter = (id: (typeof CHIPS)[number]["id"]) => {
    setChip(id);
    onQuickFilter(id);
  };

  if (models.length === 0) {
    return (
      <div className="lg:hidden flex flex-col">
        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-4 no-scrollbar sm:px-6">
          {CHIPS.map((c) => (
            <button
              key={c.id}
              onClick={() => applyQuickFilter(c.id)}
              aria-pressed={chip === c.id}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${chip === c.id ? "border-brand-gold bg-brand-gold text-brand-black" : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:text-white"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {isLoading ? (
          <p role="status" className="px-4 py-10 text-center text-sm text-white/60">Cargando perfiles…</p>
        ) : error ? (
          <div className="mx-4 rounded-2xl border border-red-300/20 bg-red-400/[0.06] px-5 py-6 text-center sm:mx-6">
            <p role="alert" className="text-sm text-red-100">{error}</p>
            {onRetry && <button type="button" onClick={onRetry} className="mt-4 min-h-11 rounded-xl border border-white/15 px-4 text-sm text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold">Reintentar</button>}
          </div>
        ) : (
          <EmptyState
            title="No hay perfiles para mostrar"
            subtitle="Prueba otro filtro o cambia la ciudad seleccionada."
          />
        )}
      </div>
    );
  }

  return (
    <div className="lg:hidden flex flex-col">
      {isLoading && <p role="status" className="px-4 pb-3 text-sm text-white/55 sm:px-6">Actualizando perfiles…</p>}
      {error && models.length > 0 && (
        <div className="mx-4 mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-300/20 bg-red-400/[0.06] px-4 py-3 sm:mx-6">
          <p role="alert" className="text-sm text-red-100">{error}</p>
          {onRetry && <button type="button" onClick={onRetry} className="min-h-11 shrink-0 rounded-lg border border-white/15 px-3 text-sm text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold">Reintentar</button>}
        </div>
      )}
      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-4 no-scrollbar sm:px-6">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            onClick={() => applyQuickFilter(c.id)}
            aria-pressed={chip === c.id}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${chip === c.id ? "border-brand-gold bg-brand-gold text-brand-black" : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:text-white"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3.5 px-4 pb-6 sm:px-6">
        {models.map((m, i) => (
          <React.Fragment key={m.id}>
            <ProfileCard {...m} layout="feed" />

            {i === 0 && (
              <button
                onClick={() => router.push("/radar")}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-brand-gold/20 bg-brand-gold/[0.045] p-3.5 text-left transition-colors hover:bg-brand-gold/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              >
                <Radar size={20} className="text-brand-gold shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white">Explora el mapa de perfiles</span>
                  <span className="text-xs text-white/55">Consulta la ubicación aproximada</span>
                </div>
                <ChevronRight size={18} aria-hidden="true" className="text-white/45 shrink-0" />
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
