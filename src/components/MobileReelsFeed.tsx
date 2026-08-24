"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
  Share2,
  ShieldCheck,
  MapPin,
  ChevronUp,
  Link2,
  Download,
  Send,
} from "lucide-react";

interface ReelItem {
  id: string;
  name: string;
  age: number;
  city: string;
  sector: string;
  rate: string;
  imageUrl: string;
  description: string;
  hasAudio: boolean;
  tags: string[];
  likes: number;
  comments: number;
}

const REEL_ITEMS: ReelItem[] = [
  {
    id: "r-machala-1",
    name: "Valeria",
    age: 22,
    city: "Machala",
    sector: "Puerto Bolívar / Centro VIP",
    rate: "$120/h",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1080",
    description: "Hermosa y cariñosa en Machala. Trato de novios real, masajes relajantes y total discreción para ejecutivos.",
    hasAudio: true,
    tags: ["MachalaVIP", "PuertoBolívar", "TratoDeNovios", "4KReal"],
    likes: 2412,
    comments: 318,
  },
  {
    id: "r1",
    name: "Valentina",
    age: 22,
    city: "Quito",
    sector: "La Carolina VIP",
    rate: "$150/h",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1080",
    description: "Cenas exclusivas y momentos de alto nivel en hoteles 5★ en Quito Norte y Cumbayá.",
    hasAudio: true,
    tags: ["Elegante", "Hotel5★", "Bóveda4K", "QuitoVIP"],
    likes: 1893,
    comments: 204,
  },
  {
    id: "r2",
    name: "Alessandra",
    age: 24,
    city: "Guayaquil",
    sector: "Samborondón VIP",
    rate: "$180/h",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1080",
    description: "Presencia impecable y atención preferencial para caballeros distinguidos en Samborondón y Puerto Santa Ana.",
    hasAudio: true,
    tags: ["TratoVIP", "AltaGama", "4KVerified", "Samborondón"],
    likes: 3021,
    comments: 412,
  },
  {
    id: "r3",
    name: "Isabella",
    age: 23,
    city: "Cuenca",
    sector: "El Vergel / Centro",
    rate: "$140/h",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1080",
    description: "Universitaria sofisticada. Conexión auténtica y compañía sin prisa en Cuenca.",
    hasAudio: true,
    tags: ["Universitaria", "Sutil", "MasajeRelax", "CuencaVIP"],
    likes: 1544,
    comments: 176,
  },
  {
    id: "r4",
    name: "Scarlett",
    age: 23,
    city: "Santo Domingo",
    sector: "Zona Rosa / Los Rosales",
    rate: "$110/h",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1080",
    description: "Acompañante VIP en Santo Domingo. Bellísima, apasionada y discreta para momentos inolvidables.",
    hasAudio: true,
    tags: ["SantoDomingo", "ZonaRosa", "Elite4K"],
    likes: 987,
    comments: 93,
  },
  {
    id: "r5",
    name: "Sofía",
    age: 25,
    city: "Manta",
    sector: "Plaza del Sol / Barbasquillo",
    rate: "$160/h",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1080",
    description: "Acompañamiento exclusivo frente al mar con total discreción en suites y yates.",
    hasAudio: true,
    tags: ["PlayaVIP", "Yates", "Barbasquillo", "4KHD"],
    likes: 2205,
    comments: 267,
  },
];

interface MockComment {
  id: string;
  author: string;
  time: string;
  text: string;
  liked: boolean;
}

const MOCK_COMMENTS: MockComment[] = [
  { id: "c1", author: "Andrés M.", time: "2 h", text: "Perfil verificado, todo tal cual las fotos.", liked: false },
  { id: "c2", author: "Carlos R.", time: "5 h", text: "Excelente trato, muy puntual.", liked: true },
  { id: "c3", author: "Diego P.", time: "1 d", text: "¿Disponible este fin de semana en Quito?", liked: false },
];

interface MobileReelsFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileReelsFeed({ isOpen, onClose }: MobileReelsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [viewersCount, setViewersCount] = useState(842);
  const [sheet, setSheet] = useState<null | "comments" | "share">(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setViewersCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (sheet) setSheet(null);
        else onClose();
      }
      if (e.key === "ArrowDown") handleNext();
      if (e.key === "ArrowUp") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentIndex, sheet]);

  if (!isOpen) return null;

  const currentReel = REEL_ITEMS[currentIndex];
  const isLiked = !!likedMap[currentReel.id];
  const likeCount = currentReel.likes + (isLiked ? 1 : 0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setLikedMap(prev => ({ ...prev, [currentReel.id]: true }));
      setShowHeartAnim(true);
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate([20, 50, 20]); } catch {}
      }
      setTimeout(() => setShowHeartAnim(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleNext = () => {
    setSheet(null);
    setCurrentIndex(prev => (prev < REEL_ITEMS.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setSheet(null);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (diff > 50) {
      handleNext(); // Swiped UP
    } else if (diff < -50) {
      handlePrev(); // Swiped DOWN
    }
    setTouchStartY(null);
  };

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent(`Hola ${currentReel.name}, te vi en Reels de Cariñosas.top (Ciudad: ${currentReel.city}, Sector: ${currentReel.sector}). Deseo consultar tu disponibilidad.`);
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  const profileSlug = currentReel.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const shareUrl = `carinosas.top/${profileSlug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://${shareUrl}`).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[160] bg-black flex flex-col justify-between overflow-hidden select-none"
    >

      {/* ── TOP ACTION BAR ── */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 pt-4 sm:p-5 sm:pt-6 flex flex-col gap-3 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
        {/* Story-style progress bars */}
        <div className="flex gap-[5px]">
          {REEL_ITEMS.map((r, i) => (
            <div key={r.id} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: i < currentIndex ? "100%" : i === currentIndex ? "42%" : "0%" }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08080B]/55 border border-brand-gold/40 text-brand-gold font-mono text-[10px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
              <span>Reels 4K en vivo</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#08080B]/55 border border-white/[0.1] font-mono text-[10px] text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              <span>{viewersCount} viendo</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#08080B]/55 border border-white/20 text-white flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── MAIN FULL-SCREEN MEDIA CONTAINER ── */}
      <div
        onClick={handleDoubleTap}
        className="relative w-full h-full flex-1 overflow-hidden"
      >
        <Image
          src={currentReel.imageUrl}
          alt={currentReel.name}
          fill
          priority
          className="object-cover"
        />

        {/* Ambient dark gradient para legibilidad de texto (spec) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.2) 32%, transparent 55%, rgba(0,0,0,.45) 100%)",
          }}
        />

        {/* Double Tap Floating Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <Heart size={72} className="fill-brand-pink text-brand-pink" />
          </div>
        )}

        {/* ── RIGHT FLOATING ACTION COLUMN (spec: bottom 168, gap 16) ── */}
        <div className="absolute right-4 bottom-[168px] z-20 flex flex-col items-center gap-4">

          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLikedMap(prev => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-11 h-11 rounded-full bg-[#08080B]/55 border border-white/[0.1] flex items-center justify-center ${isLiked ? "text-brand-pink" : "text-white"}`}>
              <Heart size={22} className={isLiked ? "fill-brand-pink" : ""} />
            </div>
            <span className="font-mono text-[11px] text-white/85">{likeCount.toLocaleString("es-EC")}</span>
          </button>

          {/* Comments */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSheet("comments");
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-[#08080B]/55 border border-white/[0.1] flex items-center justify-center text-white">
              <MessageCircle size={20} />
            </div>
            <span className="font-mono text-[11px] text-white/85">{currentReel.comments}</span>
          </button>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSheet("share");
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-[#08080B]/55 border border-white/[0.1] flex items-center justify-center text-white">
              <Share2 size={19} />
            </div>
            <span className="font-mono text-[11px] text-white/85">Enviar</span>
          </button>

          {/* Volumen */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAudioActive(!isAudioActive);
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-11 h-11 rounded-full bg-[#08080B]/55 border border-white/[0.1] flex items-center justify-center ${isAudioActive ? "text-brand-gold" : "text-white"}`}>
              {isAudioActive ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </div>
            <span className="font-mono text-[11px] text-white/85">Voz</span>
          </button>
        </div>

        {/* ── BOTTOM METADATA & BOOKING (spec: bottom 104, right 92) ── */}
        {!sheet && (
          <div className="absolute bottom-[104px] left-4 right-[92px] z-20 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-[15px] text-white">{currentReel.name}</span>
              <ShieldCheck size={15} className="text-brand-gold" />
            </div>

            <div className="flex items-center gap-2 text-[12px] text-white/72">
              <MapPin size={12} className="text-brand-gold" />
              <span>{currentReel.sector} · {currentReel.city}</span>
            </div>

            <p className="text-[14px] text-white/85 leading-[1.5] line-clamp-3">
              {currentReel.description}
            </p>

            <button
              onClick={(e) => { e.stopPropagation(); handleContactWhatsApp(); }}
              className="btn-gold px-5 flex items-center gap-2"
              style={{ minHeight: 44 }}
            >
              <MessageCircle size={15} />
              Escribir
            </button>
          </div>
        )}

        {!sheet && (
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>Desliza para siguiente</span>
            <ChevronUp size={12} />
          </div>
        )}
      </div>

      {/* ── HOJA DE COMENTARIOS ── */}
      {sheet === "comments" && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end" onClick={() => setSheet(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#101014] rounded-t-[22px] flex flex-col"
            style={{ height: 470 }}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.07]">
              <span className="text-[15px] font-bold text-white">{currentReel.comments} comentarios</span>
              <button onClick={() => setSheet(null)} aria-label="Cerrar" className="text-white/60">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
              {MOCK_COMMENTS.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 shrink-0 flex items-center justify-center font-serif text-[13px] text-white/70">
                    {c.author[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-white">{c.author}</span>
                      <span className="font-mono text-[11px] text-white/45">{c.time}</span>
                    </div>
                    <p className="text-[13px] text-white/72 leading-[1.45]">{c.text}</p>
                  </div>
                  <Heart size={15} className={c.liked ? "fill-brand-pink text-brand-pink shrink-0" : "text-white/30 shrink-0"} />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-5 py-3 border-t border-white/[0.07]">
              <input
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 text-[13px] text-white placeholder:text-white/35 outline-none"
                style={{ height: 46 }}
              />
              <button
                onClick={() => setCommentDraft("")}
                className="w-11 h-11 rounded-xl bg-brand-gold text-[#08080B] flex items-center justify-center shrink-0"
                aria-label="Enviar comentario"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HOJA DE COMPARTIR ── */}
      {sheet === "share" && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end" onClick={() => setSheet(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#101014] rounded-t-[22px] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-white">Compartir perfil</span>
              <button onClick={() => setSheet(null)} aria-label="Cerrar" className="text-white/60">
                <X size={20} />
              </button>
            </div>

            {/* Tarjeta compartible */}
            <div
              className="flex rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(212,168,67,.35)" }}
            >
              <div className="relative shrink-0" style={{ width: 116, height: 150 }}>
                <Image src={currentReel.imageUrl} alt={currentReel.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-center gap-1.5 bg-[#0C0C10]">
                <span className="font-mono text-[11px] text-brand-gold uppercase tracking-[0.14em]">Cariñosas.top</span>
                <span className="font-serif font-bold text-2xl text-white truncate">{currentReel.name}</span>
                <span className="text-[13px] text-white/72 truncate">{currentReel.sector} · verificada 4K</span>
                <span className="font-mono text-[11px] text-white/45 truncate">{shareUrl}</span>
              </div>
            </div>

            <p className="text-[12px] text-white/45 leading-[1.5]">
              La tarjeta no revela contacto ni ubicación exacta. Enlace válido 24 h.
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] text-white"
                style={{ height: 48 }}
              >
                <Link2 size={17} />
                <span className="text-[11px] font-semibold">{copied ? "Copiado" : "Copiar"}</span>
              </button>
              <button
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] text-white"
                style={{ height: 48 }}
              >
                <Download size={17} />
                <span className="text-[11px] font-semibold">Guardar</span>
              </button>
              <button
                onClick={handleContactWhatsApp}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-brand-gold text-[#08080B]"
                style={{ height: 48 }}
              >
                <Send size={17} />
                <span className="text-[11px] font-semibold">Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
