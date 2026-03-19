"use client";

import React from "react";
import Link from "next/link";
import { User, Menu, Sparkles, MapPin } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
      scrolled 
        ? "h-20 bg-brand-black/60 backdrop-blur-3xl border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" 
        : "h-32 bg-transparent"
    }`}>
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 h-full">
        <div className="flex justify-between items-center h-full">
          
          <div className="flex items-center gap-12">
            <Link href="/" className="group flex flex-col items-start">
              <span className="text-3xl md:text-4xl font-serif text-brand-gold tracking-[0.15em] group-hover:text-white transition-all duration-700 leading-none">
                CARIÑOSAS<span className="text-white group-hover:text-brand-gold transition-colors">.TOP</span>
              </span>
              <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                 <div className="w-8 h-px bg-brand-gold" />
                 <span className="text-[8px] text-brand-gold uppercase tracking-[0.6em] font-black">
                   Elite Digital Concierge
                 </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-10">
               <Link href="/mapa" className="flex items-center gap-2 text-[10px] text-white/40 hover:text-white font-black uppercase tracking-[0.3em] transition-all group">
                  <MapPin size={14} className="group-hover:text-brand-gold transition-colors" />
                  Live Radar
               </Link>
               <Link href="/boutique" className="flex items-center gap-2 text-[10px] text-white/40 hover:text-white font-black uppercase tracking-[0.3em] transition-all group">
                  <Sparkles size={14} className="group-hover:text-brand-gold transition-colors" />
                  Selection
               </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6 md:gap-10">
            <Link 
              href="/login" 
              className="hidden sm:flex items-center gap-3 text-[10px] text-white/60 hover:text-white uppercase tracking-[0.3em] font-black transition-colors"
            >
              <User size={16} className="text-brand-gold" />
              Member Sign In
            </Link>
            
            <Link 
              href="/registro" 
              className="relative group px-10 py-4.5 bg-white text-brand-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-brand-gold hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <span className="relative z-10">Join the Elite</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-black/10 group-hover:h-full transition-all duration-500 opacity-20" />
            </Link>

            <button className="lg:hidden w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
               <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
