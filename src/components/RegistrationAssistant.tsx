"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StitchEngine } from "@/lib/stitch";
import { registerModelAction } from "@/app/actions/admin";
import { UploadDropzone } from "@/components/Uploadthing";
import { 
  Sparkles, 
  CheckCircle2, 
  MessageCircle,
  Crown,
  Loader2,
  Wand2,
  Zap,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sliders,
  Star
} from "lucide-react";
import PrivacyModal from "./PrivacyModal";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";

export default function RegistrationAssistant() {
  const [mounted, setMounted] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("VIP Elite");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Earnings Calculator State
  const [appointmentsPerWeek, setAppointmentsPerWeek] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(120);

  // Form State
  const [city, setCity] = useState("Quito");
  const [sector, setSector] = useState("");
  const [age, setAge] = useState(23);
  const [desc, setDesc] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [transformed, setTransformed] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [activeTip, setActiveTip] = useState("");

  const provinces = getProvinces();

  const estimatedMonthly = appointmentsPerWeek * hourlyRate * 4;

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
      await registerModelAction({
        name,
        city,
        sector,
        whatsapp,
        description: transformed || StitchEngine.transformDescription(desc, city),
        tags: tags.length > 0 ? tags : StitchEngine.generateTags(city),
        images,
        plan_type: plan,
        ageConfirmed
      });
      setStep(5);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al registrar. Revisa los datos e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch(step) {
      case 1: // Earnings Calculator & Plan Selection
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Interactive Earnings Simulator */}
            <div className="p-8 rounded-3xl glass-obsidian border border-brand-gold/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-brand-gold mb-2">
                    <TrendingUp size={18} className="animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Simulador de Ganancias 2026</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white italic">¿Cuánto puedes ganar en Cariñosas.top?</h3>
                  <p className="text-xs text-white/50 mt-1">Calculado en base al promedio de reservas verificadas en Quito y Guayaquil.</p>
                </div>

                <div className="glass-dark p-6 rounded-2xl border border-brand-gold/40 text-center min-w-[220px] shadow-[0_0_30px_rgba(212,168,67,0.2)]">
                  <span className="text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Ingreso Estimado</span>
                  <span className="text-3xl md:text-4xl font-serif text-brand-gold font-bold leading-none block">
                    ${estimatedMonthly.toLocaleString()} <span className="text-xs font-sans text-white/60">USD/mes</span>
                  </span>
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-2 block">
                    ★ 100% Pagos Directos a Ti
                  </span>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/70 font-bold uppercase tracking-wider">Citas por semana:</span>
                    <span className="text-brand-gold font-serif text-lg font-bold">{appointmentsPerWeek} citas</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={appointmentsPerWeek}
                    onChange={(e) => setAppointmentsPerWeek(Number(e.target.value))}
                    className="w-full accent-brand-gold bg-white/10 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>1 cita/sem</span>
                    <span>8 citas/sem</span>
                    <span>15 citas/sem</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/70 font-bold uppercase tracking-wider">Tarifa por hora:</span>
                    <span className="text-brand-gold font-serif text-lg font-bold">${hourlyRate} USD/h</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="300"
                    step="10"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full accent-brand-gold bg-white/10 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>$80/h</span>
                    <span>$180/h</span>
                    <span>$300/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Tier Comparator */}
            <div className="space-y-6">
              <div className="text-center">
                <Crown className="text-brand-gold mx-auto mb-2" size={28} />
                <h2 className="text-2xl font-serif text-white italic">Selecciona tu Nivel de Membresía</h2>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Planes sin comisiones · 100% de tus ingresos son tuyos</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    name: 'Gratis', 
                    value: 'Anuncio Gratis', 
                    price: '$0', 
                    tag: 'Básico',
                    recommended: false,
                    features: ['Listado Base en Catálogo', 'WhatsApp Directo', 'Validación Estándar'] 
                  },
                  { 
                    name: 'Premium', 
                    value: 'Premium', 
                    price: '$25/mes', 
                    tag: 'Popular',
                    recommended: false,
                    features: ['Posicionamiento Destacado', 'Badge 4K Verificado', 'Soporte Prioritario 24/7'] 
                  },
                  { 
                    name: 'VIP Elite', 
                    value: 'VIP Elite', 
                    price: '$50/mes', 
                    tag: 'MÁS ELEGIDO',
                    recommended: true,
                    features: ['Stitch AI Copywriting', 'Historias 4K en Cabecera', 'Recomendación en Concierge IA', 'Pin Dorado en Radar'] 
                  },
                  { 
                    name: 'Diamante 4K', 
                    value: 'Diamante', 
                    price: '$100/mes', 
                    tag: 'TOP #1',
                    recommended: false,
                    features: ['Top 1 Nacional Garantizado', 'Producción Multimedia VIP', 'Bóveda de Medios Protegida', 'Máxima Conversión'] 
                  }
                ].map((p) => (
                  <button 
                    key={p.name}
                    onClick={() => setPlan(p.value)}
                    className={`p-6 rounded-3xl border transition-all text-left relative flex flex-col justify-between ${
                      plan === p.value 
                        ? 'border-brand-gold bg-brand-gold/15 shadow-[0_0_30px_rgba(212,168,67,0.3)] scale-[1.02]' 
                        : 'border-white/10 glass-dark hover:border-white/30'
                    }`}
                  >
                    {p.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-black text-[8px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                        {p.tag}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-black text-white uppercase tracking-wider">{p.name}</span>
                        {p.recommended && <Crown size={14} className="text-brand-gold" />}
                      </div>
                      <span className="text-2xl font-serif text-brand-gold block mb-4">{p.price}</span>
                      
                      <ul className="space-y-2.5 mb-6">
                        {p.features.map(f => (
                          <li key={f} className="text-[10px] text-white/70 flex items-start gap-2 font-medium">
                            <CheckCircle2 size={12} className="text-brand-gold shrink-0 mt-0.5" /> 
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`w-full py-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider transition-all ${
                      plan === p.value ? 'bg-brand-gold text-brand-black shadow-md' : 'bg-white/5 text-white/50 hover:text-white'
                    }`}>
                      {plan === p.value ? 'Plan Seleccionado' : 'Elegir Plan'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-10 py-5 bg-brand-gold hover:bg-white text-brand-black rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all transform hover:scale-105 shadow-[0_10px_35px_rgba(212,168,67,0.4)] inline-flex items-center gap-3"
                >
                  <ShieldCheck size={18} />
                  Continuar al Registro con Plan {plan}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      case 2: // Basic Info & AI Copywriter
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Sparkles className="text-brand-gold" size={24} />
                <div>
                  <h2 className="text-2xl font-serif text-white italic">Datos de tu Perfil Artístico</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Plan Activo: {plan}</p>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="text-[10px] text-brand-gold uppercase tracking-wider font-bold hover:underline">
                Cambiar Plan
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-white/50 mb-2 uppercase tracking-wider font-bold">Nombre Artístico</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full glass-dark border border-white/15 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-brand-gold text-sm" placeholder="Ej: Valentina" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-2 uppercase tracking-wider font-bold">Edad</label>
                  <input type="number" min="18" max="45" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full glass-dark border border-white/15 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-brand-gold text-sm" placeholder="23" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-2 uppercase tracking-wider font-bold">WhatsApp Directo</label>
                  <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full glass-dark border border-white/15 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-brand-gold text-sm" placeholder="0991234567" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-white/50 mb-2 uppercase tracking-wider font-bold">Ciudad Principal</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full glass-dark border border-white/15 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-brand-gold text-sm">
                    {provinces.map(prov => (
                      <optgroup key={prov} label={prov} className="bg-brand-black text-brand-gold">
                        {getCitiesByProvince(prov).map(c => <option key={c.id} value={c.name} className="bg-brand-black text-white">{c.name}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-2 uppercase tracking-wider font-bold">Sector / Zona Exclusiva</label>
                  <input type="text" value={sector} onChange={(e) => setSector(e.target.value)} className="w-full glass-dark border border-white/15 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-brand-gold text-sm" placeholder="Ej: La Carolina / Samborondón" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] text-white/50 uppercase tracking-wider font-bold">Descripción / Bio de Presentación</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.keys(StitchEngine.getQuickDrafts(city)).map(theme => (
                      <button 
                        key={theme} 
                        type="button"
                        onClick={() => setDesc(StitchEngine.getQuickDrafts(city)[theme])} 
                        className="text-[9px] bg-brand-gold/10 border border-brand-gold/30 text-brand-gold px-2.5 py-1 rounded-full font-bold hover:bg-brand-gold hover:text-brand-black transition-all"
                      >
                        ✦ {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    className="w-full glass-dark border border-white/15 rounded-2xl p-4 text-white outline-none focus:border-brand-gold h-32 resize-none text-sm leading-relaxed" 
                    placeholder="Escribe una breve descripción de tus servicios y personalidad..." 
                  />
                  <button 
                    type="button"
                    onClick={handleTransform} 
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-brand-gold text-brand-black rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 hover:bg-white transition-all shadow-md"
                  >
                    <Wand2 size={12} /> Stitch AI Enhance
                  </button>
                </div>

                <div className="mt-3 p-3.5 glass-obsidian rounded-2xl flex gap-3 items-center border border-white/5">
                  <Zap className="text-brand-gold shrink-0" size={16} />
                  <p className="text-[10px] text-white/60 italic">{activeTip}</p>
                </div>
              </div>

              <label className="flex items-center gap-3 text-xs text-white/70 p-4 rounded-2xl glass-dark border border-white/10 cursor-pointer">
                <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} className="accent-brand-gold w-4 h-4 rounded" />
                <span>Confirmo que tengo al menos 18 años, soy mayor de edad y actúo de forma 100% independiente.</span>
              </label>

              <div className="flex gap-4 pt-2">
                <button onClick={() => setStep(1)} className="px-6 py-4 text-white/50 text-xs uppercase tracking-widest border border-white/10 rounded-2xl hover:text-white transition-colors">Volver</button>
                <button onClick={handleTransform} disabled={!name || !whatsapp || !desc || !ageConfirmed} className="flex-1 bg-brand-gold hover:bg-white text-brand-black font-black py-4 rounded-2xl uppercase tracking-widest disabled:opacity-30 transition-all shadow-lg">Continuar a Galería Multimedia</button>
              </div>
            </div>
          </div>
        );

      case 3: // Media Upload
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 text-center">
            <div>
              <Crown className="text-brand-gold mx-auto mb-3" size={36} />
              <h2 className="text-3xl font-serif text-white italic">Sube tus Fotos de Alta Definición</h2>
              <p className="text-white/50 text-xs mt-1">El plan {plan} incluye procesamiento y marca de agua 4K de ultra-lujo.</p>
            </div>

            <div className="glass-obsidian border-2 border-dashed border-brand-gold/30 rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
              <UploadDropzone
                endpoint="modelImage"
                onClientUploadComplete={(res) => { 
                  if(res && res.length > 0){ 
                    setImages(res.map(f => f.url)); 
                    setStep(4); 
                  }
                }}
                onUploadError={(err) => alert(`Error al subir imagen: ${err.message}`)}
              />
            </div>

            <button onClick={() => setStep(2)} className="text-white/40 text-xs uppercase tracking-wider hover:text-brand-gold underline transition-colors">
              ← Volver a editar datos
            </button>
          </div>
        );

      case 4: // Live Mockup Preview
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <Sparkles className="text-brand-gold mx-auto mb-2" size={28} />
              <h2 className="text-2xl md:text-3xl font-serif text-white italic">Vista Previa de tu Tarjeta 4K</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Así te verán miles de clientes VIP en Ecuador</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-2xl mx-auto">
              {/* Phone Frame Mockup */}
              <div className="w-64 h-[440px] bg-[#08080C] border-[6px] border-white/20 rounded-[2.5rem] mx-auto overflow-hidden relative shadow-[0_0_50px_rgba(212,168,67,0.3)]">
                {images[0] ? (
                  <Image 
                    src={images[0]} 
                    alt="Preview" 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/30 text-xs">Sin Foto</div>
                )}
                
                {/* 4K Verified Badge */}
                <div className="absolute top-4 left-4 bg-brand-gold text-brand-black text-[8px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg z-20">
                  <ShieldCheck size={10} /> 4K VERIFIED
                </div>

                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent z-10 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-serif font-bold text-white italic">{name}</span>
                    <span className="text-[10px] text-white/60">, {age}</span>
                  </div>
                  <p className="text-[8px] text-brand-gold font-bold uppercase tracking-wider">{sector || city}</p>
                  <p className="text-[9px] text-white/70 line-clamp-2 italic pt-1">&quot;{transformed || desc}&quot;</p>
                </div>
              </div>

              {/* Action Column */}
              <div className="space-y-6">
                <div className="glass-obsidian border border-brand-gold/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 uppercase tracking-wider font-bold">Plan Seleccionado:</span>
                    <span className="text-brand-gold font-bold">{plan}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 uppercase tracking-wider font-bold">Ubicación:</span>
                    <span className="text-white font-medium">{city}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 uppercase tracking-wider font-bold">WhatsApp:</span>
                    <span className="text-emerald-400 font-mono font-bold">{whatsapp}</span>
                  </div>
                </div>

                <button 
                  onClick={handleRegister} 
                  disabled={loading} 
                  className="w-full bg-brand-gold hover:bg-white text-brand-black font-black py-4 rounded-2xl uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,168,67,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Publicar Mi Perfil Ahora</span>}
                </button>

                <button onClick={() => setStep(3)} className="w-full text-white/40 text-[10px] uppercase font-bold text-center hover:text-brand-gold transition-colors">
                  ← Cambiar Fotos
                </button>
              </div>
            </div>
          </div>
        );

      case 5: // Success & WhatsApp Activation
        return (
          <div className="text-center space-y-6 py-6 animate-in zoom-in-95 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-brand-gold/15 rounded-full flex items-center justify-center mx-auto border border-brand-gold/40 text-brand-gold shadow-[0_0_40px_rgba(212,168,67,0.3)]">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-serif text-white italic font-bold">¡Solicitud Enviada con Éxito!</h2>
              <p className="text-white/60 text-xs leading-relaxed">
                Tu perfil artístico <strong className="text-brand-gold">{name}</strong> ha sido recibido por nuestro equipo de verificación de Quito y Guayaquil.
              </p>
            </div>

            <div className="p-5 glass-obsidian rounded-2xl border border-brand-gold/30 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 size={14} /> Paso 1: Perfil registrado en base de datos.
              </div>
              <div className="flex items-center gap-2 text-brand-gold font-bold">
                <Zap size={14} /> Paso 2: Activa tu sello 4K y plan vía WhatsApp en 2 minutos.
              </div>
            </div>

            <button
              onClick={() => {
                const text = encodeURIComponent(`Hola, acabo de registrar mi perfil ${name} en Cariñosas.top con plan ${plan}. Deseo activar mi publicación.`);
                window.open(`https://wa.me/593987654321?text=${text}`, '_blank');
              }}
              className="w-full py-4 bg-brand-gold hover:bg-white text-brand-black font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2.5 transition-all text-xs"
            >
              <MessageCircle size={18} fill="currentColor" />
              Activar Perfil por WhatsApp
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <PrivacyModal isOpen={!hasAcceptedPrivacy} onAccept={() => setHasAcceptedPrivacy(true)} />
      
      {/* Container with Glass Obsidian styling */}
      <div className="glass-obsidian border border-brand-gold/30 rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
        
        {/* Step Progress Bar */}
        <div className="h-1.5 bg-white/10 w-full">
          <div 
            className="h-full bg-gradient-to-r from-brand-gold to-white transition-all duration-700 shadow-[0_0_15px_rgba(212,168,67,0.8)]" 
            style={{ width: `${(step / 5) * 100}%` }} 
          />
        </div>

        <div className="p-6 md:p-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
