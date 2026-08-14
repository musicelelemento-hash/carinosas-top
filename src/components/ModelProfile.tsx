"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { 
  MessageCircle, 
  MapPin, 
  Star, 
  ChevronLeft,
  Crown,
  Share2,
  Lock,
  Sparkles,
  Scissors,
  Diamond,
  BadgeCheck,
  TrendingUp,
  Volume2,
  Play,
  Pause,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Eye
} from "lucide-react";
import Link from "next/link";
import VIPRatings from "@/components/VIPRatings";

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
    is_verified_4k?: boolean;
    is_online?: boolean;
  };
}

export default function ModelProfile({ model }: ModelProfileProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'exclusive' | 'reviews'>('photos');
  const [selectedRate, setSelectedRate] = useState<'1h' | '2h' | 'night'>('1h');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContact = () => {
    if (model.whatsapp) {
      const message = `Hola ${model.name}, vi tu perfil en Cariñosas.top. ¿Podrías confirmarme tu disponibilidad?`;
      window.open(`https://wa.me/${model.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const services = model.services || ['VIP Escort', 'Masajes Elite', 'Acompañante de viajes', 'Citas de Lujo'];
  const allTags = model.tags || ['#EliteQuito', '#LuxuryLife', '#Discreción'];

  const MOCK_REVIEWS = [
    { name: "Andrés V.", rating: 5, comment: "Increíble nivel de detalle y profesionalismo. Recomendada 100%.", date: "Hace 2 horas" },
    { name: "Carlos M.", rating: 5, comment: "La mejor experiencia en Quito. Muy puntual y discreta.", date: "Ayer" },
    { name: "Juan P.", rating: 4, comment: "Excelente trato, muy amable y educada.", date: "Hace 3 días" }
  ];

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
    'Anuncio Gratis': { 
      accent: 'text-white/40', 
      bg: 'bg-white/5', 
      border: 'border-white/10', 
      icon: <BadgeCheck size={16} />, 
      label: 'ANUNCIO GRATIS',
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

  const plan = (model.plan_type as keyof typeof PLAN_CONFIG) || 'Anuncio Gratis';
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG['Básico'];
  const isVerified = Boolean(model.isVerified || model.is_verified_4k);
  const availabilityLabel = model.is_online ? 'Disponible ahora' : 'Disponibilidad por confirmar';

  return (
    <div className="relative min-h-screen bg-mesh text-brand-white selection:bg-brand-gold selection:text-brand-black overflow-x-hidden pb-12">
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
           <span className="text-[8px] text-green-500 font-black uppercase tracking-widest pt-0.5">{availabilityLabel}</span>
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
                <span className="text-[7px] text-white/40 uppercase font-black tracking-widest mt-1">{isVerified ? 'Perfil verificado' : 'Perfil en revisión'}</span>
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
                 <h1 className="text-6xl lg:text-8xl font-serif text-white tracking-tighter italic leading-none flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-left duration-1000">
                    {model.name}
                    <div className="flex items-center gap-2 bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                       <BadgeCheck size={24} className="text-brand-gold" />
                       <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.2em] pt-0.5">{isVerified ? 'PERFIL VERIFICADO' : 'PERFIL ACTIVO'}</span>
                    </div>
                 </h1>
              </div>

              {/* Obsidian Voice Greeting Player */}
              <div className="p-5 rounded-3xl glass-obsidian flex items-center justify-between gap-4 border border-brand-gold/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                    className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,168,67,0.4)]"
                  >
                    {isPlayingVoice ? <Pause size={20} className="fill-brand-black" /> : <Play size={20} className="fill-brand-black ml-0.5" />}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.25em]">Nota de Voz de {model.name}</span>
                    <span className="text-xs text-white/60 font-serif italic">&quot;Hola, te cuento sobre mis servicios...&quot;</span>
                  </div>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center gap-1 h-8 px-3">
                  {[40, 75, 50, 90, 60, 80, 45, 100, 70, 85, 55, 65].map((h, idx) => (
                    <span
                      key={idx}
                      className="w-1 bg-brand-gold/80 rounded-full transition-all duration-300"
                      style={{
                        height: isPlayingVoice ? `${(idx % 4 + 1) * 6 + 6}px` : '6px',
                        opacity: isPlayingVoice ? 1 : 0.35,
                      }}
                    />
                  ))}
                </div>
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
                  <span className="text-[8px] uppercase font-black tracking-[0.4em]">EXPERIENCIA EXCLUSIVA</span>
                </div>
                <p className="text-2xl font-serif text-white/80 italic leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:text-brand-gold first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
                   {model.description}
                </p>
              </div>
            </div>

            {/* Obsidian Elite Tiered Investment & Rate Selector */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.5em] ml-1">Tarifas & Experiencias</h3>
                <span className="text-[9px] text-brand-gold uppercase tracking-widest font-black">Precios Transparentes</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: '1h', time: '1 Hora', price: '$100', desc: 'Cita Privada Estándar', highlight: false },
                  { id: '2h', time: '2 Horas', price: '$180', desc: 'Encuentro Relajado & Masaje', highlight: true },
                  { id: 'night', time: 'Cena + Noche VIP', price: '$450', desc: 'Acompañamiento 5★ Completo', highlight: false },
                ].map(rate => (
                  <div
                    key={rate.id}
                    onClick={() => setSelectedRate(rate.id as any)}
                    className={`cursor-pointer p-5 rounded-3xl border transition-all duration-300 space-y-2.5 relative ${
                      selectedRate === rate.id
                        ? 'glass-obsidian border-brand-gold bg-brand-gold/10 shadow-[0_0_25px_rgba(212,168,67,0.25)]'
                        : 'bg-white/5 border-white/10 hover:border-brand-gold/30 hover:bg-white/[0.07]'
                    }`}
                  >
                    {rate.highlight && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-black text-[7px] font-black uppercase tracking-wider">
                        Más Solicitado
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/60">{rate.time}</span>
                      {selectedRate === rate.id && <CheckCircle2 size={14} className="text-brand-gold" />}
                    </div>
                    <div className="text-2xl font-serif text-white font-bold">{rate.price}</div>
                    <p className="text-[9px] text-white/50 leading-tight">{rate.desc}</p>
                  </div>
                ))}
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

            {/* Exclusive Tabs & Media Vault Teaser */}
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
                    BÓVEDA VIP (6 Medios)
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-pink/20 text-[8px]">
                       <Lock size={10} />
                    </span>
                    {activeTab === 'exclusive' && <div className="absolute bottom-0 inset-x-0 h-[3px] bg-brand-pink shadow-[0_0_10px_#FF006E]" />}
                  </button>
               </div>

                <div className="animate-in fade-in zoom-in duration-500">
                  {activeTab === 'photos' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {model.images.slice(0, 4).map((img, i) => (
                          <div key={i} className="aspect-square rounded-3xl border border-white/10 overflow-hidden relative group/item">
                             <Image src={img} fill className="object-cover group-hover/item:scale-110 transition-transform duration-700" alt="Preview" />
                             <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-bold uppercase tracking-widest text-white/80">
                                4K Foto #{i+1}
                             </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-brand-gold/20 overflow-hidden relative group/item">
                             <div className="absolute inset-0 bg-brand-gold/10 backdrop-blur-xl" />
                             <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 relative z-10">
                                <div className="w-8 h-8 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                                   <Lock size={12} />
                                </div>
                                <span className="text-[7px] text-brand-gold font-black uppercase tracking-widest">VIP #{i}</span>
                             </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 rounded-3xl glass-obsidian border border-brand-gold/30 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold mx-auto">
                          <Crown size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-serif text-white italic">Bóveda Privada de {model.name}</h4>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest font-black max-w-xs mx-auto">
                            Accede a fotos y videos inéditos contactando directamente por WhatsApp Seguro.
                          </p>
                        </div>
                        <button
                          onClick={handleContact}
                          className="px-8 py-3.5 bg-brand-gold text-brand-black text-[9px] font-black uppercase tracking-[0.25em] rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,168,67,0.4)]"
                        >
                          Desbloquear por WhatsApp
                        </button>
                      </div>
                    </div>
                  )}
                </div>
            </div>

            {/* VIP Loyalty & Verified Reputation Section */}
            <div className="pt-12 pb-12 border-t border-white/10">
               <VIPRatings />
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

      {/* FIXED OBSIDIAN CONVERSION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-[120] p-6 flex justify-center pointer-events-none">
         <div className="max-w-3xl w-full pointer-events-auto">
            <div className="glass-obsidian px-6 py-5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row items-center justify-between gap-4 border border-brand-gold/35">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-brand-gold/40 flex-shrink-0">
                     <Image src={model.images[0]} fill className="object-cover" alt="Avatar" />
                  </div>
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2">
                        <span className="text-xl font-serif text-white italic">{model.name}</span>
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-bold">VIP</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                           {availabilityLabel}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[8px] text-white/50 uppercase font-bold tracking-wider">
                           Tarifa: {selectedRate === '1h' ? '$100/h' : selectedRate === '2h' ? '$180/2h' : '$450/Noche'}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={handleContact}
                    className="flex-1 sm:flex-none px-8 py-4 bg-brand-gold hover:bg-white text-brand-black rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2.5 shadow-xl shadow-brand-gold/25"
                  >
                     <MessageCircle size={16} fill="currentColor" />
                     WHATSAPP DIRECTO
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
