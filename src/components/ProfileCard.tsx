"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, MapPin } from "lucide-react";
import WhatsAppTransition from "./WhatsAppTransition";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  isVip?: boolean;
  isBoosted?: boolean;
}

export default function ProfileCard({ 
  name, 
  age, 
  location, 
  imageUrl, 
  isVip = true,
  isBoosted = false
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleContact = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      // In a real app, this would redirect to WhatsApp
      window.location.href = "#";
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative glass rounded-2xl overflow-hidden transition-all duration-500 active:scale-[0.98] cursor-pointer border ${
          isBoosted ? 'neon-pink animate-pulse-subtle border-brand-pink/50' : 'border-brand-gold/20'
        } ${isHovered ? 'neon-pink' : ''}`}
      >
        {/* Boost Badge */}
        {isBoosted && (
          <div className="absolute top-4 right-4 z-30 bg-brand-pink text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter animate-bounce-subtle">
            Boosted
          </div>
        )}

        {/* Image/Video Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Static Image */}
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={`object-cover transition-all duration-1000 ${isHovered ? 'scale-110 blur-sm opacity-50' : 'scale-100 opacity-100'}`}
          />

          {/* Live Moments (Video Simulation) */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-black/20 animate-in fade-in duration-500">
               {/* In a real app, this would be a <video> tag */}
               <div className="w-full h-full relative">
                  <Image 
                    src={imageUrl} 
                    alt="Live Moment" 
                    fill 
                    className="object-cover animate-pulse" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/20 to-transparent" />
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-brand-pink text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    LIVE
                  </div>
               </div>
            </div>
          )}

          {/* VIP Badge */}
          {isVip && (
            <div className="absolute top-4 left-4 glass-dark text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase z-10">
              {isBoosted ? 'ULTRA ELITE' : 'ELITE GOLD'}
            </div>
          )}
          
          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent z-10">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
               <span className="text-[8px] text-brand-white/60 font-black uppercase tracking-[0.2em]">A menos de 2km de ti</span>
            </div>
            <h3 className="text-2xl font-serif text-brand-white mb-1 tracking-tight text-glow">{name}</h3>
            <div className="flex items-center gap-4 text-brand-white/80 text-sm font-medium">
              <span className="bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-md">{age} años</span>
              <div className="flex items-center gap-1.5 border-l border-white/20 pl-4">
                <MapPin size={14} className="text-brand-pink" />
                <span className="tracking-wide uppercase text-[10px]">{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Overlay (Hover) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <div className="flex flex-col items-center gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
               <div className="bg-brand-gold text-brand-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-gold flex items-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-brand-black/10 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-black animate-pulse" />
                 </div>
                 Solicitar Encuentro VIP
               </div>
               <span className="text-[8px] text-brand-white/40 uppercase font-black tracking-widest">Disponibilidad Inmediata</span>
            </div>
        </div>

        {/* Floating WhatsApp Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleContact();
          }}
          className="absolute bottom-4 right-4 bg-[#25D366] text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-40 glass-dark border-none"
        >
          <MessageCircle size={20} fill="currentColor" />
        </button>
      </div>

      {/* Intermediary Transition */}
      <WhatsAppTransition 
        modelName={name} 
        isOpen={isTransitioning} 
        onComplete={() => setIsTransitioning(false)} 
      />

      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite ease-in-out;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
