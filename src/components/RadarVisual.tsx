"use client";

import React, { useMemo } from "react";
import Image from "next/image";

export interface RadarBlipData {
  id: string;
  name: string;
  km?: string;
  avatar?: string;
  live?: boolean;
}

interface RadarVisualProps {
  blips: RadarBlipData[];
  /** 'compact' = panel de sidebar (puntos + etiqueta). 'full' = pantalla dedicada (avatares grandes). */
  size?: "compact" | "full";
  onSelect?: (blip: RadarBlipData) => void;
}

/** Reparte los blips en anillos concéntricos con un ángulo dorado, determinístico por índice. */
function layoutBlips(blips: RadarBlipData[]) {
  const GOLDEN_ANGLE = 137.508;
  return blips.map((b, i) => {
    const angle = ((i * GOLDEN_ANGLE + i * 23) % 360) * (Math.PI / 180);
    const ring = i % 3; // 0 = cerca, 1 = medio, 2 = lejos
    const radius = 0.22 + ring * 0.24;
    const left = 50 + Math.cos(angle) * radius * 50;
    const top = 50 + Math.sin(angle) * radius * 42;
    return { ...b, left, top };
  });
}

// Valores exactos del mockup: anillos y haz en px fijos (círculos perfectos, sin deformarse por el aspect-ratio del contenedor)
const RING_SIZES_COMPACT = [110, 178, 246];
const RING_SIZES_FULL = [220, 340, 460];
const SWEEP_COMPACT = 300;
const SWEEP_FULL = 460;

export default function RadarVisual({ blips, size = "compact", onSelect }: RadarVisualProps) {
  const positioned = useMemo(() => layoutBlips(blips), [blips]);
  const rings = size === "compact" ? RING_SIZES_COMPACT : RING_SIZES_FULL;
  const sweepSize = size === "compact" ? SWEEP_COMPACT : SWEEP_FULL;
  const isCompact = size === "compact";

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(212,168,67,.07) 0%, rgba(10,10,13,0) 62%), #08080B",
      }}
    >
      {/* Grid de fondo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,168,67,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,.05) 1px,transparent 1px)",
          backgroundSize: isCompact ? "44px 44px" : "48px 48px",
        }}
      />

      {/* Anillos concéntricos — círculos perfectos, tamaño fijo como el mockup */}
      {rings.map((s) => (
        <div
          key={s}
          className="absolute top-1/2 left-1/2 rounded-full border"
          style={{
            width: s,
            height: s,
            marginLeft: -s / 2,
            marginTop: -s / 2,
            borderColor: "rgba(212,168,67,.16)",
          }}
        />
      ))}

      {/* Haz giratorio */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full radar-sweep-beam"
        style={{
          width: sweepSize,
          height: sweepSize,
          marginLeft: -sweepSize / 2,
          marginTop: -sweepSize / 2,
          background:
            "conic-gradient(from 0deg, rgba(212,168,67,.24) 0deg, rgba(212,168,67,.05) 42deg, transparent 70deg, transparent 360deg)",
          animation: "radarSweepSpin 5s linear infinite",
        }}
      />

      {/* Posición del usuario */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full bg-[#F0F0EC]"
        style={{
          width: isCompact ? 12 : 14,
          height: isCompact ? 12 : 14,
          transform: "translate(-50%,-50%)",
          boxShadow: "0 0 0 4px rgba(240,240,236,.12)",
        }}
      />

      {/* Blips */}
      {positioned.map((b) =>
        isCompact ? (
          <button
            key={b.id}
            onClick={() => onSelect?.(b)}
            className="absolute flex items-center gap-2 cursor-pointer"
            style={{ top: `${b.top}%`, left: `${b.left}%`, transform: "translate(-50%,-50%)" }}
          >
            <span className="relative w-2.5 h-2.5 shrink-0">
              {b.live && (
                <span
                  className="absolute inset-0 rounded-full radar-blip-ping"
                  style={{ background: b.live ? "#FF0062" : "#D4A843" }}
                />
              )}
              <span className="absolute inset-0 rounded-full" style={{ background: b.live ? "#FF0062" : "#D4A843" }} />
            </span>
            <span className="font-mono text-[11px] text-white/70 whitespace-nowrap">
              {b.name}
              {b.km ? ` · ${b.km}` : ""}
            </span>
          </button>
        ) : (
          <button
            key={b.id}
            onClick={() => onSelect?.(b)}
            className="absolute flex flex-col items-center gap-1.5 cursor-pointer"
            style={{ top: `${b.top}%`, left: `${b.left}%`, transform: "translate(-50%,-50%)" }}
          >
            <span className="relative block" style={{ width: 56, height: 56 }}>
              {b.live && (
                <span
                  className="absolute rounded-full radar-blip-ping"
                  style={{ inset: -6, background: "rgba(255,0,98,.35)" }}
                />
              )}
              <Image
                src={b.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800"}
                alt={b.name}
                width={56}
                height={56}
                className="relative rounded-full object-cover"
                style={{ border: `2px solid ${b.live ? "#FF0062" : "#D4A843"}` }}
              />
            </span>
            <span className="font-mono text-[11px] text-white/85 whitespace-nowrap px-[7px] py-0.5 rounded-md bg-[#08080B]/75">
              {b.km || b.name}
            </span>
          </button>
        )
      )}
    </div>
  );
}
