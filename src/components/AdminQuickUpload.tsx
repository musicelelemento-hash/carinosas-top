"use client";

import React, { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { StitchEngine } from "@/lib/stitch";
import { UploadDropzone } from "@/components/Uploadthing";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";
import LocationPickerMap from "@/components/LocationPickerMap";
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
  Diamond
} from "lucide-react";

export default function AdminQuickUpload() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("Quito");
  const [sector, setSector] = useState("");
  const [lat, setLat] = useState<number>(-0.1807);
  const [lng, setLng] = useState<number>(-78.4678);
  const [age, setAge] = useState("21");
  const [rawDesc, setRawDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempTransformed, setTempTransformed] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [planType, setPlanType] = useState("Diamante");

  const provinces = getProvinces();

  const CITY_CENTERS: Record<string, [number, number]> = {
    'Quito': [-0.1807, -78.4678],
    'Guayaquil': [-2.1894, -79.8891],
    'Cuenca': [-2.9001, -79.0059],
    'Manta': [-0.9621, -80.7127],
    'Machala': [-3.2581, -79.9161],
    'Santo Domingo': [-0.2520, -79.1714],
    'Ambato': [-1.2417, -78.6197],
    'Portoviejo': [-1.0544, -80.4544],
    'Pasaje': [-3.3283, -79.8067],
    'Loja': [-3.9931, -79.2042],
    'Esmeraldas': [0.9592, -79.6517],
    'Ibarra': [0.3517, -78.1220],
    'Tulcán': [0.8120, -77.7172],
    'Riobamba': [-1.6636, -78.6543],
    'Babahoyo': [-1.8012, -79.5339],
    'Quevedo': [-1.0225, -79.4621],
    'Milagro': [-2.1342, -79.5870],
  };

  const updateCoordsFromCity = (cityName: string) => {
    const coords = CITY_CENTERS[cityName];
    if (coords) {
      setLat(coords[0]);
      setLng(coords[1]);
      setSector("");
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

  const handleQuickPublish = async () => {
    if (!name || !whatsapp) {
      alert("Nombre y WhatsApp son obligatorios.");
      return;
    }

    setLoading(true);
    const { text, tags } = StitchEngine.quickTransform(rawDesc || "Acompañante VIP de alto nivel", city);
    
    const finalImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"];

    try {
      const { error } = await supabase.from('models').insert([
        { 
          name, 
          city, 
          whatsapp, 
          description: text, 
          tags, 
          images: finalImages, 
          plan_type: planType, 
          age: parseInt(age) || 21,
          lat,
          lng,
          sector
        }
      ]);
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setWhatsapp("");
        setSector("");
        setRawDesc("");
        setImages([]);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Error al publicar rápido.");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: 'Básico', icon: <Star size={16} />, color: 'text-brand-white/40', desc: 'Listing Estándar' },
    { id: 'Premium', icon: <ShieldCheck size={16} />, color: 'text-brand-gold/60', desc: 'Destacado Ambar' },
    { id: 'Diamante', icon: <Diamond size={16} />, color: 'text-brand-pink', desc: 'Acceso Privado' },
    { id: 'VIP Elite', icon: <Crown size={16} />, color: 'text-brand-gold', desc: 'Máxima Exclusividad' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif text-brand-gold tracking-tight">Publicación Rápida</h1>
          <p className="text-brand-white/40 text-[10px] uppercase tracking-[0.4em] font-black">Admin Elite Dashboard</p>
        </div>
        <div className="flex items-center gap-3 glass-premium px-6 py-3 rounded-full border-brand-gold/10">
          <Zap size={16} className="text-brand-gold" />
          <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">Modo Turbo Activo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-dark rounded-[2rem] p-8 border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Nombre Artístico</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Sofia V."
                  className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">WhatsApp (Número Real)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/40" />
                  <input 
                    type="text" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0991234567"
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Ciudad y Edad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Ciudad Destino</label>
                <div className="relative">
                   <MapPin size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/40" />
                   <select 
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      updateCoordsFromCity(e.target.value);
                    }}
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer"
                   >
                     {provinces.map(prov => (
                        <optgroup key={prov} label={prov} className="bg-brand-black text-brand-gold">
                          {getCitiesByProvince(prov).map(c => <option key={c.id} value={c.name} className="bg-brand-black text-brand-white">{c.name}</option>)}
                        </optgroup>
                      ))}
                   </select>
                </div>
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Edad</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all"
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Plan de Visibilidad</label>
                <select 
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer capitalize"
                >
                  <option value="Básico">Básico</option>
                  <option value="Premium">Premium</option>
                  <option value="Diamante">Diamante</option>
                  <option value="VIP Elite">VIP Elite</option>
                </select>
              </div>
            </div>

            {/* Selector de Plan Visual */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlanType(p.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    planType === p.id 
                    ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' 
                    : 'bg-transparent border-white/5 text-brand-white/40 hover:border-white/20'
                  }`}
                >
                  {p.icon}
                  <span className="text-[9px] font-black uppercase tracking-widest">{p.id}</span>
                </button>
              ))}
            </div>

            {/* Sector manual + mapa toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Sector / Referencia de Ubicación</label>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${
                    showMap
                      ? 'bg-brand-gold/20 border-brand-gold/50 text-brand-gold'
                      : 'border-brand-gold/20 text-brand-gold/50 hover:border-brand-gold/40 hover:text-brand-gold'
                  }`}
                >
                  <Map size={10} />
                  {showMap ? 'Ocultar Mapa' : 'Abrir Mapa GPS'}
                </button>
              </div>
              <div className="relative">
                <MapPin size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/40" />
                <input 
                  type="text" 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Ej: Sector La Carolina, Av. Amazonas y Eloy Alfaro"
                  className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-gold transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            {/* Interactive GPS Map */}
            {showMap && (
              <div className="p-5 glass-premium border-brand-gold/10 rounded-3xl animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Map size={14} className="text-brand-gold" />
                  <span className="text-[10px] text-brand-gold uppercase font-black tracking-widest">Posicionamiento GPS Interactivo</span>
                </div>
                <LocationPickerMap
                  lat={lat}
                  lng={lng}
                  onChange={handleLocationChange}
                  cityCenter={CITY_CENTERS[city] || [-1.8312, -78.1834]}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Descripción Original (Será transformada por Stitch)</label>
                <button onClick={() => setRawDesc("")} className="text-[8px] text-brand-pink uppercase font-black tracking-widest hover:underline">Limpiar</button>
              </div>
              <textarea 
                value={rawDesc}
                onChange={(e) => setRawDesc(e.target.value)}
                placeholder="Pega aquí la info de la competencia..."
                className="w-full bg-brand-black/40 border border-white/10 rounded-3xl py-4 px-6 text-white outline-none focus:border-brand-gold h-40 resize-none transition-all placeholder:text-white/10"
              />
              {tempTransformed && (
                <div className="mt-4 p-4 glass-premium border-brand-gold/10 rounded-2xl animate-in slide-in-from-top-2">
                  <p className="text-[10px] text-brand-gold uppercase tracking-widest font-black mb-1 flex items-center gap-2">
                    <Sparkles size={10} /> Stitch Preview:
                  </p>
                  <p className="text-xs italic text-brand-white/60">"{tempTransformed}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Media Side */}
        <div className="space-y-6">
          <div className="glass-dark rounded-[2.5rem] p-8 border-white/5 h-full flex flex-col">
            <h3 className="text-xl font-serif text-brand-gold mb-6 flex items-center gap-3">
              <Plus size={20} /> Media VIP
            </h3>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-brand-pink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="uploadthing-admin">
                <UploadDropzone
                  endpoint="modelImage"
                  onClientUploadComplete={(res) => { if(res){ setImages(prev => [...prev, ...res.map(f => f.url)]); }}}
                  onUploadError={(err) => alert(`Error: ${err.message}`)}
                />
              </div>
            </div>

            <button 
              onClick={handleQuickPublish}
              disabled={loading || !name || !whatsapp}
              className={`w-full mt-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                success 
                  ? 'bg-green-500 text-white' 
                  : 'bg-brand-gold text-brand-black shadow-gold hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:grayscale'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : success ? <><CheckCircle2 /> Publicado</> : <><Sparkles size={16} /> Publicar Ya</>}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .uploadthing-admin .ut-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 900; color: rgba(212, 175, 55, 0.5); }
        .uploadthing-admin .ut-button { background-color: #D4AF37; color: #050505; border-radius: 1rem; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; }
        .uploadthing-admin .ut-allowed-content { display: none; }
        .uploadthing-admin [data-ut-element="label"] { color: #D4AF37 !important; }
      `}</style>
    </div>
  );
}
