"use client";

import { Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-[#111111] to-brand-black -z-10" />
      
      <div className="max-w-7xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-7xl font-serif text-brand-gold mb-6 tracking-tight">
          Encuentra la élite del <br />
          <span className="text-brand-white">placer en Ecuador</span>
        </h1>
        
        <p className="text-brand-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          El directorio más exclusivo de Quito, Guayaquil, Cuenca y Manta.
        </p>

        {/* Intelligent Search Bar */}
        <div className="max-w-4xl mx-auto bg-brand-black border border-brand-gold/30 rounded-2xl md:rounded-full p-2 shadow-gold backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-2 px-4">
              <select className="bg-transparent border-none text-brand-white focus:ring-0 cursor-pointer h-12 outline-none">
                <option value="" className="bg-brand-black">Seleccionar Ciudad</option>
                <option value="quito" className="bg-brand-black">Quito</option>
                <option value="guayaquil" className="bg-brand-black">Guayaquil</option>
                <option value="cuenca" className="bg-brand-black">Cuenca</option>
                <option value="manta" className="bg-brand-black">Manta</option>
              </select>
              <div className="hidden md:block w-px h-8 bg-white/10 self-center" />
              <select className="bg-transparent border-none text-brand-white focus:ring-0 cursor-pointer h-12 outline-none">
                <option value="" className="bg-brand-black">Categoría</option>
                <option value="mujeres" className="bg-brand-black">Mujeres</option>
                <option value="trans" className="bg-brand-black">Trans</option>
                <option value="clubes" className="bg-brand-black">Clubes</option>
              </select>
            </div>
            
            <button className="w-full md:w-auto bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-10 py-3.5 rounded-xl md:rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 group">
              <Search size={20} className="group-hover:scale-110 transition-transform" />
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-pink/5 blur-[120px] -z-10 rounded-full" />
    </section>
  );
}
