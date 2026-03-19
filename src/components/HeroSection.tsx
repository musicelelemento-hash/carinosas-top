"use client";

import React from "react";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";
import { Search, Sparkles, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const provinces = getProvinces();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-brand-black -z-20" />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black opacity-80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-transparent to-brand-black opacity-40 z-10" />
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-30 grayscale contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-expensive-watch-detail-32431-large.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand-gold/10 blur-[150px] rounded-full animate-blob -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-brand-pink/5 blur-[150px] rounded-full animate-blob animation-delay-2000 -z-10" />

      <div className="max-w-7xl mx-auto px-6 w-full text-center z-20 space-y-12">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-premium border-brand-gold/20 mb-4 backdrop-blur-3xl">
            <Sparkles size={16} className="text-brand-gold animate-pulse" />
            <span className="text-[11px] text-brand-gold font-black uppercase tracking-[0.4em]">
              The Gold Standard in Ecuador
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-serif text-white leading-[0.9] tracking-tighter">
            CARIÑOSAS<span className="text-brand-gold italic">.TOP</span>
          </h1>
          
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
             <p className="text-brand-white/40 text-sm md:text-base font-medium tracking-[0.2em] uppercase">
               The Ultimate Standard in Elite Companionship
             </p>
             <div className="h-px w-20 bg-brand-gold/30" />
          </div>
        </div>

        {/* Integrated Intelligent Search */}
        <div className="max-w-5xl mx-auto mt-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <div className="glass-premium p-1.5 rounded-[2.5rem] border-brand-gold/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] group hover:border-brand-gold/30 transition-all duration-700">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-2 px-8 py-2">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[9px] text-brand-gold/40 uppercase font-black tracking-widest">Localidad</span>
                  <div className="flex items-center w-full group/select">
                    <select className="bg-transparent border-none text-white focus:ring-0 cursor-pointer h-10 w-full outline-none font-serif text-xl appearance-none">
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
                    <ChevronDown size={14} className="text-brand-gold/50 group-hover/select:text-brand-gold transition-colors" />
                  </div>
                </div>
                
                <div className="hidden md:block w-px h-12 bg-white/5 self-center" />
                
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[9px] text-brand-gold/40 uppercase font-black tracking-widest">Categoría</span>
                  <div className="flex items-center w-full group/select">
                    <select className="bg-transparent border-none text-white focus:ring-0 cursor-pointer h-10 w-full outline-none font-serif text-xl appearance-none">
                      <option value="todas" className="bg-brand-black">Explorar Todo</option>
                      <option value="mujeres" className="bg-brand-black">Modelos Elite</option>
                      <option value="trans" className="bg-brand-black">Modelos Trans</option>
                      <option value="clubes" className="bg-brand-black">Lifestyle Clubs</option>
                    </select>
                    <ChevronDown size={14} className="text-brand-gold/50 group-hover/select:text-brand-gold transition-colors" />
                  </div>
                </div>
              </div>
              
              <button className="w-full md:w-auto bg-brand-gold hover:bg-white text-brand-black px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95 group/btn shadow-[0_10px_40px_rgba(212,175,55,0.2)]">
                <Search size={20} className="group-hover/btn:scale-110 transition-transform" />
                <span>Iniciar Búsqueda</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-12 overflow-hidden">
            {['VERCACE', 'ELITE QUITO', 'DIAMOND GUAYAQUIL', 'VIP MANTA'].map((tag, i) => (
              <button key={tag} className="group flex items-center gap-3 animate-in fade-in slide-in-from-right-12 duration-1000" style={{ animationDelay: `${700 + (i * 100)}ms` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/30 group-hover:bg-brand-gold group-hover:scale-150 transition-all" />
                <span className="text-[10px] text-white/20 group-hover:text-brand-gold uppercase tracking-[0.4em] font-black transition-colors">
                  {tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Humanity Indicator - Subtle Breath */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-700 cursor-pointer group">
         <span className="text-[9px] text-white font-black uppercase tracking-[0.6em] font-serif italic">Scroll to Discover</span>
         <div className="w-px h-16 bg-gradient-to-b from-brand-gold to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out" />
         </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -100px) scale(1.2); }
          66% { transform: translate(-40px, 40px) scale(0.8); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
