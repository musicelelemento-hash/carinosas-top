"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Eye,
  X,
  Heart,
  Check,
  CreditCard,
  QrCode,
  ArrowRight,
  Send,
  Mail
} from "lucide-react";
import Link from "next/link";
import VIPRatings from "@/components/VIPRatings";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEngine";

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
    telegram?: string;
    email?: string;
    city?: string;
    is_verified_4k?: boolean;
    is_online?: boolean;
    voice_url?: string;
  };
}

export default function ModelProfile({ model }: ModelProfileProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'exclusive' | 'reviews'>('photos');
  const [selectedRate, setSelectedRate] = useState<'1h' | '2h' | 'night' | 'weekend'>('1h');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [storyOpenIndex, setStoryOpenIndex] = useState<number | null>(null);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [likesCount, setLikesCount] = useState(148);
  const [isLiked, setIsLiked] = useState(false);
  const [hasVIPPass, setHasVIPPass] = useState<string | null>(null);

  // Audio voice note simulation / Web Audio oscillator
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const checkPass = () => {
      try {
        const stored = localStorage.getItem("vip_pass_code") || localStorage.getItem("carinosas_vip_pass");
        setHasVIPPass(stored);
      } catch {}
    };
    checkPass();
    window.addEventListener("storage", checkPass);
    window.addEventListener("vip_pass_updated", checkPass);
    return () => {
      window.removeEventListener("storage", checkPass);
      window.removeEventListener("vip_pass_updated", checkPass);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Voice player progress interval
  useEffect(() => {
    let interval: NodeJS.Timeout | number | undefined;
    if (isPlayingVoice) {
      interval = setInterval(() => {
        setVoiceProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingVoice(false);
            return 0;
          }
          return prev + 4;
        });
      }, 300);
    } else if (voiceProgress >= 100) {
      setVoiceProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingVoice, voiceProgress]);

  const toggleVoiceAudio = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(15); } catch {}
    }

    if (!isPlayingVoice) {
      sound.playVoiceGreeting(7.5);
      setIsPlayingVoice(true);
    } else {
      setIsPlayingVoice(false);
    }
  };

  const handleLike = () => {
    if (!isLiked) {
      sound.playGoldChime();
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8, x: 0.5 },
          colors: ['#D4A843', '#FFE088', '#FF006E', '#FFFFFF'],
        });
      } catch {}
    } else {
      sound.playSubtleClick();
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    }
  };

  const handleShare = () => {
    sound.playSubtleClick();
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const rateDetails: Record<string, { time: string; price: string; desc: string; msgTag: string }> = {
    '1h': { time: '1 Hora', price: '$100', desc: 'Cita Privada Estándar', msgTag: '1 Hora ($100 USD)' },
    '2h': { time: '2 Horas', price: '$180', desc: 'Encuentro Relajado & Masaje Sensitivo', msgTag: '2 Horas ($180 USD)' },
    'night': { time: 'Cena + Noche VIP', price: '$450', desc: 'Acompañamiento 5★ Completo', msgTag: 'Cena + Noche VIP ($450 USD)' },
    'weekend': { time: 'Gira VIP / Fin de Semana', price: '$900+', desc: 'Viajes, Eventos & Exclusividad Total', msgTag: 'Gira VIP / Fin de Semana' },
  };

  const handleContact = (customMessage?: string) => {
    if (model.whatsapp) {
      const clean = model.whatsapp.replace(/\D/g, '');
      const fullPhone = clean.startsWith('0') 
        ? `593${clean.slice(1)}` 
        : (clean.length === 9 || clean.length === 10) && !clean.startsWith('593') && !clean.startsWith('57') && !clean.startsWith('51') && !clean.startsWith('52') && !clean.startsWith('34') && !clean.startsWith('507')
        ? `593${clean}`
        : clean;

      const rateInfo = rateDetails[selectedRate]?.msgTag || '1 Hora';
      const sectorText = model.sector ? ` en ${model.sector}` : '';
      const locationText = model.location || model.city || 'Ecuador';

      const defaultMsg = `Hola ${model.name}, vi tu perfil VIP en Cariñosas.top (${locationText}${sectorText}). Me gustaría coordinar una cita para la experiencia de ${rateInfo}. ¿Podrías confirmarme tu disponibilidad?`;
      const finalMessage = customMessage || defaultMsg;

      window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(finalMessage)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const services = model.services || ['VIP Escort', 'Masajes Elite', 'Acompañante de viajes', 'Citas de Lujo'];
  const allTags = model.tags || ['#EliteVIP', '#LuxuryLife', '#DiscreciónTotal', '#Verificada4K'];

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

  const plan = (model.plan_type as keyof typeof PLAN_CONFIG) || 'Diamante';
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG['Diamante'];
  const isVerified = Boolean(model.isVerified || model.is_verified_4k);
  const availabilityLabel = model.is_online ? 'Disponible ahora' : 'Disponibilidad por confirmar';

  return (
    <div className="relative min-h-screen bg-[#08080C] text-white selection:bg-brand-gold selection:text-brand-black overflow-x-hidden pb-32 md:pb-24">
      
      {/* ── TOP HUD NAVIGATION ── */}
      <div className="fixed top-6 left-6 z-[100] flex flex-col gap-2.5">
        <Link 
          href="/"
          className={`group flex items-center gap-2.5 glass-obsidian px-5 py-2.5 rounded-full border border-brand-gold/30 hover:border-brand-gold hover:text-brand-gold transition-all active:scale-95 shadow-xl ${scrolled ? 'scale-90 origin-top-left -translate-y-2' : ''}`}
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-brand-gold" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-brand-gold">Catálogo</span>
        </Link>
        <div className={`glass-obsidian px-4 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 transition-opacity duration-500 shadow-lg ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">{availabilityLabel}</span>
        </div>
      </div>

      <div className="fixed top-6 right-6 z-[100] flex items-center gap-2">
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 glass-obsidian px-4 py-2.5 rounded-full border transition-all ${
            isLiked ? 'border-brand-pink bg-brand-pink/20 text-brand-pink' : 'border-white/10 hover:border-brand-gold text-white/70 hover:text-white'
          }`}
        >
          <Heart size={14} className={isLiked ? 'fill-brand-pink' : ''} />
          <span className="text-[9px] font-black font-mono">{likesCount}</span>
        </button>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 glass-obsidian px-4 py-2.5 rounded-full border border-white/10 hover:border-brand-gold group transition-all"
        >
          <Share2 size={14} className="text-white/70 group-hover:text-brand-gold" />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline text-white/70 group-hover:text-white">
            {copiedLink ? '¡Enlace Copiado!' : 'Compartir'}
          </span>
        </button>
      </div>

      {/* ── MAIN TWO-COLUMN SHOWCASE ── */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Column: 4K Gallery Slider */}
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
                <div 
                  className="relative w-full h-full cursor-zoom-in"
                  onClick={() => setStoryOpenIndex(index)}
                >
                  <Image
                    src={img}
                    alt={`${model.name} elite photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[8s] ease-out brightness-95 group-hover:brightness-100"
                    priority={index === 0}
                  />
                  {/* Cinematic gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-black/30 pointer-events-none" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Social Proof Badges Over Media */}
          <div className="absolute bottom-10 left-8 md:left-12 z-40 space-y-3 pointer-events-none pr-8">
            <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-obsidian border ${config.border} shadow-[0_0_25px_rgba(212,168,67,0.3)]`}>
              <div className={config.accent}>
                {config.icon}
              </div>
              <div className="flex flex-col">
                <span className={`text-[9px] ${config.accent} font-black uppercase tracking-[0.2em] leading-none`}>{config.label}</span>
                <span className="text-[7px] text-white/50 uppercase font-mono tracking-wider mt-0.5">Auditoría Biométrica 4K</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <span key={tag} className="glass-obsidian px-3 py-1 rounded-full text-[8px] text-brand-gold font-bold uppercase tracking-wider border border-brand-gold/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Profile & Booking Engine */}
        <div className="w-full lg:w-[45%] bg-[#08080C] overflow-y-auto no-scrollbar relative border-l border-white/5">
          <div className="max-w-[560px] mx-auto p-6 md:p-12 lg:p-14 space-y-12">
            
            {/* Identity & Bio Header */}
            <div className="space-y-6 pt-6 lg:pt-16">
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-brand-gold" />
                  <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.35em]">Top Model en {model.location}</span>
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-5xl md:text-7xl font-serif text-white italic tracking-tight leading-none">
                    {model.name}
                  </h1>
                  <span className="text-2xl font-serif text-brand-gold font-light italic">{model.age} años</span>
                </div>

                <p className="text-xs text-white/60 flex items-center gap-1.5 font-light">
                  <MapPin size={13} className="text-brand-gold" />
                  <span>{model.sector || 'Zona Exclusiva Hotel 5★'}, {model.location}</span>
                </p>
              </div>

              {/* ── INTERACTIVE 24K GOLD VOICE NOTE PLAYER ── */}
              <div className="p-5 rounded-3xl glass-obsidian border border-brand-gold/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleVoiceAudio}
                      className="w-12 h-12 rounded-2xl bg-brand-gold hover:bg-white text-brand-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,168,67,0.5)] shrink-0"
                    >
                      {isPlayingVoice ? (
                        <Pause size={18} className="fill-brand-black" />
                      ) : (
                        <Play size={18} className="fill-brand-black ml-0.5" />
                      )}
                    </button>
                    <div>
                      <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.25em] block">
                        Nota de Voz Oficial
                      </span>
                      <span className="text-xs text-white/80 font-serif italic">
                        {isPlayingVoice ? "Reproduciendo saludo en vivo..." : `Escuchar la voz de ${model.name}`}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-brand-gold/70 font-bold">
                    {isPlayingVoice ? `0:0${Math.floor(voiceProgress / 10)}` : "0:14"}
                  </span>
                </div>

                {/* Animated Audio Oscillating Waveform */}
                <div className="flex items-center justify-between gap-1 h-8 px-2 bg-black/40 rounded-xl">
                  {[35, 65, 45, 90, 70, 100, 50, 85, 40, 95, 60, 80, 55, 90, 45, 75, 40, 85, 50, 70].map((barHeight, idx) => {
                    const isActive = (idx / 20) * 100 <= voiceProgress;
                    return (
                      <span
                        key={idx}
                        className="w-1 rounded-full transition-all duration-200"
                        style={{
                          height: isPlayingVoice ? `${(idx % 5 + 2) * 5 + 4}px` : `${barHeight * 0.25}px`,
                          backgroundColor: isActive || isPlayingVoice ? "#D4A843" : "rgba(255,255,255,0.15)",
                          boxShadow: isActive ? "0 0 8px rgba(212,168,67,0.8)" : "none"
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Bio with Vogue Styling */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-brand-gold/60">
                  <Scissors size={13} className="rotate-90" />
                  <span className="text-[8px] uppercase font-black tracking-[0.35em]">Descripción Personal</span>
                </div>
                <p className="text-xl font-serif text-white/85 italic leading-relaxed first-letter:text-6xl first-letter:font-black first-letter:text-brand-gold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                  {model.description}
                </p>
              </div>

            </div>

            {/* ── TIERED RATES & INVESTMENT CALCULATOR ── */}
            <div className="space-y-5 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.4em]">
                  Calculadora de Experiencias
                </h3>
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-bold">
                  Tarifas Directas Sin Intermediarios
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.entries(rateDetails).map(([key, rate]) => {
                  const isSel = selectedRate === key;
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        setSelectedRate(key as any);
                        if (typeof window !== "undefined" && "vibrate" in navigator) {
                          try { navigator.vibrate(10); } catch {}
                        }
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 space-y-2 relative glass-obsidian ${
                        isSel
                          ? 'border-brand-gold bg-brand-gold/15 shadow-[0_0_25px_rgba(212,168,67,0.3)]'
                          : 'border-white/10 hover:border-brand-gold/30 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">{rate.time}</span>
                        {isSel && <CheckCircle2 size={14} className="text-brand-gold" />}
                      </div>
                      <div className="text-2xl font-serif text-white font-bold">{rate.price}</div>
                      <p className="text-[9px] text-white/50 leading-tight">{rate.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── TABS: GALLERY & SECRET VAULT 4K ── */}
            <div className="space-y-6 border-t border-white/10 pt-8">
              <div className="flex gap-4 border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('photos')}
                  className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                    activeTab === 'photos' ? 'text-brand-gold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Galería Pública ({model.images.length})
                  {activeTab === 'photos' && <div className="absolute bottom-0 inset-x-0 h-[2px] bg-brand-gold shadow-[0_0_10px_#D4A843]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('exclusive')}
                  className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative flex items-center justify-center gap-1.5 ${
                    activeTab === 'exclusive' ? 'text-brand-pink' : 'text-white/40 hover:text-brand-pink'
                  }`}
                >
                  <span>Bóveda Secreta 4K (6)</span>
                  <Lock size={11} />
                  {activeTab === 'exclusive' && <div className="absolute bottom-0 inset-x-0 h-[2px] bg-brand-pink shadow-[0_0_10px_#FF006E]" />}
                </button>
              </div>

              {activeTab === 'photos' ? (
                <div className="grid grid-cols-2 gap-3.5">
                  {model.images.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setStoryOpenIndex(i)}
                      className="aspect-square rounded-2xl border border-white/10 overflow-hidden relative group/item cursor-pointer"
                    >
                      <Image src={img} fill className="object-cover group-hover/item:scale-110 transition-transform duration-700" alt={`Foto ${i + 1}`} />
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[8px] font-mono font-bold uppercase tracking-wider text-white">
                        4K HD #{i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {hasVIPPass ? (
                    <>
                      {/* Unlocked Vault Grid */}
                      <div className="p-4 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-between shadow-[0_0_25px_rgba(212,168,67,0.25)]">
                        <div className="flex items-center gap-3">
                          <Crown size={20} className="text-brand-gold fill-brand-gold animate-pulse" />
                          <div>
                            <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest block">
                              Bóveda Secreta Desbloqueada
                            </span>
                            <span className="text-xs text-white font-serif font-bold">
                              Pase VIP Activo: {hasVIPPass}
                            </span>
                          </div>
                        </div>
                        <span className="text-[8px] px-2 py-1 rounded-full bg-brand-gold text-brand-black font-black uppercase tracking-wider">
                          Acceso Total 4K
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {model.images.map((img, i) => (
                          <div 
                            key={i} 
                            onClick={() => setStoryOpenIndex(i)}
                            className="aspect-[4/5] bg-brand-black rounded-2xl border border-brand-gold/40 overflow-hidden relative group/item cursor-pointer shadow-xl hover:scale-105 transition-all"
                          >
                            <Image src={img} fill className="object-cover" alt={`Foto exclusiva ${i + 1}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="text-[8px] text-brand-gold font-black uppercase tracking-wider">
                                ✨ Ver en 4K Ultra HD
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Blurred locked preview grid */}
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div 
                            key={i} 
                            onClick={() => setIsVaultModalOpen(true)}
                            className="aspect-square bg-brand-black rounded-2xl border border-brand-gold/30 overflow-hidden relative group/item cursor-pointer shadow-lg hover:border-brand-gold"
                          >
                            <Image src={model.images[0] || ""} fill className="object-cover blur-md brightness-50" alt="Locked vault preview" />
                            <div className="absolute inset-0 bg-brand-gold/10 backdrop-blur-md" />
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 relative z-10">
                              <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold">
                                <Lock size={13} />
                              </div>
                              <span className="text-[7px] text-brand-gold font-black uppercase tracking-widest">VIP #{i}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Secret Vault Call to Action Box */}
                      <div className="p-6 rounded-3xl glass-obsidian border border-brand-gold/35 text-center space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                        <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold mx-auto">
                          <Crown size={22} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-serif text-white italic">Bóveda Privada de {model.name}</h4>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest font-light max-w-sm mx-auto">
                            Desbloquea 6 fotos y videos sin censura con verificación biométrica 4K.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsVaultModalOpen(true)}
                          className="px-8 py-3.5 bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black text-[10px] font-black uppercase tracking-[0.25em] rounded-full hover:scale-105 transition-all shadow-[0_0_25px_rgba(212,168,67,0.4)]"
                        >
                          Desbloquear Bóveda VIP
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* VIP Ratings & Verified Reputation */}
            <div className="border-t border-white/10 pt-8 pb-4">
              <VIPRatings />
            </div>

            {/* Services List */}
            <div className="space-y-4 pb-28 border-t border-white/10 pt-8">
              <h3 className="text-[10px] text-white/40 uppercase font-black tracking-[0.4em]">Servicios Exclusivos</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {services.map((service, i) => (
                  <div key={i} className="p-4 glass-obsidian border border-white/10 rounded-2xl flex items-center justify-between hover:border-brand-gold/40 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-serif text-brand-gold/40 italic">{String(i+1).padStart(2, '0')}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">{service}</span>
                    </div>
                    <Sparkles size={14} className="text-brand-gold/40" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── FIXED OBSIDIAN CONVERSION BAR ── */}
      <div className="fixed bottom-0 inset-x-0 z-[120] p-4 md:p-6 flex justify-center pointer-events-none">
        <div className="max-w-3xl w-full pointer-events-auto">
          <div className="glass-obsidian px-5 py-4 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.95)] flex flex-col sm:flex-row items-center justify-between gap-4 border border-brand-gold/40">
            
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-brand-gold/40 flex-shrink-0">
                <Image src={model.images[0]} fill className="object-cover" alt="Avatar" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-serif text-white italic font-bold">{model.name}</span>
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-bold">4K VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {availabilityLabel}
                  </span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-[9px] text-brand-gold font-mono font-bold">
                    {rateDetails[selectedRate]?.price} ({rateDetails[selectedRate]?.time})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Optional Telegram Button */}
              {model.telegram && (
                <a
                  href={`https://t.me/${model.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#229ED9]/15 border border-[#229ED9]/40 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all shadow-md hover:scale-105"
                  title="Contactar 100% Anónimo por Telegram"
                >
                  <Send size={15} />
                </a>
              )}

              {/* Optional Email Button */}
              {model.email && (
                <a
                  href={`mailto:${model.email}?subject=${encodeURIComponent(`Reserva VIP Cariñosas.top - ${model.name}`)}`}
                  className="p-3.5 rounded-2xl glass-dark border border-white/15 text-white/60 hover:text-white hover:border-brand-gold/40 transition-all shadow-md hover:scale-105"
                  title="Enviar Correo de Reservas"
                >
                  <Mail size={15} />
                </a>
              )}

              <button 
                onClick={() => handleContact()}
                className="flex-1 sm:flex-none px-7 py-3.5 bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] hover:scale-105 active:scale-95 text-brand-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,168,67,0.4)] cursor-pointer"
              >
                <MessageCircle size={15} fill="currentColor" />
                <span>Reservar por WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── FULLSCREEN STORY / REELS VIEWER MODAL ── */}
      <AnimatePresence>
        {storyOpenIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setStoryOpenIndex(null)}
              className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full glass-obsidian border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative w-full max-w-md h-[85vh] rounded-[2.5rem] overflow-hidden border border-brand-gold/40 shadow-2xl">
              <Image
                src={model.images[storyOpenIndex]}
                alt={`${model.name} story`}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

              {/* Story Top Progress Bar */}
              <div className="absolute top-4 inset-x-4 flex gap-1.5 z-20">
                {model.images.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                    <div className={`h-full bg-brand-gold transition-all duration-300 ${i === storyOpenIndex ? 'w-full' : i < storyOpenIndex ? 'w-full' : 'w-0'}`} />
                  </div>
                ))}
              </div>

              {/* Story Info Footer */}
              <div className="absolute bottom-6 inset-x-6 z-20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif text-white font-bold italic">{model.name}</h3>
                    <p className="text-xs text-brand-gold">{model.location}</p>
                  </div>
                  <button 
                    onClick={() => handleContact(`Hola ${model.name}, vi tu Story 4K en Cariñosas.top. ¿Tienes disponibilidad para una cita?`)}
                    className="px-6 py-2.5 bg-brand-gold text-brand-black rounded-full font-black text-xs uppercase tracking-wider shadow-lg"
                  >
                    Contactar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECRET VAULT UNLOCK MODAL ── */}
      <AnimatePresence>
        {isVaultModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-obsidian border border-brand-gold/40 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.9)] space-y-6 text-center"
            >
              <button
                onClick={() => setIsVaultModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>

              <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold mx-auto">
                <Crown size={30} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white italic">
                  Bóveda Secreta 4K
                </h3>
                <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                  Acceso exclusivo a fotos y videos privados de {model.name}.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="p-4 rounded-2xl glass-dark border border-brand-gold/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-black block">Pase de Bóveda</span>
                    <span className="text-lg font-serif font-bold text-brand-gold">$35 USD / Acceso Ilimitado</span>
                  </div>
                  <ShieldCheck size={22} className="text-brand-gold" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsVaultModalOpen(false);
                    handleContact(`Hola ${model.name}, deseo adquirir el Pase de tu Bóveda Secreta 4K ($35 USD). ¿Cómo coordinamos el acceso?`);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-all"
                >
                  Solicitar Acceso Inmediato
                </button>
                <button
                  onClick={() => setIsVaultModalOpen(false)}
                  className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest font-bold block mx-auto pt-2"
                >
                  Cerrar
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
