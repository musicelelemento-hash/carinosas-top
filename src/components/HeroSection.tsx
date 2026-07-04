"use client";

import React, { useState, useRef, useEffect } from "react";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";
import { Search, Sparkles, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const provinces = getProvinces();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationName, setSelectedLocationName] = useState("Todas las Ciudades");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Explorar Todo");

  const locationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Integrated Intelligent Search (Luxury Dropdown Redesign) */}
        <div className="max-w-5xl mx-auto mt-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <div className="glass-premium p-1.5 rounded-[2.5rem] border-brand-gold/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] group hover:border-brand-gold/30 transition-all duration-700">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-2 px-8 py-2">
                
                {/* Custom Location Dropdown */}
                <div className="flex flex-col items-start gap-1 relative w-full text-left" ref={locationRef}>
                  <span className="text-[9px] text-brand-gold/40 uppercase font-black tracking-widest">Localidad</span>
                  <button 
                    onClick={() => {
                      setIsLocationOpen(!isLocationOpen);
                      setIsCategoryOpen(false);
                    }}
                    className="flex items-center justify-between w-full bg-transparent border-none text-white focus:ring-0 cursor-pointer h-10 outline-none font-serif text-xl appearance-none text-left"
                  >
                    <span>{selectedLocationName}</span>
                    <ChevronDown size={14} className={`text-brand-gold/50 group-hover:text-brand-gold transition-transform duration-300 ${isLocationOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                  </button>
                  
                  {isLocationOpen && (
                    <div className="absolute top-full left-0 mt-4 w-full md:w-[480px] bg-brand-black/95 backdrop-blur-3xl border border-brand-gold/20 rounded-[2.5rem] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[350px] overflow-y-auto no-scrollbar scroll-smooth">
                      <div className="space-y-6">
                        <button 
                          onClick={() => {
                            setSelectedLocation("");
                            setSelectedLocationName("Todas las Ciudades");
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left py-3 px-6 rounded-2xl text-xs uppercase tracking-widest font-black transition-all ${!selectedLocation ? 'bg-brand-gold text-brand-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                          Todas las Ciudades
                        </button>
                        
                        {provinces.map(prov => (
                          <div key={prov} className="space-y-3">
                            <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.2em] px-4 block border-l-2 border-brand-gold/30">{prov}</span>
                            <div className="grid grid-cols-2 gap-2">
                              {getCitiesByProvince(prov).map(city => (
                                <button
                                  key={city.id}
                                  onClick={() => {
                                    setSelectedLocation(city.id);
                                    setSelectedLocationName(city.name);
                                    setIsLocationOpen(false);
                                  }}
                                  className={`text-left py-3 px-5 rounded-2xl text-xs font-bold transition-all ${selectedLocation === city.id ? 'bg-brand-gold text-brand-black font-black shadow-lg shadow-brand-gold/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                >
                                  {city.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="hidden md:block w-px h-12 bg-white/5 self-center" />
                
                {/* Custom Category Dropdown */}
                <div className="flex flex-col items-start gap-1 relative w-full text-left" ref={categoryRef}>
                  <span className="text-[9px] text-brand-gold/40 uppercase font-black tracking-widest">Categoría</span>
                  <button 
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      setIsLocationOpen(false);
                    }}
                    className="flex items-center justify-between w-full bg-transparent border-none text-white focus:ring-0 cursor-pointer h-10 outline-none font-serif text-xl appearance-none text-left"
                  >
                    <span>{selectedCategoryName}</span>
                    <ChevronDown size={14} className={`text-brand-gold/50 group-hover:text-brand-gold transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                  </button>
                  
                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-4 w-full bg-brand-black/95 backdrop-blur-3xl border border-brand-gold/20 rounded-[2.5rem] p-4 shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex flex-col gap-2">
                        {[
                          { id: 'todas', name: 'Explorar Todo' },
                          { id: 'mujeres', name: 'Modelos Elite' },
                          { id: 'trans', name: 'Modelos Trans' },
                          { id: 'clubes', name: 'Lifestyle Clubs' }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSelectedCategoryName(cat.name);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full text-left py-3 px-6 rounded-2xl text-xs uppercase tracking-widest font-black transition-all ${selectedCategory === cat.id ? 'bg-brand-gold text-brand-black font-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
              
              <button className="w-full md:w-auto bg-brand-gold hover:bg-white text-brand-black px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95 group/btn shadow-[0_10px_40px_rgba(212,175,55,0.2)] hover:shadow-[0_20px_60px_rgba(212,175,55,0.4)]">
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
