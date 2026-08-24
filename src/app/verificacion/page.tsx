"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Smile, UserCheck, ShieldCheck, Check } from "lucide-react";

/**
 * Flujo de demostración: los 4 pasos avanzan con estado local de React.
 * No hay pipeline real de subida/revisión — no se sube nada a Supabase Storage
 * ni se llama a una cola de revisión humana. is_verified_4k sigue siendo
 * un campo que solo el admin activa manualmente (ver AdminModelList).
 */

const STEPS = [
  {
    title: "Selfie en vivo",
    body: "Sostén el teléfono a la altura de los ojos. Capturamos en 4K, sin filtros ni retoques.",
    cta: "Abrir cámara",
    icon: Camera,
  },
  {
    title: "Gesto del día",
    body: "Haz el gesto que ves en pantalla. Cambia cada día, así nadie puede reutilizar una foto antigua.",
    cta: "Grabar gesto",
    icon: Smile,
  },
  {
    title: "Revisión humana",
    body: "Un revisor compara tu selfie con tus fotos del perfil. Tarda menos de 2 horas.",
    cta: "Enviar a revisión",
    icon: UserCheck,
  },
  {
    title: "Sello 4K activo",
    body: "Tu perfil ya muestra el sello. Aparecerás antes en el feed y en el radar.",
    cta: "Volver al perfil",
    icon: ShieldCheck,
  },
];

export default function VerificacionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#08080B] text-white flex flex-col">
      <div className="flex items-center gap-3 px-5 py-4">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="w-[52px] h-[52px] rounded-full border border-white/[0.1] flex items-center justify-center"
            aria-label="Atrás"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <Link href="/" className="w-[52px] h-[52px] rounded-full border border-white/[0.1] flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
        )}
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">Verificación 4K</span>
      </div>

      {/* Barra de progreso: 4 segmentos de 4px */}
      <div className="flex gap-1.5 px-5">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/[0.1] overflow-hidden">
            <div className="h-full bg-brand-gold transition-all" style={{ width: i <= step ? "100%" : "0%" }} />
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* Visor 300px radio 22 */}
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-[22px] bg-[#101014] border border-white/[0.1]"
          style={{ width: 300, height: 300 }}
        >
          {isLast ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center">
                <Check size={28} className="text-[#08080B]" />
              </div>
              <span className="font-serif font-bold text-[26px] text-white">Verificada</span>
            </div>
          ) : (
            <>
              <div
                className="rounded-[50%] border-2 border-dashed border-brand-gold/50"
                style={{ width: 210, height: 260 }}
              />
              {step === 0 && (
                <span className="absolute bottom-5 font-mono text-[11px] font-bold text-brand-pink uppercase tracking-[0.14em] animate-pulse">
                  Grabando 4K
                </span>
              )}
              <Icon size={28} className="absolute top-6 text-white/25" />
            </>
          )}
        </div>

        <div className="text-center space-y-2 max-w-sm">
          <h1 className="font-serif font-bold text-2xl text-white">{current.title}</h1>
          <p className="text-[14px] text-white/72 leading-[1.6]">{current.body}</p>
        </div>

        <button
          onClick={() => (isLast ? router.push("/") : setStep((s) => Math.min(STEPS.length - 1, s + 1)))}
          className="btn-gold w-full max-w-sm px-6"
          style={{ minHeight: 52 }}
        >
          {current.cta}
        </button>
      </div>

      <p className="text-center font-mono text-[11px] text-white/35 px-8 pb-8 leading-[1.6]">
        El material de verificación no se publica nunca. Se borra a los 30 días.
      </p>
    </div>
  );
}
