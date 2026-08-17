"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { MessageCircle, Star, ShieldCheck, Zap, Heart, Crown, Diamond, Fingerprint, Eye, Volume2, VolumeX, MapPin, Radio } from "lucide-react";
import WhatsAppTransition from "./WhatsAppTransition";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { sound } from "@/lib/soundEngine";

interface ProfileCardProps {
  id?: string;
  name: string;
  age: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  isVip?: boolean;
  isBoosted?: boolean;
  sector?: string | null;
  whatsapp?: string;
  tags?: string[] | null;
  plan_type?: string;
  personal_note?: string;
  is_verified_4k?: boolean;
}

export default function ProfileCard({
  id, name, age, location, imageUrl, images,
  isBoosted = false, whatsapp, plan_type,
  personal_note = "Un encuentro inolvidable te espera...",
  is_verified_4k = false
}: ProfileCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 3D Motion Physics for multi-plane depth
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 22 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-9deg", "9deg"]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleCardMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const isFree = useMemo(() =>
    !plan_type || plan_type === 'Gratis' || plan_type === 'Anuncio Gratis' || plan_type === 'Básico'
  , [plan_type]);

  const isAnimating = isHovered || isVisible;

  const tierConfig = useMemo(() => {
    if (plan_type === 'VIP Elite') return {
      label: 'VIP ELITE',
      color: '#D4A843',
      bg: 'rgba(212,168,67,0.15)',
      border: 'rgba(212,168,67,0.4)',
      Icon: Crown
    };
    if (plan_type === 'Diamante') return {
      label: 'DIAMANTE',
      color: '#D4A843',
      bg: 'rgba(212,168,67,0.12)',
      border: 'rgba(212,168,67,0.35)',
      Icon: Diamond
    };
    if (plan_type === 'Oro') return {
      label: 'ORO',
      color: '#FF5E8A',
      bg: 'rgba(255,0,98,0.12)',
      border: 'rgba(255,0,98,0.3)',
      Icon: Diamond
    };
    if (plan_type === 'Premium') return {
      label: 'PREMIUM',
      color: 'rgba(255,255,255,0.85)',
      bg: 'rgba(255,255,255,0.08)',
      border: 'rgba(255,255,255,0.18)',
      Icon: ShieldCheck
    };
    return null;
  }, [plan_type]);

  useEffect(() => {
    if (!(("IntersectionObserver" in window))) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px", threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const allImages = useMemo(() => {
    if (images && images.length > 0) return images;
    if (imageUrl) return [imageUrl];
    return ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'];
  }, [images, imageUrl]);

  useEffect(() => {
    if (!isAnimating || allImages.length <= 1) {
      setProgress(0);
      return;
    }
    const duration = 2800;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / duration) * 100;
      if (newProgress >= 100) {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        setProgress(0);
      } else {
        setProgress(newProgress);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isAnimating, currentImageIndex, allImages.length]);

  useEffect(() => {
    if (!isAnimating) {
      setCurrentImageIndex(0);
      setProgress(0);
    }
  }, [isAnimating]);

  const handleContact = () => {
    sound.playGoldChime();
    setIsTransitioning(true);
    if (whatsapp) {
      const phone = whatsapp.replace(/\D/g, '');
      const fullPhone = phone.startsWith('593') ? phone : `593${phone.replace(/^0/, '')}`;
      setTimeout(() => {
        window.open(`https://wa.me/${fullPhone}?text=Hola%20${encodeURIComponent(name)}%2C%20vi%20tu%20perfil%20en%20Cari%C3%B1osas.top%20%F0%9F%94%A5`, '_blank');
        setIsTransitioning(false);
      }, 1100);
    } else {
      setTimeout(() => setIsTransitioning(false), 1500);
    }
  };

  return (
    <div className="relative group" style={{ perspective: 1200 }}>
      {/* Glow layer for boosted */}
      {isBoosted && (
        <div className="absolute -inset-[1px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.6), rgba(212,168,67,0.12), rgba(212,168,67,0.6))',
            filter: 'blur(8px)',
          }}
        />
      )}

      <motion.div
        ref={cardRef}
        whileTap={{ scale: 0.98 }}
        onMouseMove={handleCardMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleCardMouseLeave}
        onClick={() => router.push(`/profile/${id}`)}
        className={`relative group cursor-pointer rounded-[2rem] overflow-hidden border card-premium ${
          isBoosted ? 'boost-pulse border-brand-gold/25' : 'border-white/8'
        } ${isHovered ? 'border-brand-gold/40' : ''}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: 'rgba(14,14,20,0.97)',
          boxShadow: isHovered
            ? '0 30px 80px rgba(0,0,0,0.75), 0 0 60px rgba(212,168,67,0.15)'
            : '0 8px 30px rgba(0,0,0,0.45)',
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* ── Story Progress Bars ── */}
        <div className="absolute top-3.5 left-5 right-5 z-40 flex gap-1.5">
          {allImages.map((_, i) => (
            <div key={i} className="flex-1 h-[2.5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-full rounded-full transition-none"
                style={{
                  width: i < currentImageIndex ? '100%' : i === currentImageIndex ? `${progress}%` : '0%',
                  background: 'linear-gradient(90deg, #D4A843, #F8E5AE)',
                  boxShadow: '0 0 8px rgba(212,168,67,0.6)',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Action Buttons ── */}
        <div 
          className="absolute top-4 right-4 z-40 flex flex-col gap-2 transition-all duration-500 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          style={{ transform: "translateZ(40px)" }}
        >
          <button
            onClick={e => {
              e.stopPropagation();
              sound.playSubtleClick();
              setIsLiked(!isLiked);
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: isLiked ? 'rgba(255,0,98,0.25)' : 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isLiked ? 'rgba(255,0,98,0.5)' : 'rgba(255,255,255,0.12)'}`,
            }}
          >
            <Heart size={14} className={`transition-colors ${isLiked ? 'text-[#FF0062] fill-[#FF0062]' : 'text-white/60'}`} />
          </button>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Eye size={14} className="text-white/60" />
          </button>
        </div>

        {/* ── Tier Badge ── */}
        {tierConfig && (
          <div className="absolute top-10 left-4 z-30 tier-badge"
            style={{ 
              transform: "translateZ(35px)",
              background: tierConfig.bg, 
              border: `1px solid ${tierConfig.border}`, 
              backdropFilter: 'blur(12px)', 
              color: tierConfig.color 
            }}
          >
            <tierConfig.Icon size={10} style={{ fill: tierConfig.color }} />
            <span>{tierConfig.label}</span>
          </div>
        )}

        {/* ── Verified Badge ── */}
        {!isFree && (
          <div className="absolute z-30 tier-badge"
            style={{
              top: tierConfig ? '5.5rem' : '2.75rem',
              left: '1rem',
              background: is_verified_4k ? 'rgba(212,168,67,0.18)' : 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: is_verified_4k ? '1px solid rgba(212,168,67,0.45)' : '1px solid rgba(255,255,255,0.12)',
              color: is_verified_4k ? '#D4A843' : 'rgba(255,255,255,0.6)',
            }}
          >
            {is_verified_4k ? (
              <>
                <Zap size={10} className="fill-[#D4A843] text-[#D4A843]" />
                <span>4K VERIFIED</span>
              </>
            ) : (
              <>
                <Fingerprint size={10} />
                <span>Verificado</span>
              </>
            )}
          </div>
        )}

        {/* ── Touch Zones ── */}
        <div className="absolute inset-0 z-30 flex">
          <div className="w-[35%] h-full cursor-w-resize" onClick={e => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length); setProgress(0); }} />
          <div className="flex-1" />
          <div className="w-[35%] h-full cursor-e-resize" onClick={e => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % allImages.length); setProgress(0); }} />
        </div>

        {/* ── IMAGE ── */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#08080C]">
          {/* Dark Skeleton Loader Placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 z-20 skeleton-dark flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
            </div>
          )}

          {allImages.map((img, i) => {
            if (i > 0 && !isAnimating) return null;
            return (
              <Image
                key={i}
                src={img}
                alt={`${name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover absolute inset-0 transition-all duration-1000"
                onLoad={() => {
                  if (i === 0) setIsImageLoaded(true);
                }}
                style={{
                  opacity: i === currentImageIndex ? 1 : 0,
                  transform: i === currentImageIndex ? (isAnimating ? 'scale(1.04)' : 'scale(1)') : 'scale(1.08)',
                  filter: isHovered ? 'brightness(0.72) contrast(1.04)' : 'brightness(1.02) contrast(1.04) saturate(1.06)',
                  transition: 'opacity 0.8s ease, transform 1.2s cubic-bezier(0.23,1,0.32,1), filter 0.5s ease',
                }}
                priority={i === 0 && (is_verified_4k || isBoosted)}
                loading={i === 0 && (is_verified_4k || isBoosted) ? undefined : "lazy"}
              />
            );
          })}

          {/* Gradient overlay */}
          <div className="absolute inset-0 magazine-overlay pointer-events-none z-10" />

          {/* ── STATIC INFO (bottom) ── */}
          <div className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-2 transition-all duration-500 z-20 ${isHovered ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-none tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-emerald-500/40 backdrop-blur-md shrink-0 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">En Línea</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md backdrop-blur-md ${isFree ? 'bg-white/10 text-white/70 border border-white/10' : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'}`}>
                {isFree ? 'Estándar' : plan_type}
              </span>
              <span className="w-[3px] h-[3px] rounded-full bg-white/40" />
              <span className="text-[11px] text-white/90 font-medium flex items-center gap-1 drop-shadow-md">
                <MapPin size={12} className="text-[#D4AF37]" />
                {location}
              </span>
            </div>

            <p className="font-signature text-xl text-[#F5E0A0] -rotate-1 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              &ldquo;{personal_note}&rdquo;
            </p>
          </div>

          {/* ── HOVER INFO ── */}
          <div className={`absolute inset-0 p-7 flex flex-col justify-center transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ transform: isHovered ? 'translateX(0)' : 'translateX(-20px)' }}
          >
            <div className="space-y-5">
              <div className="space-y-1">
                <span className={`label-xs ${isFree ? 'text-white/25' : 'text-brand-gold/80'}`}>
                  {isFree ? 'Miembro Base' : 'Selección Especial'}
                </span>
                <h3 className="font-serif text-[3.2rem] text-white italic leading-none tracking-tighter">{name}</h3>
              </div>

              <div className="flex items-center gap-5">
                {[
                  { label: 'Edad', value: `${age} años` },
                  { label: 'Calificación', value: '4.9★' },
                  { label: 'Proximidad', value: 'Sector Cerca' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="label-xs text-white/30">{label}</span>
                    <span className="font-serif text-lg text-white leading-tight">{value}</span>
                  </div>
                ))}
              </div>

              <p className="body-sm text-white/45 leading-relaxed max-w-[220px]">
                {name} destaca por elegancia natural y discreción total en {location}.
              </p>

              {/* Mini stats */}
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl p-3 flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span className="label-xs text-white/35">Reseñas</span>
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="text-brand-gold fill-brand-gold" />
                    <span className="font-serif text-base text-white">4.9</span>
                  </div>
                </div>
                <div className="flex-1 rounded-xl p-3 flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span className="label-xs text-white/35">Respuesta</span>
                  <span className="font-serif text-sm text-brand-gold italic">&lt; 5 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTION BAR ── */}
        <div 
          className={`px-5 py-4 flex items-center justify-between transition-all duration-500 card-action-bar ${isHovered ? 'opacity-100' : 'opacity-90'}`}
          style={{ transform: "translateZ(45px)" }}
        >
          <div className="flex items-center gap-2.5">
            <button
              onClick={e => { e.stopPropagation(); handleContact(); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.04] active:scale-95 pointer-events-auto shadow-lg ${
                isFree
                  ? 'btn-ghost'
                  : 'bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black shadow-[0_4px_20px_rgba(212,168,67,0.35)] hover:brightness-110'
              }`}
            >
              <MessageCircle size={14} fill="currentColor" />
              {isFree ? 'WhatsApp' : 'WhatsApp VIP'}
            </button>

            {/* Audio Greeting preview trigger */}
            <button
              onClick={e => {
                e.stopPropagation();
                if (!isPlayingAudio) {
                  sound.playVoiceGreeting(3);
                  setIsPlayingAudio(true);
                  setTimeout(() => setIsPlayingAudio(false), 3000);
                } else {
                  setIsPlayingAudio(false);
                }
              }}
              title="Escuchar audio de voz"
              className={`p-3 rounded-xl border transition-all duration-300 active:scale-95 flex items-center justify-center pointer-events-auto ${
                isPlayingAudio
                  ? 'bg-brand-pink/20 border-brand-pink text-brand-pink shadow-[0_0_15px_rgba(255,0,98,0.4)]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-brand-gold hover:border-brand-gold/40'
              }`}
            >
              {isPlayingAudio ? (
                <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                  <span className="w-0.5 bg-brand-pink rounded-full sound-bar-1" />
                  <span className="w-0.5 bg-brand-pink rounded-full sound-bar-2" />
                  <span className="w-0.5 bg-brand-pink rounded-full sound-bar-3" />
                  <span className="w-0.5 bg-brand-pink rounded-full sound-bar-4" />
                </div>
              ) : (
                <Volume2 size={14} />
              )}
            </button>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <span className="label-xs text-white/40">Respuesta</span>
            <span className="body-sm font-bold italic text-brand-gold">&lt; 5 min</span>
          </div>
        </div>
      </motion.div>

      <WhatsAppTransition
        modelName={name}
        isOpen={isTransitioning}
        onComplete={() => setIsTransitioning(false)}
      />
    </div>
  );
}
