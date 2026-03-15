"use client";

import Image from "next/image";
import { MessageCircle, MapPin } from "lucide-react";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  isVip?: boolean;
}

export default function ProfileCard({ name, age, location, imageUrl, isVip = true }: ProfileCardProps) {
  return (
    <div className="group relative bg-brand-black border border-brand-gold/20 rounded-xl overflow-hidden transition-all duration-500 hover:border-brand-pink/50 glow-pink">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* VIP Badge */}
        {isVip && (
          <div className="absolute top-3 left-3 bg-brand-gold text-brand-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            TOP VIP
          </div>
        )}
        
        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent">
          <h3 className="text-2xl font-serif text-brand-white mb-1">{name}</h3>
          <div className="flex items-center gap-4 text-brand-white/70 text-sm">
            <span>{age} años</span>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-brand-pink" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="#"
        className="absolute bottom-4 right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-subtle"
      >
        <MessageCircle size={24} fill="currentColor" />
      </a>
      
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
