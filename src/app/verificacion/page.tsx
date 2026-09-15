"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Smile, UserCheck, ShieldCheck, Check, Loader2 } from "lucide-react";
import { UploadButton } from "@/components/Uploadthing";
import { submitVerificationRequestAction } from "@/app/actions/verification";

/**
 * Flujo de verificación 4K REAL.
 *  - Paso 0: subir selfie en vivo (imagen).
 *  - Paso 1: subir gesto del día (imagen o video).
 *  - Paso 2: revisar y enviar → crea una solicitud 'pending'.
 *  - Paso 3: "en revisión humana" (NO se marca verificada hasta que el admin apruebe).
 * Reemplaza el demo que solo avanzaba con estado local y mostraba "Verificada" falso.
 */

export default function VerificacionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [modelId, setModelId] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [selfieUrl, setSelfieUrl] = useState<string>("");
  const [gestureUrl, setGestureUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Leer `model` del query param (id de perfil) en cliente para evitar Suspense.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = new URLSearchParams(window.location.search).get("model");
    if (m) setModelId(m);
  }, []);

  const isLast = step === 3;
  const isReview = step === 2;

  const handleSubmit = async () => {
    if (!selfieUrl || !gestureUrl) {
      setStatusMsg({ text: "Sube la selfie en vivo y el gesto del día.", isError: true });
      return;
    }
    setSubmitting(true);
    setStatusMsg(null);
    const res = await submitVerificationRequestAction({
      model_id: modelId || undefined,
      phone: phone.trim() || undefined,
      selfie_url: selfieUrl,
      gesture_url: gestureUrl,
    });
    setSubmitting(false);
    if (res.success) {
      setStatusMsg({ text: "Solicitud enviada. Un revisor la comparará con tu perfil.", isError: false });
      setStep(3);
    } else {
      setStatusMsg({ text: res.error || "Error al enviar.", isError: true });
    }
  };

  const stepTitle = isReview ? "Revisión humana" : isLast ? "En revisión" : step === 0 ? "Selfie en vivo" : "Gesto del día";
  const stepBody = isReview
    ? "Un revisor comparará el material con tu perfil. Tarda menos de 2 horas."
    : isLast
    ? "Tu solicitud está en la cola de revisión. Recibirás el sello 4K cuando el revisor la apruebe."
    : step === 0
    ? "Sube una selfie en vivo, sin filtros ni retoques, a la altura de los ojos."
    : "Graba o sube el gesto del día. Cambia cada día, así nadie reutiliza una foto antigua.";

  return (
    <div className="min-h-screen bg-[#08080B] text-white flex flex-col">
      <div className="flex items-center gap-3 px-5 py-4">
        {step > 0 ? (
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

      {/* Barra de progreso: 4 segmentos */}
      <div className="flex gap-1.5 px-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/[0.1] overflow-hidden">
            <div className="h-full bg-brand-gold transition-all" style={{ width: i <= step ? "100%" : "0%" }} />
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* Visor */}
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-[22px] bg-[#101014] border border-white/[0.1]"
          style={{ width: 300, height: 300 }}
        >
          {isLast ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center">
                <Loader2 size={28} className="text-[#08080B] animate-spin" />
              </div>
              <span className="font-serif font-bold text-[26px] text-white">En revisión</span>
              <span className="text-[12px] font-mono text-white/45">Cola de revisión humana · ≈2 h</span>
            </div>
          ) : (
            <>
              <div className="rounded-[50%] border-2 border-dashed border-brand-gold/50" style={{ width: 210, height: 260 }} />
              {step === 0 && (
                <span className="absolute bottom-5 font-mono text-[11px] font-bold text-brand-pink uppercase tracking-[0.14em] animate-pulse">
                  Selfie en vivo
                </span>
              )}
              {step === 1 && (
                <span className="absolute bottom-5 font-mono text-[11px] font-bold text-brand-pink uppercase tracking-[0.14em] animate-pulse">
                  Gesto del día
                </span>
              )}
              {isReview && (step === 2 ? <UserCheck size={28} className="absolute top-6 text-white/25" /> : null)}
              {step === 0 && <Camera size={28} className="absolute top-6 text-white/25" />}
              {step === 1 && <Smile size={28} className="absolute top-6 text-white/25" />}
            </>
          )}
        </div>

        <div className="text-center space-y-2 max-w-sm">
          <h1 className="font-serif font-bold text-2xl text-white">{stepTitle}</h1>
          <p className="text-[14px] text-white/72 leading-[1.6]">{stepBody}</p>
        </div>

        {/* Identificación (paso 0) */}
        {step === 0 && (
          <div className="w-full max-w-sm space-y-3">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tu WhatsApp (identificación)"
              inputMode="tel"
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 text-sm text-white placeholder:text-white/35 outline-none"
              style={{ height: 46 }}
            />
          </div>
        )}

        {/* Acciones por paso */}
        <div className="w-full max-w-sm space-y-3">
          {step === 0 && (
            <UploadButton
              endpoint="verificationMedia"
              className="ut-button:bg-brand-gold ut-button:text-[#08080B] ut-button:font-bold ut-button:rounded-2xl ut-button:min-h-[52px] ut-allowed-content:hidden"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) { setSelfieUrl(res[0].url); setStep(1); }
              }}
              onUploadError={() => setStatusMsg({ text: "Error al subir la selfie.", isError: true })}
            />
          )}
          {step === 1 && (
            <UploadButton
              endpoint="verificationMedia"
              className="ut-button:bg-brand-gold ut-button:text-[#08080B] ut-button:font-bold ut-button:rounded-2xl ut-button:min-h-[52px] ut-allowed-content:hidden"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) { setGestureUrl(res[0].url); setStep(2); }
              }}
              onUploadError={() => setStatusMsg({ text: "Error al subir el gesto.", isError: true })}
            />
          )}
          {isReview && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-gold w-full px-6"
              style={{ minHeight: 52 }}
            >
              {submitting ? "Enviando..." : "Enviar a revisión"}
            </button>
          )}
          {isLast && (
            <button
              onClick={() => router.push("/")}
              className="btn-gold w-full px-6"
              style={{ minHeight: 52 }}
            >
              Volver al inicio
            </button>
          )}
        </div>

        {statusMsg && (
          <p className={`text-center text-xs font-bold ${statusMsg.isError ? "text-red-400" : "text-emerald-400"}`}>
            {statusMsg.text}
          </p>
        )}
      </div>

      <p className="text-center font-mono text-[11px] text-white/35 px-8 pb-8 leading-[1.6]">
        El material de verificación no se publica nunca. Se borra a los 30 días.
      </p>
    </div>
  );
}
