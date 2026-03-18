"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, MapPin, Star, ShieldCheck } from "lucide-react";
import WhatsAppTransition from "./WhatsAppTransition";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  isVip?: boolean;
  isBoosted?: boolean;
  sector?: string;
  whatsapp?: string;
}

export default function ProfileCard({ 
  name, 
  age, 
  location, 
  imageUrl,
  images,
  isVip = true,
  isBoosted = false,
  sector,
  whatsapp
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Build final image array from either images[] or imageUrl fallback
  const allImages = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (imageUrl) return [imageUrl];
    return ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'];
  }, [images, imageUrl]);

  // Slideshow: cycle through images on hover
  React.useEffect(() => {
    if (!isHovered || allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  // Reset to first image when hover ends
  React.useEffect(() => {
    if (!isHovered) setCurrentImageIndex(0);
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
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative glass rounded-[2rem] overflow-hidden transition-all duration-700 active:scale-[0.98] cursor-pointer border ${
          isBoosted 
            ? 'border-brand-pink/30 shadow-[0_0_40px_rgba(255,0,110,0.1)]' 
            : 'border-white/5 shadow-2xl'
        } ${isHovered ? 'border-brand-gold/40 -translate-y-2' : ''}`}
      >
        {/* Proximity Tag */}
        <div className="absolute top-6 left-6 z-30 flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
          <span className="text-[8px] text-white/80 font-black uppercase tracking-[0.2em]">Cerca de ti</span>
        </div>

        {/* Status Badges */}
        <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-2">
          {isBoosted && (
            <div className="bg-brand-pink text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg shadow-brand-pink/20 animate-bounce-subtle">
              ULTRA ÉLITE
            </div>
          )}
          {isVip && (
            <div className="glass-premium text-brand-gold border-brand-gold/20 px-3 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase flex items-center gap-1.5 shadow-xl">
              <Star size={10} fill="currentColor" />
              Verificada
            </div>
          )}
        </div>

        {/* Image Counter Dots (only if multiple images) */}
        {allImages.length > 1 && (
          <div className="absolute bottom-24 left-0 right-0 z-30 flex justify-center gap-1.5 pointer-events-none">
            {allImages.map((_, i) => (
              <div 
                key={i} 
                className={`rounded-full transition-all duration-300 ${
                  i === currentImageIndex 
                    ? 'w-4 h-1.5 bg-brand-gold' 
                    : 'w-1.5 h-1.5 bg-white/30'
                }`} 
              />
            ))}
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-black">
          {allImages.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`${name} ${i + 1}`}
              fill
              className={`object-cover transition-all duration-700 absolute inset-0 ${
                i === currentImageIndex ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110 blur-[2px] brightness-50' : 'scale-100'} ease-out-expo`}
              priority={i === 0}
            />
          ))}
          
          {/* Elite Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] opacity-60 pointer-events-none" />

          {/* Info Overlay (Static) */}
          <div className={`absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-3xl font-serif text-white tracking-tight">{name}</h3>
                <ShieldCheck size={18} className="text-brand-gold" />
              </div>
              <div className="flex items-center gap-4 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>{age} Años</span>
                <div className="w-1 h-1 rounded-full bg-brand-gold/30" />
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-brand-pink" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Info (Hover) */}
          <div className={`absolute inset-0 p-8 flex flex-col justify-center items-center text-center space-y-6 transition-all duration-700 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} pointer-events-none`}>
            <div className="space-y-2">
              <h3 className="text-4xl font-serif text-brand-gold-light italic tracking-tight">{name}</h3>
              <p className="text-[10px] text-white/60 uppercase tracking-[0.4em] font-black">Elite Model VIP</p>
              {sector && <p className="text-[8px] text-brand-gold/60 uppercase tracking-widest font-black">{sector}</p>}
            </div>
            
            <div className="flex gap-4">
               {[
                 { label: 'Estatura', val: '1.70' },
                 { label: 'Busto', val: '95' },
                 { label: 'Cintura', val: '60' }
               ].map(stat => (
                 <div key={stat.label} className="flex flex-col">
                   <span className="text-[7px] text-brand-gold/40 uppercase font-black tracking-widest">{stat.label}</span>
                   <span className="text-sm text-white font-serif italic">{stat.val}</span>
                 </div>
               ))}
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

            <div className="bg-brand-gold text-brand-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(212,175,55,0.3)] transform hover:scale-105 transition-transform active:scale-95 flex items-center gap-3">
              Ver Detalles VIP
            </div>
          </div>
        </div>

        {/* Floating WhatsApp Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleContact();
          }}
          className={`absolute bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.3)] transition-all duration-500 hover:scale-110 active:scale-95 z-40 transform ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-2 scale-90'}`}
        >
          <MessageCircle size={24} fill="currentColor" />
        </button>
      </div>

      <WhatsAppTransition 
        modelName={name} 
        isOpen={isTransitioning} 
        onComplete={() => setIsTransitioning(false)} 
      />

      <style jsx global>{`
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
