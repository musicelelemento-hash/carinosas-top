"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { MessageCircle, MapPin, Star, ShieldCheck, Zap, Heart, Share2, Crown, Diamond, TrendingUp } from "lucide-react";
import WhatsAppTransition from "./WhatsAppTransition";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  id?: string;
  name: string;
  age: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  isVip?: boolean;
  isBoosted?: boolean;
  sector?: string;
  whatsapp?: string;
  tags?: string[];
  plan_type?: string;
}

export default function ProfileCard({ 
  id,
  name, 
  age, 
  location, 
  imageUrl,
  images,
  isVip = true,
  isBoosted = false,
  sector,
  whatsapp,
  tags = [],
  plan_type
}: ProfileCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Build final image array
  const allImages = useMemo(() => {
    if (images && images.length > 0) return images;
    if (imageUrl) return [imageUrl];
    return ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'];
  }, [images, imageUrl]);

  // Instagram-style Story Progress Logic
  useEffect(() => {
    if (!isHovered || allImages.length <= 1) {
      setProgress(0);
      return;
    }

    const duration = 2000; // 2 seconds per image
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / duration) * 100;
      
      if (newProgress >= 100) {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        setProgress(0);
        // This effect will re-run because currentImageIndex/startTime changes? 
        // Actually, we need a better way to handle the continuous loop.
      } else {
        setProgress(newProgress);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, currentImageIndex, allImages.length]);

  // Reset when hover ends
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
      setProgress(0);
    }
  }, [isHovered]);

  const handleContact = () => {
    setIsTransitioning(true);
    if (whatsapp) {
      const phone = whatsapp.replace(/\D/g, '');
      const fullPhone = phone.startsWith('593') ? phone : `593${phone.replace(/^0/, '')}`;
      setTimeout(() => {
        window.open(`https://wa.me/${fullPhone}?text=Hola%20${encodeURIComponent(name)}%2C%20vi%20tu%20perfil%20en%20Cari%C3%B1osas.top%20%F0%9F%94%A5`, '_blank');
        setIsTransitioning(false);
      }, 1200);
    } else {
      setTimeout(() => setIsTransitioning(false), 1500);
    }
  };

  return (
    <div className="relative group">
      {/* Premium Border Glow Layer */}
      {isBoosted && (
        <div className="absolute -inset-[2px] bg-gradient-to-r from-brand-gold via-brand-pink to-brand-gold bg-[length:200%_auto] animate-gradient-slow rounded-[2.2rem] opacity-30 blur-sm group-hover:opacity-100 transition-opacity duration-700" />
      )}

      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/profile/${id}`)}
        className={`relative glass-dark rounded-[2.1rem] overflow-hidden transition-all duration-700 active:scale-[0.98] cursor-pointer border ${
          isHovered ? 'border-brand-gold/50 -translate-y-3' : 'border-white/5'
        } shadow-2xl`}
      >
        {/* Instagram Story-style Bars */}
        <div className="absolute top-3 left-4 right-4 z-40 flex gap-1.5 h-[2px]">
          {allImages.map((_, i) => (
            <div key={i} className="flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-gold transition-all duration-300 ease-linear"
                style={{ 
                  width: i < currentImageIndex ? '100%' : (i === currentImageIndex ? `${progress}%` : '0%') 
                }}
              />
            </div>
          ))}
        </div>

        {/* Tiered Plan Badges & Status */}
        <div className="absolute top-8 left-6 z-30 flex flex-col gap-2">
          {plan_type === 'VIP Elite' ? (
            <div className="flex items-center gap-2 bg-brand-gold/20 backdrop-blur-xl border border-brand-gold/40 px-3 py-1.5 rounded-full scale-100 origin-left shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Crown size={12} className="text-brand-gold fill-brand-gold" />
              <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.3em]">VIP ELITE ALPHA</span>
            </div>
          ) : plan_type === 'Diamante' ? (
            <div className="flex items-center gap-2 bg-brand-pink/20 backdrop-blur-xl border border-brand-pink/40 px-3 py-1.5 rounded-full scale-100 origin-left shadow-[0_0_20px_rgba(255,0,110,0.3)]">
              <Diamond size={12} className="text-brand-pink fill-brand-pink" />
              <span className="text-[9px] text-brand-pink font-black uppercase tracking-[0.3em]">DIAMOND STATUS</span>
            </div>
          ) : plan_type === 'Premium' ? (
            <div className="flex items-center gap-2 glass-premium px-3 py-1.5 rounded-full border-brand-gold/20 scale-90 origin-left">
              <Star size={12} className="text-brand-gold fill-brand-gold" />
              <span className="text-[8px] text-white font-black uppercase tracking-[0.2em]">PREMIUM</span>
            </div>
          ) : plan_type === 'Anuncio Gratis' || plan_type === 'Básico' ? (
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full scale-90 origin-left">
              <span className="text-[7px] text-white/40 font-black uppercase tracking-[0.2em]">ANUNCIO GRATIS</span>
            </div>
          ) : null}
        </div>

        {/* Real-time Status Indicator - "Live Ahora" at top-right */}
        <div className="absolute top-8 right-6 z-30 flex items-center gap-2 bg-brand-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full animate-in fade-in zoom-in duration-1000">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-[8px] font-black text-white/90 uppercase tracking-[0.2em]">Live Ahora</span>
        </div>


        {/* Gamification Badges - Bottom Left */}
        <div className="absolute bottom-6 left-6 z-30 flex gap-2">
           <div className="bg-brand-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-xl group/badge hover:bg-brand-gold/20 transition-all">
              <Zap size={14} className="text-brand-gold animate-pulse" />
           </div>
           <div className="bg-brand-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-xl group/badge hover:bg-brand-gold/20 transition-all">
              <Star size={14} className="text-brand-gold fill-brand-gold/40" />
           </div>
           <div className="bg-brand-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-xl group/badge hover:bg-brand-gold/20 transition-all">
              <TrendingUp size={14} className="text-brand-gold" />
           </div>
        </div>

        {/* Action Buttons (Visible on Hover) */}
        <div className="absolute top-8 right-6 z-30 flex flex-col gap-3 transition-all duration-500 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100">
          <button className="p-2.5 glass-premium rounded-full text-white/60 hover:text-brand-pink hover:scale-110 transition-all">
            <Heart size={16} />
          </button>
          <button className="p-2.5 glass-premium rounded-full text-white/60 hover:text-brand-gold hover:scale-110 transition-all">
            <Share2 size={16} />
          </button>
        </div>

        {/* Main Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-black">
          {allImages.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`${name} photo`}
              fill
              className={`object-cover transition-all duration-1000 absolute inset-0 ${
                i === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              } ${isHovered ? 'brightness-[0.4] scale-105' : 'brightness-100'}`}
              priority={i === 0}
            />
          ))}
          
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-90" />
          <div className={`absolute inset-0 bg-brand-gold/10 mix-blend-overlay transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* Bottom Info - Static Appearance */}
          <div className={`absolute inset-x-0 bottom-0 p-8 space-y-3 transition-all duration-700 ${isHovered ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-serif text-white tracking-tight">{name}</h3>
              <ShieldCheck size={20} className="text-brand-gold" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-white/60 font-black uppercase tracking-widest">
                <MapPin size={12} className="text-brand-pink" />
                {location}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="text-[10px] text-white/60 font-black uppercase tracking-widest">
                {age} Años
              </div>
            </div>

            {/* Tags preview */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[7px] text-brand-gold/60 border border-brand-gold/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Info - Hover Appearance */}
          <div className={`absolute inset-0 p-8 flex flex-col justify-center items-center text-center space-y-8 transition-all duration-700 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} pointer-events-none`}>
            <div className="space-y-3">
               {isBoosted ? (
                 <div className="flex items-center justify-center gap-2 mb-2">
                   <Star size={12} className="text-brand-gold fill-brand-gold" />
                   <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em]">Diamond Selection</span>
                   <Star size={12} className="text-brand-gold fill-brand-gold" />
                 </div>
               ) : (
                 <p className="text-[10px] text-brand-gold-light uppercase tracking-[0.4em] font-black">Elite Member</p>
               )}
               <h3 className="text-5xl font-serif text-white italic tracking-tighter">{name}</h3>
               <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium max-w-[200px] leading-relaxed mx-auto">
                 Disponibilidad inmediata en el sector de {sector || location}.
               </p>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full">
              {[
                { label: 'Estatura', val: '1.72' },
                { label: 'Ojos', val: 'Café' },
                { label: 'Plan', val: isBoosted ? 'Elite' : 'Vip' }
              ].map(stat => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-[8px] text-brand-gold/50 uppercase font-black tracking-widest">{stat.label}</span>
                  <span className="text-sm text-white font-serif">{stat.val}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 w-full animate-in slide-in-from-bottom-4 duration-500">
               <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 flex flex-col items-center">
                  <span className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Citas Hoy</span>
                  <span className="text-lg font-serif text-brand-gold">12</span>
               </div>
               <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 flex flex-col items-center">
                  <span className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Rating</span>
                  <div className="flex items-center gap-1 text-brand-gold">
                    <Star size={12} fill="currentColor" />
                    <span className="text-lg font-serif">4.9</span>
                  </div>
               </div>
            </div>
            
            <div className="w-full flex items-center justify-center gap-4">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
              <span className="text-[9px] text-white/70 uppercase font-black tracking-[0.3em] inline-block">Online Ahora</span>
            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className={`p-5 flex items-center justify-between border-t border-white/5 transition-colors duration-500 ${isHovered ? 'bg-brand-gold/5' : 'bg-transparent'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); handleContact(); }}
              className="px-8 py-3.5 bg-brand-gold text-brand-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-brand-gold/10 hover:scale-[1.05] active:scale-95 transition-all pointer-events-auto"
            >
              <MessageCircle size={14} fill="currentColor" />
              WhatsApp VIP
            </button>
            
            <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
               <span className="text-[7px] text-white/40 uppercase font-black tracking-widest">Disponibilidad</span>
               <span className="text-[10px] text-white font-black tracking-widest italic uppercase">Alta</span>
            </div>
        </div>
      </div>

      <WhatsAppTransition 
        modelName={name} 
        isOpen={isTransitioning} 
        onComplete={() => setIsTransitioning(false)} 
      />

      <style jsx global>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          animation: gradient-slow 6s infinite linear;
        }
      `}</style>
    </div>
  );
}
