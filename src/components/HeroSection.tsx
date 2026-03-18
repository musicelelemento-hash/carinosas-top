"use client";

import React from "react";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";
import { Search, Sparkles } from "lucide-react";

export default function HeroSection() {
  const provinces = getProvinces();

  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-brand-black -z-20" />
      <div className="absolute inset-0 bg-mesh opacity-40 -z-10 animate-pulse-slow" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full animate-blob -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/5 blur-[120px] rounded-full animate-blob animation-delay-2000 -z-10" />

      <div className="max-w-7xl mx-auto w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border-brand-gold/20 mb-4">
          <Sparkles size={14} className="text-brand-gold animate-pulse" />
          <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.3em]">
            Experiencia de Lujo en Ecuador
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-serif text-brand-gold leading-tight tracking-tight">
          La Élite del <br />
          <span className="text-white italic">Placer Exclusivo</span>
        </h1>
        
        <p className="text-brand-white/50 text-base md:text-lg max-w-xl mx-auto font-medium tracking-wide">
          Descubre el directorio más selecto de acompañantes VIP. 
          Un estándar superior de belleza, elegancia y discreción.
        </p>

        {/* Intelligent Search Bar */}
        <div className="max-w-4xl mx-auto mt-16 scale-105 md:scale-110">
          <div className="glass-premium p-2 rounded-2xl md:rounded-full border-brand-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] transition-all hover:shadow-[0_0_70px_rgba(212,175,55,0.15)] group">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
                <div className="flex flex-col items-start gap-1 py-1">
                  <span className="text-[8px] text-brand-gold/50 uppercase font-black tracking-widest ml-1">Ubicación</span>
                  <select className="bg-transparent border-none text-brand-white focus:ring-0 cursor-pointer h-10 w-full outline-none font-bold text-sm">
                    <option value="" className="bg-brand-black">Todas las Ciudades</option>
                    {provinces.map(prov => (
                      <optgroup key={prov} label={prov} className="bg-brand-black text-brand-gold font-bold">
                        {getCitiesByProvince(prov).map(city => (
                          <option key={city.id} value={city.id} className="bg-brand-black text-brand-white">
                            {city.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                
                <div className="hidden md:block w-px h-10 bg-brand-gold/10 self-center" />
                
                <div className="flex flex-col items-start gap-1 py-1">
                  <span className="text-[8px] text-brand-gold/50 uppercase font-black tracking-widest ml-1">Categoría</span>
                  <select className="bg-transparent border-none text-brand-white focus:ring-0 cursor-pointer h-10 w-full outline-none font-bold text-sm">
                    <option value="todas" className="bg-brand-black">Todas las Categorías</option>
                    <option value="mujeres" className="bg-brand-black text-brand-white">Modelos Femeninas</option>
                    <option value="trans" className="bg-brand-black text-brand-white">Modelos Trans</option>
                    <option value="clubes" className="bg-brand-black text-brand-white">Clubes VIP</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full md:w-auto bg-brand-gold hover:bg-brand-gold-light text-brand-black px-12 py-4 rounded-xl md:rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 group/btn shadow-gold">
                <Search size={18} className="group-hover/btn:scale-110 transition-transform" />
                <span>Explorar</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
            {['Escorts', 'GBA', 'GBA Sur', 'Quito', 'Guayaquil'].map((tag) => (
              <button key={tag} className="text-[9px] text-white/30 hover:text-brand-gold uppercase tracking-[0.3em] font-black transition-colors px-3 py-1 rounded-full border border-white/5 hover:border-brand-gold/20">
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
