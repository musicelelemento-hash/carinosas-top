"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { createModelAction } from "@/app/actions/admin";
import { StitchEngine } from "@/lib/stitch";
import { UploadDropzone } from "@/components/Uploadthing";
import LocationPickerMap from "@/components/LocationPickerMap";
import { sound } from "@/lib/soundEngine";
import confetti from "canvas-confetti";
import { 
  Plus, 
  Zap, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  Phone, 
  MapPin,
  Sparkles,
  Map,
  ShieldCheck,
  Crown,
  Star,
  Diamond,
  Shuffle,
  Crop,
  Link as LinkIcon,
  Wand2,
  DollarSign,
  AlertCircle
} from "lucide-react";

export default function AdminQuickUpload() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("Quito");
  const [sector, setSector] = useState("");
  const [lat, setLat] = useState<number>(-0.1807);
  const [lng, setLng] = useState<number>(-78.4678);
  const [age, setAge] = useState("22");
  const [hourlyRate, setHourlyRate] = useState("140");
  const [rawDesc, setRawDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempTransformed, setTempTransformed] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [planType, setPlanType] = useState("VIP Elite");
  const [cropping, setCropping] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ─── Test Data Banks ─────────────────────────────────────────────────────
  const TEST_NAMES = ["Valentina", "Camila", "Isabella", "Luciana", "Sofía", "Antonella", "Alessandra", "Daniela", "Gabriela", "Mariana", "Natalia", "Paula", "Rebeca", "Nicole", "Scarlett", "Mia", "Fiorella", "Bianca"];
  const TEST_CITIES = ["Quito", "Guayaquil", "Machala", "Cuenca", "Manta", "Santo Domingo", "Ambato", "Salinas"];
  const TEST_SECTORS = ["La Carolina VIP", "Samborondón", "Sector Unioro", "El Vergel", "Barbasquillo 5★", "Puerto Santa Ana", "González Suárez", "Puertas del Sol"];
  const TEST_PLANS: string[] = ["VIP Elite", "Diamante", "Premium", "Anuncio Gratis"];
  const TEST_DESCS = [
    "Acompañante de alto nivel para cenas exclusivas, viajes de negocios y momentos inolvidables en suites 5 estrellas.",
    "Compañía de lujo, discreta y elegante. Trato de novios y complicidad total.",
    "Modelo exclusiva, educada y carismática. Atención de primera categoría con reserva anticipada.",
    "Presencia deslumbrante y conversación inteligente para caballeros distinguidos."
  ];

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Smart Formatter for WhatsApp (Auto-converts to 5939XXXXXXXX)
  const formatWhatsapp = (val: string) => {
    let clean = val.replace(/\D/g, "");
    if (clean.startsWith("09")) {
      clean = "593" + clean.substring(1);
    } else if (clean.startsWith("9") && clean.length === 9) {
      clean = "593" + clean;
    }
    return clean;
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(e.target.value);
  };

  const CITY_CENTERS: Record<string, [number, number]> = {
    'Quito': [-0.1807, -78.4678],
    'Guayaquil': [-2.1894, -79.8891],
    'Cuenca': [-2.9001, -79.0059],
    'Manta': [-0.9621, -80.7127],
    'Machala': [-3.2581, -79.9161],
    'Santo Domingo': [-0.2520, -79.1714],
    'Ambato': [-1.2417, -78.6197],
    'Salinas': [-2.2150, -80.9750],
  };

  const updateCoordsFromCity = (cityName: string) => {
    const coords = CITY_CENTERS[cityName];
    if (coords) {
      setLat(coords[0]);
      setLng(coords[1]);
    }
  };

  const handleLocationChange = useCallback((newLat: number, newLng: number, address?: string) => {
    setLat(newLat);
    setLng(newLng);
    if (address) setSector(address);
  }, []);

  React.useEffect(() => {
    if (rawDesc) {
      const { text } = StitchEngine.quickTransform(rawDesc, city);
      setTempTransformed(text);
    } else {
      setTempTransformed("");
    }
  }, [rawDesc, city]);

  const handleAddManualImage = () => {
    if (!manualImageUrl.trim()) return;
    setImages(prev => [...prev, manualImageUrl.trim()]);
    setManualImageUrl("");
    sound.playSubtleClick();
  };

  // Smart Anti-Watermark Auto Crop (Crops bottom 12% where watermarks sit)
  const handleSmartCropImage = async (index: number) => {
    const imgUrl = images[index];
    if (!imgUrl) return;

    setCropping(true);
    sound.playSubtleClick();

    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imgUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      // Crop out bottom 12% (watermark area)
      const cropHeight = Math.floor(img.height * 0.88);
      canvas.width = img.width;
      canvas.height = cropHeight;

      ctx.drawImage(img, 0, 0, img.width, cropHeight, 0, 0, img.width, cropHeight);

      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setImages(prev => prev.map((url, i) => i === index ? croppedDataUrl : url));
      sound.playGoldChime();
    } catch (err) {
      console.warn("Could not crop external image due to CORS, applying proxy fallback", err);
      alert("Para recortar fotos de enlaces externos protegidos, descárgala primero o usa la subida de archivos.");
    } finally {
      setCropping(false);
    }
  };

  const handleAutoFill = () => {
    sound.playGoldChime();
    const randomCity = pick(TEST_CITIES);
    const coords = CITY_CENTERS[randomCity] || [-0.1807, -78.4678];
    const phone = `59398${Math.floor(Math.random() * 9000000 + 1000000)}`;

    setName(pick(TEST_NAMES));
    setWhatsapp(phone);
    setCity(randomCity);
    setSector(pick(TEST_SECTORS));
    setLat(coords[0] + (Math.random() - 0.5) * 0.03);
    setLng(coords[1] + (Math.random() - 0.5) * 0.03);
    setAge(String(Math.floor(Math.random() * 6) + 21));
    setHourlyRate(String(Math.floor(Math.random() * 8) * 10 + 120));
    setRawDesc(pick(TEST_DESCS));
    setPlanType(pick(TEST_PLANS));
    setImages([
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
    ]);
  };

  const handleQuickPublish = async () => {
    if (!name.trim() || !whatsapp.trim()) {
      alert("Por favor ingresa al menos el Nombre y WhatsApp.");
      return;
    }

    setLoading(true);
    const formattedPhone = formatWhatsapp(whatsapp);
    const { text, tags } = StitchEngine.quickTransform(rawDesc || "Acompañante VIP de alto nivel en Ecuador", city);
    
    const finalImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"];

    try {
      await createModelAction({
        name: name.trim(),
        city,
        whatsapp: formattedPhone,
        description: text,
        tags: tags.length > 0 ? tags : ["VIP Elite", "Hotel 5★", "Bóveda 4K", "Discreción Total"],
        images: finalImages,
        plan_type: planType,
        age: parseInt(age) || 22,
        hourly_rate: parseFloat(hourlyRate) || 140,
        lat,
        lng,
        sector: sector.trim() || `${city} VIP`
      });
      
      sound.playGoldChime();
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setWhatsapp("");
        setSector("");
        setRawDesc("");
        setImages([]);
      }, 3500);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al registrar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: 'Anuncio Gratis', icon: <Star size={16} />, color: 'text-white/40', desc: 'Listing Estándar' },
    { id: 'Premium', icon: <ShieldCheck size={16} />, color: 'text-brand-gold/60', desc: 'Destacado Ambar' },
    { id: 'Diamante', icon: <Diamond size={16} />, color: 'text-brand-pink', desc: 'Acceso Privado' },
    { id: 'VIP Elite', icon: <Crown size={16} />, color: 'text-brand-gold', desc: 'Máxima Exposición #1' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-500 text-white">
      
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between glass-obsidian border border-brand-gold/30 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/40 text-[9px] font-black uppercase tracking-widest text-brand-gold">
            <Zap size={12} />
            <span>Carga Flash de Agenda VIP & Amigas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Publicación Express de Contactos
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Sube rápidamente a tus conocidas con auto-formato de WhatsApp, tarifa en USD y limpieza inteligente de fotos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoFill}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-dark border border-brand-gold/40 text-brand-gold text-xs font-black uppercase tracking-wider hover:bg-brand-gold hover:text-brand-black transition-all cursor-pointer shadow-lg"
          >
            <Shuffle size={14} className="animate-pulse" />
            <span>Ejemplo Rápido</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-obsidian rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            
            {/* Country Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-brand-gold/20">
              <div className="flex items-center gap-2.5 text-xs font-bold text-white">
                <span className="text-lg">🇪🇨</span>
                <span>País: <strong className="text-brand-gold">Ecuador</strong> (+593 Auto-Detect)</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-mono font-bold">● Publicación Directa en BD</span>
            </div>

            {/* Inputs: Name, Whatsapp, Rate, Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider block">
                  Nombre Artístico / Alias *
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Nicole VIP, Valentina"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white outline-none focus:border-brand-gold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider block">
                  WhatsApp Directo * (09XXXXXXXX)
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" />
                  <input 
                    type="text" 
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    placeholder="0987654321 o 593987654321"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-gold transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider block">
                  Tarifa por Hora ($ USD)
                </label>
                <div className="relative">
                  <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input 
                    type="number" 
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="140"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-gold transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider block">
                  Edad
                </label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="22"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white outline-none focus:border-brand-gold transition-all font-mono"
                />
              </div>
            </div>

            {/* Quick City Selector */}
            <div className="space-y-2.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider block">
                Ciudad Base en Ecuador (1 Toque)
              </label>
              <div className="flex flex-wrap gap-2">
                {["Machala", "Guayaquil", "Quito", "Cuenca", "Manta", "Santo Domingo", "Ambato", "Salinas"].map((cName) => (
                  <button
                    key={cName}
                    type="button"
                    onClick={() => {
                      sound.playSubtleClick();
                      setCity(cName);
                      updateCoordsFromCity(cName);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      city === cName
                        ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20 scale-105'
                        : 'glass-dark border border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    📍 {cName}
                  </button>
                ))}
              </div>
            </div>

            {/* Sector / Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider">
                  Sector o Urbanización
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="text-[9px] text-brand-gold uppercase font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Map size={11} />
                  <span>{showMap ? 'Ocultar Mapa' : 'Ajustar Pin GPS'}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/60" />
                <input 
                  type="text" 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Ej: Sector Unioro VIP, Hotel Oro Verde, Samborondón"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-gold transition-all"
                />
              </div>
            </div>

            {/* GPS Map */}
            {showMap && (
              <div className="p-4 glass-dark border border-brand-gold/20 rounded-2xl animate-in slide-in-from-top-3">
                <LocationPickerMap
                  lat={lat}
                  lng={lng}
                  onChange={handleLocationChange}
                  cityCenter={CITY_CENTERS[city] || [-0.1807, -78.4678]}
                />
              </div>
            )}

            {/* Plan Tier Selector */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider block">
                Nivel de Exposición / Membresía
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      sound.playSubtleClick();
                      setPlanType(p.id);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                      planType === p.id 
                      ? 'bg-brand-gold/15 border-brand-gold text-brand-gold shadow-lg shadow-brand-gold/10' 
                      : 'glass-dark border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {p.icon}
                    <span className="text-[9px] font-black uppercase tracking-wider">{p.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description & AI Enhancer */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-wider">
                  Notas de la Amiga / Descripción
                </label>
                <button 
                  type="button"
                  onClick={() => {
                    const { text } = StitchEngine.quickTransform(rawDesc || "Acompañante VIP de alto nivel", city);
                    setRawDesc(text);
                    sound.playGoldChime();
                  }}
                  className="text-[9px] text-brand-gold uppercase font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Wand2 size={11} />
                  <span>Embellecer con IA</span>
                </button>
              </div>
              <textarea 
                value={rawDesc}
                onChange={(e) => setRawDesc(e.target.value)}
                placeholder="Pega aquí lo que ella te dijo (ej: 'muy cariñosa, va a hoteles 5 estrellas en Machala, masajes relajantes')..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-brand-gold h-28 resize-none transition-all placeholder:text-[#A1A1AA]/50"
              />
            </div>

          </div>
        </div>

        {/* Right Column: Media VIP & Anti-Watermark Tool */}
        <div className="space-y-6">
          <div className="glass-obsidian rounded-3xl p-6 sm:p-8 border border-white/10 h-full flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-brand-gold flex items-center gap-2">
                  <Plus size={18} /> Fotos de la Agenda ({images.length})
                </h3>
              </div>

              {/* Paste Direct URL */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="url"
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                    placeholder="Pegar URL de foto..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-brand-gold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddManualImage}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-brand-gold hover:text-brand-black text-xs font-bold transition-all cursor-pointer"
                >
                  Añadir
                </button>
              </div>

              {/* Image Thumbnails with Auto-Crop Button */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10 bg-black/40">
                      <Image 
                        src={img} 
                        alt={`Foto ${i + 1}`} 
                        fill 
                        className="object-cover" 
                      />

                      {/* Anti-Watermark Auto-Crop Action */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-10">
                        <button
                          type="button"
                          onClick={() => handleSmartCropImage(i)}
                          title="Recortar borde inferior (borra marcas de agua de terceros)"
                          className="px-2 py-1 rounded-lg bg-brand-gold text-brand-black text-[8px] font-black uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Crop size={10} />
                          <span>Auto-Recorte</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 text-[9px] font-bold cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Watermark Notice */}
              <div className="p-3 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 text-[10px] text-brand-gold/90 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles size={12} />
                  <span>Tip Anti Marca de Agua:</span>
                </div>
                <p className="text-[9px] text-[#A1A1AA] leading-relaxed">
                  Pasa el ratón sobre cada foto y usa <strong>&quot;Auto-Recorte&quot;</strong> para eliminar el borde inferior donde suelen estar las marcas de agua de otros portales.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="uploadthing-admin">
                <UploadDropzone
                  endpoint="modelImage"
                  onClientUploadComplete={(res) => {
                    if (res) {
                      sound.playGoldChime();
                      setImages(prev => [...prev, ...res.map(f => f.url)]);
                    }
                  }}
                  onUploadError={(err) => alert(`Error: ${err.message}`)}
                />
              </div>
            </div>

            {/* Big Submit Button */}
            <button 
              type="button"
              onClick={handleQuickPublish}
              disabled={loading || !name.trim() || !whatsapp.trim()}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl cursor-pointer ${
                success 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black shadow-brand-gold/30 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:grayscale'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : success ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>¡Publicada en Vivo!</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Publicar en Catálogo</span>
                </>
              )}
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
