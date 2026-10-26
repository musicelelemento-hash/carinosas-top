"use client";

import { CalendarClock, Globe } from "lucide-react";

export default function GlobalLounge() {
  return (
    <section
      id="global-lounge"
      className="relative overflow-hidden bg-gradient-to-b from-[#08080C] via-[#0B0B10] to-[#08080C] py-24"
    >
      <div className="mx-auto max-w-5xl px-5 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 px-3.5 py-1.5 text-brand-gold">
          <Globe size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.35em]">Giras y disponibilidad</span>
        </div>
        <h2 className="font-serif text-4xl font-bold italic text-white sm:text-6xl">
          Global <span className="text-brand-gold">Lounge</span>
        </h2>
        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <CalendarClock size={26} className="text-brand-gold" />
          <p className="text-sm leading-relaxed text-white/65">
            Las giras se publicarán aquí cuando haya perfiles, ciudades y fechas confirmadas.
          </p>
        </div>
      </div>
    </section>
  );
}
