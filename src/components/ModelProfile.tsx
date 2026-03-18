"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Heart,
  ChevronLeft,
  Crown,
  Share2,
  Lock,
  Camera,
  Layers,
  Sparkles,
  Zap,
  Phone,
  Scissors,
  Diamond,
  BadgeCheck,
  TrendingUp,
  Map
} from "lucide-react";
import Link from "next/link";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface ModelProfileProps {
  model: {
    id: string;
    name: string;
    age: number;
    location: string;
    description: string;
    images: string[];
    services?: string[];
    isVerified?: boolean;
    plan_type?: string;
    tags?: string[];
    sector?: string;
    whatsapp?: string;
    city?: string;
  };
}

export default function ModelProfile({ model }: ModelProfileProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'exclusive'>('photos');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContact = () => {
    if (model.whatsapp) {
      window.open(`https://wa.me/${model.whatsapp.replace(/\D/g, '')}?text=Hola%20${model.name}%2C%20vi%20tu%20perfil%20Premium%20en%20Cari%C3%B1osas.top%20%F0%9F%94%A5`, '_blank');
    }
  };

  const services = model.services || ['VIP Escort', 'Masajes Elite', 'Acompañante de viajes', 'Citas de Lujo'];
  const allTags = model.tags || ['#EliteQuito', '#LuxuryLife', '#Discreción'];

  const PLAN_CONFIG = {
    'Básico': { 
      accent: 'text-white/40', 
      bg: 'bg-white/5', 
      border: 'border-white/10', 
      icon: <BadgeCheck size={16} />, 
      label: 'VERIFIED MEMBER',
      glow: '',
      exclusive: false,
      autoplay: 0
    },
    'Premium': { 
      accent: 'text-brand-gold/60', 
      bg: 'bg-brand-gold/5', 
      border: 'border-brand-gold/20', 
      icon: <Star size={16} className="fill-brand-gold/40" />, 
      label: 'PREMIUM PARTNER',
      glow: '',
      exclusive: false,
      autoplay: 8000
    },
    'Diamante': { 
      accent: 'text-brand-pink', 
      bg: 'bg-brand-pink/5', 
      border: 'border-brand-pink/20', 
      icon: <Diamond size={16} className="fill-brand-pink" />, 
      label: 'DIAMOND MEMBER',
      glow: 'shadow-[0_0_15px_rgba(255,0,110,0.2)]',
      exclusive: true,
      autoplay: 5000
    },
    'VIP Elite': { 
      accent: 'text-brand-gold', 
      bg: 'bg-brand-gold/10', 
      border: 'border-brand-gold/30', 
      icon: <Crown size={16} className="fill-brand-gold" />, 
      label: 'VIP ELITE ALPHA',
      glow: 'shadow-[0_0_20px_rgba(212,175,55,0.3)]',
      exclusive: true,
      autoplay: 4000
    }
  };

  const plan = (model.plan_type as keyof typeof PLAN_CONFIG) || 'Básico';
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG['Básico'];

  return (
    <div className="relative min-h-screen bg-brand-black text-brand-white selection:bg-brand-gold selection:text-brand-black overflow-x-hidden pb-12">
      {/* HUD Headers & Overlay Layouts - Uber style */}
      <div className="fixed top-8 left-8 z-[100] flex flex-col gap-3">
        <Link 
          href="/"
          className={`group flex items-center gap-3 glass-premium px-6 py-3 rounded-full border border-white/10 hover:border-brand-gold hover:text-brand-gold transition-all active:scale-95 ${scrolled ? 'scale-90 origin-top-left -translate-y-2' : ''}`}
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">Volver al Dashboard</span>
        </Link>
        <div className={`glass-premium px-6 py-2 rounded-full border border-green-500/30 flex items-center gap-2 transition-opacity duration-500 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[8px] text-green-500 font-black uppercase tracking-widest pt-0.5">Direct Connect Activo</span>
        </div>
      </div>

      <div className="fixed top-8 right-8 z-[100] transition-transform duration-500">
         <button className="flex items-center gap-3 glass-premium px-6 py-3 rounded-full border border-white/10 hover:border-brand-gold group transition-all">
            <Share2 size={16} className="text-white group-hover:text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline pt-0.5">Compartir Perfil</span>
         </button>
      </div>

      {/* Main Experience Engine - OnlyFans / Instagram Layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        
        {/* Left Gallery Panel - BeReal/Instagram Narrative */}
        <div className="w-full lg:w-[55%] h-[75vh] lg:h-screen relative overflow-hidden group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            navigation
            pagination={{ clickable: true, type: 'progressbar' }}
            autoplay={config.autoplay ? { delay: config.autoplay } : false}
            effect="fade"
            className="h-full w-full"
          >
            {model.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`${model.name} elite photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[8s] ease-out brightness-90 group-hover:brightness-100"
                    priority={index === 0}
                  />
                  {/* Subtle Grain & Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/20" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10 pointer-events-none" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Social Proof Over Media */}
          <div className="absolute bottom-12 left-12 z-40 space-y-4 pointer-events-none pr-12">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border ${config.border} ${config.bg} ${config.glow} animate-in slide-in-from-left duration-700`}>
              <div className={`${config.accent}`}>
                {config.icon}
              </div>
              <div className="flex flex-col">
                <span className={`text-[9px] ${config.accent} font-black uppercase tracking-[0.2em] leading-none`}>{config.label}</span>
                <span className="text-[7px] text-white/40 uppercase font-black tracking-widest mt-1">Status Verificado por Stitch</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {allTags.map(tag => (
                 <span key={tag} className="glass-premium px-3 py-1.5 rounded-full text-[8px] text-white/60 font-black uppercase tracking-widest border border-white/5">
                    {tag}
                 </span>
               ))}
            </div>
          </div>
        </div>

        {/* Right Info Panel - Magazine / Dashboard Hybrid */}
        <div className="w-full lg:w-[45%] bg-brand-black overflow-y-auto custom-scrollbar relative">
          <div className="max-w-[550px] mx-auto p-8 lg:p-16 space-y-16">
            
            {/* Identity & Bio */}
            <div className="space-y-8 pt-12 lg:pt-24">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 animate-in fade-in duration-1000">
                    <TrendingUp size={16} className="text-brand-gold animate-bounce-subtle" />
                    <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em]">Trending Now en {model.location}</span>
                 </div>
                 <h1 className="text-8xl lg:text-9xl font-serif text-white tracking-tighter italic leading-none flex items-center gap-4">
                   {model.name}
                   {model.isVerified && <BadgeCheck className="text-brand-pink w-12 h-12" fill="currentColor" />}
                 </h1>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Edad', val: `${model.age} Años` },
                  { label: 'Rating', val: '4.9/5' },
                  { label: 'Local', val: model.location },
                  { label: 'Plan', val: plan }
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                    <span className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">{stat.label}</span>
                    <span className="text-xs text-white font-serif italic truncate">{stat.val}</span>
                  </div>
                ))}
              </div>

              {/* Bio Section with Magazine Drop Cap */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-brand-gold/40">
                  <Scissors size={14} className="rotate-90" />
                  <span className="text-[8px] uppercase font-black tracking-[0.4em]">STITCH LUXURY COPY</span>
                </div>
                <p className="text-2xl font-serif text-white/80 italic leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:text-brand-gold first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
                   {model.description}
                </p>
              </div>
            </div>

            {/* Uber-style Real-time Location Dashboard */}
            <div className="space-y-6">
              <h3 className="text-[10px] text-white/30 uppercase font-black tracking-[0.5em] ml-1">Live Tracking</h3>
              <div className="glass-premium border-brand-gold/20 rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-crosshair">
                 <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                             <MapPin size={24} />
                          </div>
                          <div>
                             <span className="text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Sector Preferencial</span>
                             <span className="text-lg text-white font-black uppercase tracking-tighter">{model.sector || 'Urbanización Privada'}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[20px] text-brand-gold font-serif italic leading-none block">~ 8 min</span>
                          <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Tiempo estimado</span>
                       </div>
                    </div>

                    <div className="h-48 w-full bg-[#050505] rounded-3xl relative flex items-center justify-center border border-white/5 overflow-hidden">
                       <div className="absolute inset-0 opacity-10 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/12/1200/2500.png')] grayscale contrast-[1.5]"></div>
                       <div className="relative z-10 w-20 h-20">
                          <div className={`absolute inset-0 bg-brand-gold/20 rounded-full ${plan !== 'Básico' ? 'animate-ping' : ''} opacity-30`} />
                          <div className={`absolute inset-0 bg-brand-gold/10 rounded-full ${plan !== 'Básico' ? 'animate-pulse' : ''} opacity-50 backdrop-blur-sm border border-brand-gold/30`} />
                          <div className="absolute inset-[30%] bg-brand-gold shadow-[0_0_20px_#D4AF37]" />
                       </div>
                       <div className="absolute bottom-4 inset-x-4 flex justify-between items-center z-20">
                          <span className="text-[8px] text-brand-gold/40 font-black uppercase tracking-widest">{plan !== 'Básico' ? 'GPS Satélite Activo' : 'Ubicación Aproximada'}</span>
                          <div className="flex gap-1">
                             <div className={`w-1 h-1 rounded-full bg-brand-gold ${plan !== 'Básico' ? 'animate-pulse' : ''}`} />
                             <div className="w-1 h-1 rounded-full bg-brand-gold/40" />
                             <div className="w-1 h-1 rounded-full bg-brand-gold/20" />
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="bg-brand-gold/5 p-6 border-t border-brand-gold/10 text-center">
                    <p className="text-[9px] text-brand-gold uppercase font-black tracking-widest italic group-hover:scale-110 transition-transform duration-500">
                       Ubicación verificada por Proximity Engine
                    </p>
                 </div>
              </div>
            </div>

            {/* Exclusive Tabs - OnlyFans Logic */}
            <div className="space-y-8">
               <div className="flex gap-4 border-b border-white/5">
                  <button 
                    onClick={() => setActiveTab('photos')}
                    className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'photos' ? 'text-brand-gold' : 'text-white/20 hover:text-white'}`}
                  >
                    Galería Pública
                    {activeTab === 'photos' && <div className="absolute bottom-0 inset-x-0 h-[3px] bg-brand-gold shadow-[0_0_10px_#D4AF37]" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('exclusive')}
                    className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'exclusive' ? 'text-brand-pink' : 'text-white/20 hover:text-brand-pink'}`}
                  >
                    EXCLUSIVO VIP
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-pink/20 text-[8px]">
                       <Lock size={10} />
                    </span>
                    {activeTab === 'exclusive' && <div className="absolute bottom-0 inset-x-0 h-[3px] bg-brand-pink shadow-[0_0_10px_#FF006E]" />}
                  </button>
               </div>

                <div className="animate-in fade-in zoom-in duration-500">
                  {activeTab === 'photos' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Placeholder for public feed */}
                        {[1,2,3,4].map(i => (
                          <div key={i} className="aspect-square bg-white/5 rounded-3xl border border-white/10 overflow-hidden group/item">
                             <div className="w-full h-full bg-brand-gold/5 flex items-center justify-center text-brand-gold/20">
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Live Feed #{i}</span>
                             </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    config.exclusive ? (
                      <div className="grid grid-cols-2 gap-4">
                        {/* Realistic exclusive blurred thumbnails */}
                        {[1,2,3,4].map(i => (
                          <div key={i} className="aspect-square bg-white/5 rounded-3xl border border-brand-pink/10 overflow-hidden relative group/item">
                             <div className="absolute inset-0 bg-brand-pink/5 blur-2xl opacity-50" />
                             <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-brand-pink/10 border border-brand-pink/30 flex items-center justify-center text-brand-pink">
                                   <Lock size={16} />
                                </div>
                                <span className="text-[8px] text-brand-pink font-black uppercase tracking-widest italic">Contenido VIP</span>
                             </div>
                             <div className="absolute inset-x-0 bottom-4 px-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <button className="w-full py-2 bg-brand-pink text-white text-[8px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-pink/20">
                                   Ver Ahora
                                </button>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center glass-premium rounded-[3rem] border border-brand-gold/20 space-y-6">
                         <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mx-auto animate-bounce-subtle">
                            <Crown size={32} />
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-xl font-serif text-white italic">Sección Exclusiva</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black max-w-[200px] mx-auto leading-relaxed">
                               Esta sección solo está disponible para planes 
                               <span className="text-brand-gold"> Diamante</span> y <span className="text-brand-gold">VIP Elite</span>.
                            </p>
                         </div>
                         <button className="px-8 py-4 bg-brand-gold text-brand-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-[0_0_20px_#D4AF37]">
                            Potenciar Perfil Ahora
                         </button>
                      </div>
                    )
                  )}
                </div>
            </div>

            {/* Services Grid - Magazine style icons */}
            <div className="space-y-8 pb-32">
               <h3 className="text-[10px] text-white/30 uppercase font-black tracking-[0.5em] ml-1">Elite Services</h3>
               <div className="grid grid-cols-1 gap-4">
                  {services.map((service, i) => (
                    <div key={i} className="group p-6 glass-dark border border-white/5 rounded-3xl flex items-center justify-between hover:border-brand-gold/40 hover:bg-brand-gold/[0.02] transition-all">
                       <div className="flex items-center gap-6">
                          <span className="text-[14px] font-serif text-brand-gold/30 italic group-hover:text-brand-gold transition-colors">{String(i+1).padStart(2, '0')}</span>
                          <span className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{service}</span>
                       </div>
                       <Sparkles size={16} className="text-brand-gold/20 group-hover:text-brand-gold animate-pulse opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* FIXED CONVERSION BAR - Uber Order Bottom style */}
      <div className="fixed bottom-0 inset-x-0 z-[120] p-6 flex justify-center pointer-events-none">
         <div className="max-w-2xl w-full pointer-events-auto">
            <div className="glass-premium bg-brand-black/95 backdrop-blur-2xl border border-brand-gold/30 px-6 py-6 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-6">
               <div className="flex-1 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-brand-gold/30">
                     <Image src={model.images[0]} fill className="object-cover" alt="Avatar" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xl font-serif text-white italic">{model.name}</span>
                     <span className="text-[9px] text-brand-gold font-black uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online Ahora · {model.city}
                     </span>
                  </div>
               </div>

               <button 
                 onClick={handleContact}
                 className="w-full md:w-auto px-12 py-5 bg-brand-gold hover:bg-white text-brand-black rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all transform hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-brand-gold/20"
               >
                  <MessageCircle size={18} fill="currentColor" />
                  RESERVAR VIP
               </button>
            </div>
         </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 4s infinite ease-in-out; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
