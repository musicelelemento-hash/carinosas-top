"use client";

import React from "react";
import { Crown, Shield, Star, Diamond, ArrowRight } from "lucide-react";

export default function VIPLounge() {
  return (
    <section className="relative py-32 overflow-hidden bg-brand-black">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2560')] bg-cover bg-fixed bg-center opacity-10 grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/90 to-brand-black z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 backdrop-blur-3xl">
              <Crown size={16} className="text-brand-gold fill-brand-gold animate-pulse" />
              <span className="text-[11px] text-brand-gold font-black uppercase tracking-[0.4em]">Members Only Experience</span>
            </div>

            <h2 className="text-6xl md:text-8xl font-serif text-white italic leading-[1.1] tracking-tighter">
              Welcome to the <br />
              <span className="text-brand-gold">VIP Alpha Lounge</span>
            </h2>

            <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-xl font-serif">
              Accede a un nivel superior de exclusividad. Perfiles verificados manualmente, atención prioritaria y encuentros diseñados para la élite.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8">
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-brand-gold">
                     <Shield size={20} />
                     <span className="text-xs font-black uppercase tracking-widest text-white">Full Discretion</span>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Zero digital footprint guarantee</p>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-brand-gold">
                     <Diamond size={20} />
                     <span className="text-xs font-black uppercase tracking-widest text-white">Elite Alpha</span>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Curated by our senior talent team</p>
               </div>
            </div>

            <button className="group mt-12 flex items-center gap-6 px-12 py-6 bg-brand-gold text-brand-black rounded-3xl font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(212,175,55,0.2)]">
               Apply for Membership
               <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden group animate-in fade-in slide-in-from-right-12 duration-1000">
             <img 
               src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200" 
               className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
               alt="VIP Lounge"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
             
             <div className="absolute bottom-12 left-12 right-12 p-8 glass-premium border-brand-gold/20 rounded-[2.5rem] space-y-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                <div className="flex items-center justify-between">
                   <h4 className="text-2xl font-serif text-white italic">The Signature Selection</h4>
                   <Star size={16} className="text-brand-gold fill-brand-gold" />
                </div>
                <p className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] leading-relaxed">
                   Explora el directorio oculto reservado exclusivamente para miembros de nuestra red VIP Alpha.
                </p>
             </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Signature */}
      <div className="absolute top-20 right-20 font-signature text-[120px] text-white/[0.03] -rotate-12 pointer-events-none select-none">
        Elite Humanity
      </div>
    </section>
  );
}
