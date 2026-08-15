"use client";

import React, { useState } from "react";
import { Crown, ShieldCheck, Sparkles, Wifi, Copy, Check, Lock, QrCode } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { soundFX } from "@/lib/soundFX";

interface VIPCard3DProps {
  memberCode?: string;
  memberName?: string;
  tier?: "Alpha Founder" | "Black Diamond" | "Oro Élite";
  expiryDate?: string;
  onUpgradeClick?: () => void;
}

export default function VIPCard3D({
  memberCode = "ALPHA-8842-VIP",
  memberName = "SOCIO CONFIDENCIAL",
  tier = "Black Diamond",
  expiryDate = "12/2027",
  onUpgradeClick
}: VIPCard3DProps) {
  const [copied, setCopied] = useState(false);

  // Motion physics for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["16deg", "-16deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-16deg", "16deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCopyCode = () => {
    if (typeof window !== "undefined") {
      try { soundFX?.playCardFlip(); } catch {}
      navigator.clipboard?.writeText(memberCode);
      setCopied(true);
      if ("vibrate" in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 3D Container with perspective */}
      <div 
        style={{ perspective: 1200 }} 
        className="w-full max-w-md cursor-grab active:cursor-grabbing"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full aspect-[1.586/1] rounded-[2rem] p-7 flex flex-col justify-between overflow-hidden border border-brand-gold/50 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(212,168,67,0.25)] select-none bg-gradient-to-br from-[#16161D] via-[#0A0A0F] to-[#040406]"
        >
          {/* Metallic brushed grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.4) 0%, transparent 60%)"
            }}
          />

          {/* Dynamic Light Shimmer Bar */}
          <div className="absolute -top-24 -bottom-24 w-28 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-shimmer-gold pointer-events-none" />

          {/* ── CARD TOP HEADER ── */}
          <div className="flex items-center justify-between relative z-10" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-[0_0_15px_rgba(212,168,67,0.3)]">
                <Crown size={20} className="fill-brand-gold" />
              </div>
              <div>
                <span className="font-serif font-bold text-base tracking-[0.1em] text-white block leading-none">
                  CARIÑOSAS<span className="text-brand-gold">.TOP</span>
                </span>
                <span className="text-[7px] text-brand-gold font-mono font-black uppercase tracking-[0.35em]">
                  GENTLEMEN CLUB · ALPHA
                </span>
              </div>
            </div>

            {/* Wireless Contactless NFC Icon */}
            <div className="flex items-center gap-2">
              <Wifi size={18} className="text-brand-gold/70 rotate-90" />
            </div>
          </div>

          {/* ── CARD CENTER: EMV CHIP & TIER ── */}
          <div className="flex items-center justify-between relative z-10 my-auto" style={{ transform: "translateZ(40px)" }}>
            {/* Holographic Gold EMV Chip */}
            <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-[#D4A843] via-[#FFE088] to-[#9A7830] p-0.5 border border-brand-gold/60 shadow-md">
              <div className="w-full h-full rounded-[6px] border border-black/30 grid grid-cols-3 grid-rows-2 gap-0.5 opacity-80">
                <div className="border-r border-b border-black/30" />
                <div className="border-b border-black/30" />
                <div className="border-l border-b border-black/30" />
                <div className="border-r border-black/30" />
                <div />
                <div className="border-l border-black/30" />
              </div>
            </div>

            {/* Tier Badge */}
            <div className="px-3.5 py-1 rounded-full bg-brand-gold text-brand-black font-black text-[9px] uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(212,168,67,0.5)]">
              {tier}
            </div>
          </div>

          {/* ── CARD BOTTOM: MEMBER NUMBER & HOLDER ── */}
          <div className="space-y-2 relative z-10" style={{ transform: "translateZ(35px)" }}>
            <div className="flex items-center justify-between">
              <div className="font-mono text-lg md:text-xl font-black tracking-[0.25em] text-white/95 text-shadow-gold">
                {memberCode}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg glass-dark border border-brand-gold/30 text-brand-gold hover:text-white text-[9px] font-bold uppercase transition-all flex items-center gap-1"
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                <span>{copied ? "Copiado" : "Copiar"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest text-white/50 pt-1 border-t border-white/10">
              <div>
                <span className="block text-[6px] text-white/30">TITULAR REGISTRADO</span>
                <span className="text-white/80 font-bold">{memberName}</span>
              </div>
              <div className="text-right">
                <span className="block text-[6px] text-white/30">VÁLIDO HASTA</span>
                <span className="text-brand-gold font-bold">{expiryDate}</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Card Controls / Upgrade Prompt */}
      {onUpgradeClick && (
        <button
          type="button"
          onClick={onUpgradeClick}
          className="mt-6 px-8 py-3.5 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_10px_30px_rgba(212,168,67,0.35)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Sparkles size={15} />
          <span>Solicitar Tarjeta Black Diamond</span>
        </button>
      )}
    </div>
  );
}
