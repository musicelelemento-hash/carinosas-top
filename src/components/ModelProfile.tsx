"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Heart,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ModelProfileProps {
  model: {
    name: string;
    age: number;
    location: string;
    description: string;
    images: string[];
    services: string[];
    isVerified: boolean;
  };
}

export default function ModelProfile({ model }: ModelProfileProps) {
  return (
    <div className="relative min-h-screen bg-brand-black text-brand-white">
      {/* Back Button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-50 bg-brand-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 hover:border-brand-gold transition-colors group"
      >
        <ChevronLeft className="text-brand-white group-hover:text-brand-gold" size={24} />
      </Link>

      {/* Full Screen Gallery */}
      <div className="h-[70vh] md:h-screen w-full relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="h-full w-full"
        >
          {model.images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`${model.name} photo ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Info Panel - Magazine Style */}
      <div className="relative md:absolute md:bottom-12 md:right-12 z-20 w-full md:w-[450px] p-6 md:p-8">
        <div className="bg-brand-black/85 backdrop-blur-xl border border-brand-gold/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Pink Glow Background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-pink/10 blur-[60px] rounded-full" />
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-serif text-brand-gold tracking-tight">{model.name}</h1>
                {model.isVerified && (
                  <CheckCircle2 size={24} className="text-brand-pink fill-brand-pink/10" />
                )}
              </div>
              <div className="flex items-center gap-4 text-brand-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Heart size={14} className="text-brand-pink" /> 
                  {model.age} años
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-brand-pink" />
                  {model.location}
                </span>
              </div>
            </div>
            <div className="bg-brand-gold/10 border border-brand-gold/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={12} className="text-brand-gold fill-brand-gold" />
              <span className="text-brand-gold text-[10px] font-bold">PREMIUM</span>
            </div>
          </div>

          <p className="text-brand-white/80 leading-relaxed mb-8 italic">
            "{model.description}"
          </p>

          {/* Exclusive Details */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3 group">
              <div className="p-2 bg-brand-white/5 rounded-lg border border-white/5 group-hover:border-brand-gold/30 transition-colors">
                <ShieldCheck size={20} className="text-brand-gold" />
              </div>
              <span className="text-xs uppercase tracking-widest text-brand-white/60">Verificada</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2 bg-brand-white/5 rounded-lg border border-white/5 group-hover:border-brand-gold/30 transition-colors">
                <Star size={20} className="text-brand-gold" />
              </div>
              <span className="text-xs uppercase tracking-widest text-brand-white/60">Servicios VIP</span>
            </div>
          </div>

          {/* Services Tag Cloud */}
          <div className="flex flex-wrap gap-2 mb-10">
            {model.services.map(service => (
              <span 
                key={service} 
                className="text-[10px] uppercase tracking-wider px-3 py-1 border border-white/10 rounded-full text-brand-white/50 bg-white/5 hover:border-brand-pink/50 hover:text-brand-pink transition-colors"
              >
                {service}
              </span>
            ))}
          </div>

          {/* Giant Conversion Button */}
          <button className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-gold group">
            <MessageCircle size={24} fill="currentColor" />
            <span>Reservar Cita VIP</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: #D4AF37 !important;
          background: rgba(13, 13, 13, 0.4);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-blur: 4px;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
        }
        .swiper-pagination-bullet {
          background: #F5F5F5 !important;
          opacity: 0.3 !important;
        }
        .swiper-pagination-bullet-active {
          background: #D4AF37 !important;
          opacity: 1 !important;
          width: 24px !important;
          border-radius: 4px !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
