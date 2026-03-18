"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { StitchEngine } from "@/lib/stitch";
import { UploadDropzone } from "@/components/Uploadthing";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";
import { 
  Plus, 
  Zap, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Phone, 
  MapPin,
  Sparkles
} from "lucide-react";

export default function AdminQuickUpload() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("Quito");
  const [age, setAge] = useState("21");
  const [rawDesc, setRawDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const provinces = getProvinces();

  const handleQuickPublish = async () => {
    setLoading(true);
    const { text, tags } = StitchEngine.quickTransform(rawDesc || "Acompañante VIP de alto nivel", city);
    
    try {
      const { error } = await supabase.from('models').insert([
        { 
          name, 
          city, 
          whatsapp, 
          description: text, 
          tags, 
          images, 
          plan_type: 'Diamante', // Admin uploads are always top-tier
          age: parseInt(age) || 21 
        }
      ]);
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setWhatsapp("");
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Ciudad Destino</label>
                <div className="relative">
                   <MapPin size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/40" />
                   <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
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
              <div className="space-y-2">
                <label className="text-[10px] text-white/30 uppercase font-black tracking-widest ml-1">Edad</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all"
                />
              </div>
            </div>

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
              disabled={loading || !name || !whatsapp || images.length === 0}
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
      `}</style>
    </div>
  );
}
