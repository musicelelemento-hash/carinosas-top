"use client";

import React, { useState, useEffect } from "react";
import { StitchEngine } from "@/lib/stitch";
import { supabase } from "@/lib/supabase";
import { UploadDropzone } from "@/components/Uploadthing";
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  MessageCircle,
  Crown,
  Loader2,
  Wand2,
  Zap
} from "lucide-react";
import PrivacyModal from "./PrivacyModal";
import { CITIES, getProvinces, getCitiesByProvince } from "@/lib/cities";

export default function RegistrationAssistant() {
  const [mounted, setMounted] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("Oro");
  const [loading, setLoading] = useState(false);
  
  const [city, setCity] = useState("Quito");
  const [desc, setDesc] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [transformed, setTransformed] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [activeTip, setActiveTip] = useState("");

  const provinces = getProvinces();

  useEffect(() => {
    setMounted(true);
    setActiveTip(StitchEngine.getMobileTip());
    const timer = setInterval(() => {
      setActiveTip(StitchEngine.getMobileTip());
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const handleTransform = () => {
    const luxText = StitchEngine.transformDescription(desc, city);
    const luxTags = StitchEngine.generateTags(city);
    setTransformed(luxText);
    setTags(luxTags);
    setStep(3); // Go to photos
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('models').insert([
        { 
          name, 
          city, 
          whatsapp, 
          description: transformed || StitchEngine.transformDescription(desc, city), 
          tags: tags.length > 0 ? tags : StitchEngine.generateTags(city), 
          images, 
          plan_type: plan,
          age: 21 
        }
      ]);
      if (error) throw error;
      setStep(5);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al registrar. Revisa los datos e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Switch-based rendering for clarity
  const renderContent = () => {
    switch(step) {
      case 1: // Plan Selection
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <Crown className="text-brand-gold mx-auto mb-2" size={32} />
              <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-widest text-center">Elige tu Nivel de Élite</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: 'Gratis', price: '$0', features: ['Listado Base', 'WhatsApp Directo'] },
                { name: 'Plata', price: '$25', features: ['Prioridad Bronce', 'Soporte 24/7'] },
                { name: 'Oro', price: '$50', features: ['Stitch AI Copy', 'Posicionamiento VIP'] },
                { name: 'Diamante', price: '$100', features: ['Top 1 Nacional', 'Verificación 4K'] }
              ].map((p) => (
                <button 
                  key={p.name}
                  onClick={() => { setPlan(p.name); setStep(2); }}
                  className={`p-6 rounded-2xl border transition-all text-left ${plan === p.name ? 'border-brand-gold bg-brand-gold/10' : 'border-white/10 bg-white/5'}`}
                >
                  <div className="flex flex-col mb-4">
                    <span className="text-sm font-black text-brand-white uppercase tracking-tighter">{p.name}</span>
                    <span className="text-brand-gold font-serif text-lg">{p.price}</span>
                  </div>
                  <ul className="space-y-2">
                    {p.features.map(f => (
                      <li key={f} className="text-[8px] text-brand-white/40 flex items-center gap-1.5 font-bold uppercase tracking-tight">
                        <CheckCircle2 size={8} className="text-brand-gold shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        );

      case 2: // Basic Info
        return (
          <div className="animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-brand-gold" />
              <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-widest">Tu Perfil Artístico</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-white/50 mb-2 uppercase tracking-tighter">Nombre</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold" placeholder="Ej: Valentina" />
                </div>
                <div>
                  <label className="block text-xs text-brand-white/50 mb-2 uppercase tracking-tighter">WhatsApp</label>
                  <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold" placeholder="099..." />
                </div>
              </div>
              <div>
                <label className="block text-xs text-brand-white/50 mb-2 uppercase tracking-tighter">Ciudad</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold">
                  {provinces.map(prov => (
                    <optgroup key={prov} label={prov} className="bg-brand-black text-brand-gold">
                      {getCitiesByProvince(prov).map(c => <option key={c.id} value={c.name} className="bg-brand-black text-brand-white">{c.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs text-brand-white/50 uppercase tracking-tighter">Bio Corta</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.keys(StitchEngine.getQuickDrafts(city)).map(theme => (
                      <button key={theme} onClick={() => setDesc(StitchEngine.getQuickDrafts(city)[theme])} className="text-[9px] bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-2 py-1 rounded-full">{theme}</button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold h-28 resize-none" placeholder="Cuéntanos un poco..." />
                  <button onClick={handleTransform} className="absolute bottom-2 right-2 p-2 bg-brand-gold/10 text-brand-gold rounded-lg"><Wand2 size={14} /></button>
                </div>
                <div className="mt-4 p-3 bg-white/5 rounded-xl flex gap-3 items-start border border-white/5">
                  <Zap className="text-brand-gold shrink-0 mt-0.5" size={14} />
                  <p className="text-[10px] text-brand-white/40 italic">{activeTip}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 text-brand-white/40 text-xs uppercase tracking-widest border border-white/10 rounded-xl">Volver</button>
                <button onClick={handleTransform} disabled={!name || !whatsapp || !desc} className="flex-[3] bg-brand-gold text-brand-black font-bold py-4 rounded-xl disabled:opacity-30">Continuar a Fotos</button>
              </div>
            </div>
          </div>
        );

      case 3: // Media
        return (
          <div className="animate-in fade-in slide-in-from-right-4 text-center">
            <Crown className="text-brand-gold mx-auto mb-4" size={32} />
            <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-widest text-center">Sube tus Fotos VIP</h2>
            <p className="text-brand-white/40 text-sm mb-8">Plan {plan} requiere fotos de alta resolución.</p>
            <div className="bg-white/5 border-2 border-dashed border-brand-gold/20 rounded-3xl p-6 mb-8">
              <UploadDropzone
                endpoint="modelImage"
                onClientUploadComplete={(res) => { if(res){ setImages(res.map(f => f.url)); setStep(4); }}}
                onUploadError={(err) => alert(`Error: ${err.message}`)}
              />
            </div>
            <button onClick={() => setStep(2)} className="text-brand-white/30 text-xs underline">Volver a descripción</button>
          </div>
        );

      case 4: // Preview
        return (
          <div className="animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <Sparkles className="text-brand-gold" />
              <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-widest text-center">Vista Previa Mobile</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
               {/* Phone Frame */}
               <div className="w-56 h-[460px] bg-brand-black border-[6px] border-white/10 rounded-[2.5rem] mx-auto overflow-hidden relative shadow-2xl">
                  {images[0] ? <img src={images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/5" />}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="text-xs font-bold text-white flex items-center gap-1">{name} <CheckCircle2 size={10} className="text-brand-gold" /></span>
                    <p className="text-[9px] text-brand-white/60 line-clamp-2 mt-1">{transformed}</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="bg-white/5 border border-brand-gold/20 p-5 rounded-2xl relative">
                    <p className="text-sm italic text-brand-white">"{transformed}"</p>
                    <div className="mt-3 flex gap-2">
                       {tags.map(t => <span key={t} className="text-[10px] text-brand-pink font-bold">{t}</span>)}
                    </div>
                  </div>
                  <button onClick={handleRegister} disabled={loading} className="w-full bg-brand-pink text-brand-white font-bold py-5 rounded-xl uppercase tracking-widest shadow-lg shadow-brand-pink/20 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <span>Publicar Anuncio</span>}
                  </button>
                  <button onClick={() => setStep(3)} className="w-full text-brand-white/20 text-[10px] uppercase font-bold text-center">Re-intentar Fotos</button>
               </div>
            </div>
          </div>
        );

      case 5: // Success
        return (
          <div className="text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-gold/20 text-brand-gold">
              <MessageCircle size={40} />
            </div>
            <h2 className="text-3xl font-serif text-brand-gold mb-4 text-center">¡Anuncio en Revisión!</h2>
            <p className="text-brand-white/60 text-sm mb-8 max-w-sm mx-auto">
              Nuestro equipo verificará tu identidad y calidad multimedia. Activa tu plan ahora vía WhatsApp.
            </p>
            <a href={`https://wa.me/593${whatsapp}`} className="inline-flex bg-brand-gold text-brand-black px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform">Contactar Soporte VIP</a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PrivacyModal isOpen={!hasAcceptedPrivacy} onAccept={() => setHasAcceptedPrivacy(true)} />
      <div className="bg-brand-black/90 backdrop-blur-xl border border-brand-gold/20 rounded-3xl overflow-hidden shadow-2xl min-h-[500px]">
        <div className="h-1 bg-white/5 w-full">
          <div className="h-full bg-brand-gold transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
        <div className="p-8 md:p-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
