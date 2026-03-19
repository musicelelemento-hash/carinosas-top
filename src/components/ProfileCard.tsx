"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { MessageCircle, MapPin, Star, ShieldCheck, Zap, Heart, Share2, Crown, Diamond, TrendingUp, Fingerprint } from "lucide-react";
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
  personal_note?: string;
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
  plan_type,
  personal_note = "Un encuentro inolvidable te espera..."
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

    const duration = 2400; // Slightly slower for elegance
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
        <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-gold/40 via-white/20 to-brand-gold/40 bg-[length:200%_auto] animate-gradient-slow rounded-[2.5rem] opacity-20 blur-sm group-hover:opacity-60 transition-opacity duration-1000" />
      )}

      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/profile/${id}`)}
        className={`relative bg-brand-black rounded-[2.4rem] overflow-hidden transition-all duration-1000 active:scale-[0.99] cursor-pointer border ${
          isHovered ? 'border-brand-gold/30 -translate-y-4 shadow-[0_30px_60px_rgba(0,0,0,0.8)]' : 'border-white/5 shadow-2xl'
        }`}
      >
        {/* Instagram Story-style Bars */}
        <div className="absolute top-4 left-6 right-6 z-40 flex gap-2 h-[1px]">
          {allImages.map((_, i) => (
            <div key={i} className="flex-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-gold transition-all duration-300 ease-linear"
                style={{ 
                  width: i < currentImageIndex ? '100%' : (i === currentImageIndex ? `${progress}%` : '0%') 
                }}
              />
            </div>
          ))}
        </div>

        {/* Human Identity Badge - Non Invasive */}
        <div className="absolute top-10 left-8 z-30 flex items-center gap-2.5 glass-premium px-4 py-2 rounded-full border-white/5 human-pulse group/human">
           <Fingerprint size={12} className="text-brand-gold group-hover/human:rotate-12 transition-transform" />
           <span className="text-[8px] text-white/80 font-black uppercase tracking-[0.2em]">Verified Human Identity</span>
        </div>

        {/* Tier Indicators */}
        <div className="absolute top-24 left-8 z-30 flex flex-col gap-2">
          {plan_type === 'VIP Elite' ? (
            <div className="bg-brand-gold/10 backdrop-blur-3xl border border-brand-gold/30 p-2.5 rounded-2xl shadow-gold">
               <Crown size={14} className="text-brand-gold fill-brand-gold" />
            </div>
          ) : plan_type === 'Diamante' ? (
            <div className="bg-brand-pink/10 backdrop-blur-3xl border border-brand-pink/30 p-2.5 rounded-2xl">
               <Diamond size={14} className="text-brand-pink fill-brand-pink" />
            </div>
          ) : null}
        </div>

        {/* Action Buttons (Visible on Hover) */}
        <div className="absolute top-10 right-8 z-30 flex flex-col gap-4 transition-all duration-700 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100">
          <button className="p-3 bg-white/5 hover:bg-brand-pink/20 backdrop-blur-xl rounded-2xl text-white/40 hover:text-brand-pink hover:scale-110 transition-all border border-white/10">
            <Heart size={16} />
          </button>
          <button className="p-3 bg-white/5 hover:bg-brand-gold/20 backdrop-blur-xl rounded-2xl text-white/40 hover:text-brand-gold hover:scale-110 transition-all border border-white/10">
            <Share2 size={16} />
          </button>
        </div>

        {/* Main Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-black">
          {allImages.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`${name} photo`}
              fill
              className={`object-cover transition-all duration-1000 absolute inset-0 ${
                i === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              } ${isHovered ? 'brightness-[0.3] scale-105' : 'brightness-90'}`}
              priority={i === 0}
            />
          ))}
          
          {/* Magazine Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-90" />
          
          {/* Static Content (Bottom) */}
          <div className={`absolute inset-x-0 bottom-0 p-10 space-y-4 transition-all duration-700 ${isHovered ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="space-y-1">
              <h3 className="text-4xl font-serif text-white tracking-tighter leading-none">{name}</h3>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em]">{plan_type || 'Elite Member'}</span>
                 <div className="w-1 h-1 rounded-full bg-white/20" />
                 <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">{location}</span>
              </div>
            </div>
            
            <div className="font-signature text-2xl text-brand-gold/60 opacity-80 -rotate-2">
               {personal_note}
            </div>
          </div>

          {/* Hover Detail View (Magazine Style) */}
          <div className={`absolute inset-0 p-10 flex flex-col justify-center items-start text-left space-y-10 transition-all duration-1000 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} pointer-events-none`}>
            <div className="space-y-4">
               <span className="text-[11px] text-brand-gold font-black uppercase tracking-[0.5em] leading-none">Curated Selection</span>
               <h3 className="text-7xl font-serif text-white italic leading-none">{name}</h3>
               <div className="flex items-center gap-6 pt-2">
                  <div className="flex flex-col">
                     <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Edad</span>
                     <span className="text-xl font-serif text-white">{age}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col">
                     <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Estatura</span>
                     <span className="text-xl font-serif text-white">1.72</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col">
                     <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Verified</span>
                     <ShieldCheck size={18} className="text-brand-gold mt-1" />
                  </div>
               </div>
            </div>

            <p className="text-xs text-brand-white/40 leading-relaxed max-w-xs font-medium tracking-wide">
              {name} destaca por su elegancia natural y su capacidad para crear momentos de absoluta discreción y sofisticación en {location}.
            </p>

            <div className="flex gap-4 w-full">
               <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-xl">
                  <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">Reviews</span>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-brand-gold fill-brand-gold" />
                    <span className="text-lg font-serif text-white">4.9</span>
                  </div>
               </div>
               <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-xl">
                  <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-black uppercase text-white/80 tracking-widest">Online</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Premium Action Bar */}
        <div className={`p-6 flex items-center justify-between transition-all duration-700 ${isHovered ? 'bg-brand-gold/10' : 'bg-transparent'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); handleContact(); }}
              className="px-10 py-5 bg-white hover:bg-brand-gold text-brand-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 pointer-events-auto"
            >
              <MessageCircle size={16} fill="currentColor" />
              WhatsApp VIP
            </button>
            
            <div className="flex flex-col items-end opacity-20 group-hover:opacity-100 transition-opacity duration-700">
               <span className="text-[8px] text-white font-black uppercase tracking-widest mb-1">Response Time</span>
               <span className="text-[11px] text-brand-gold font-black tracking-widest italic uppercase">Sub 5min</span>
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
          animation: gradient-slow 8s infinite linear;
        }
      `}</style>
    </div>
  );
}
