"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Lock, CalendarClock, BarChart3, ShieldQuestion, ChevronRight } from "lucide-react";

export default function CuentaPage() {
  const router = useRouter();

  const rows = [
    { label: "Bóveda", icon: Lock, onClick: () => router.push("/boveda-secreta") },
    { label: "Mi agenda", icon: CalendarClock, onClick: () => router.push("/chats") },
    { label: "Estadísticas", icon: BarChart3, onClick: undefined },
    { label: "Privacidad", icon: ShieldQuestion, onClick: undefined },
  ];

  return (
    <div className="min-h-screen bg-[#08080B] text-white pb-24">
      <div className="flex items-center gap-3 px-5 py-4">
        <Link href="/" className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-serif font-bold text-xl text-white">Tú</h1>
      </div>

      <div className="px-5 space-y-5">
        {/* Tarjeta de cuenta */}
        <div className="flex items-center gap-3.5 rounded-2xl p-4" style={{ background: "#101014", border: "1px solid rgba(255,255,255,.07)" }}>
          <div className="w-[60px] h-[60px] rounded-full bg-white/10 flex items-center justify-center font-serif font-bold text-2xl text-white/70 shrink-0">
            T
          </div>
          <div>
            <span className="block text-[16px] font-bold text-white">Tu cuenta</span>
            <span className="block font-mono text-[12px] text-white/45">Plan Gratis · Machala</span>
          </div>
        </div>

        {/* CTA verificación */}
        <Link
          href="/verificacion"
          className="block rounded-2xl p-4 space-y-1"
          style={{ border: "1px solid rgba(212,168,67,.4)", background: "rgba(212,168,67,.06)" }}
        >
          <div className="flex items-center gap-2 text-brand-gold">
            <ShieldCheck size={18} />
            <span className="text-[14px] font-bold">Completa tu verificación 4K</span>
          </div>
          <p className="text-[12px] text-white/55">Los perfiles verificados reciben 3× más mensajes.</p>
        </Link>

        {/* Filas */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.07)" }}>
          {rows.map(({ label, icon: Icon, onClick }, i) => (
            <button
              key={label}
              onClick={onClick}
              disabled={!onClick}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,.07)" : undefined }}
            >
              <Icon size={18} className="text-white/60 shrink-0" />
              <span className="flex-1 text-[14px] font-semibold text-white">{label}</span>
              <ChevronRight size={18} className="text-white/35 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
