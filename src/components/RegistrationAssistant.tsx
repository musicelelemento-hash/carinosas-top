"use client";

import React, { useState } from "react";
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
  Loader2
} from "lucide-react";
import PrivacyModal from "./PrivacyModal";

export default function RegistrationAssistant() {
  const [mounted, setMounted] = React.useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("Quito");
  const [desc, setDesc] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [transformed, setTransformed] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleTransform = () => {
    const luxText = StitchEngine.transformDescription(desc, city);
    const luxTags = StitchEngine.generateTags(city);
    setTransformed(luxText);
    setTags(luxTags);
    setStep(2);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('models').insert([
        { 
          name, 
          city, 
          whatsapp, 
          description: transformed, 
          tags, 
          images, 
          plan_type: 'Oro',
          age: 21 // Default for demo
        }
      ]);

      if (error) throw error;
      setStep(4);
    } catch (error) {
      console.error("Error registering model:", error);
      alert("Hubo un error al procesar tu registro. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PrivacyModal 
        isOpen={!hasAcceptedPrivacy} 
        onAccept={() => setHasAcceptedPrivacy(true)} 
      />
      <div className="bg-brand-black/90 backdrop-blur-xl border border-brand-gold/20 rounded-3xl overflow-hidden shadow-2xl">
        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full">
          <div 
            className="h-full bg-brand-gold transition-all duration-500" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-brand-gold" />
                <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-widest">Inicia tu Perfil Elite</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-brand-white/50 mb-2 uppercase tracking-tighter">Nombre Artístico</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold transition-colors"
                      placeholder="Ej: Valentina"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-brand-white/50 mb-2 uppercase tracking-tighter">WhatsApp</label>
                    <input 
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold transition-colors"
                      placeholder="Ej: 0991234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-brand-white/50 mb-2 uppercase tracking-tighter">Tu Ubicación</label>
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="Quito">Quito</option>
                    <option value="Guayaquil">Guayaquil</option>
                    <option value="Cuenca">Cuenca</option>
                    <option value="Manta">Manta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-brand-white/50 mb-2 uppercase tracking-tighter">Descripción Corta</label>
                  <textarea 
                    placeholder="Ej: Hola, soy nueva en Guayaquil..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-white outline-none focus:border-brand-gold h-32 resize-none transition-colors"
                  />
                  <p className="mt-2 text-[10px] text-brand-white/30 italic">Nuestra IA Stitch transformará esto en un texto de lujo.</p>
                </div>

                <button 
                  onClick={handleTransform}
                  disabled={!name || !whatsapp || !desc}
                  className="w-full bg-brand-gold text-brand-black disabled:opacity-50 font-bold py-4 rounded-xl hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Siguiente: Optimizar con Stitch</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="text-brand-gold" />
                <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-widest">Sube tus Fotos VIP</h2>
              </div>
              
              <p className="text-brand-white/60 mb-8">Sube al menos 3 fotos de alta calidad para activar el Plan Oro.</p>
              
              <div className="bg-white/5 border-2 border-dashed border-brand-gold/20 rounded-3xl p-4 mb-8">
                <UploadDropzone
                  endpoint="modelImage"
                  onClientUploadComplete={(res) => {
                    if (res) {
                      setImages(res.map(f => f.url));
                      setStep(3);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Error: ${error.message}`);
                  }}
                  appearance={{
                    button: "bg-brand-gold text-brand-black font-bold border-none",
                    container: "border-none",
                    label: "text-brand-gold hover:text-brand-gold/80"
                  }}
                />
              </div>

              <button 
                onClick={() => setStep(1)}
                className="text-brand-white/40 hover:text-brand-white text-sm"
              >
                ← Volver a descripción
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="text-brand-gold" />
                <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-widest">Resultado Stitch Gold</h2>
              </div>

              <div className="bg-white/5 border border-brand-gold/30 rounded-2xl p-6 mb-8 relative">
                <p className="text-lg italic text-brand-white leading-relaxed">
                  "{transformed}"
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="text-xs text-brand-pink font-bold">{tag}</span>
                  ))}
                </div>
                <div className="absolute -top-3 -right-3 bg-brand-gold text-brand-black px-3 py-1 rounded-full text-[10px] font-black">STITCH AI</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-white/10 p-6 rounded-2xl bg-white/2">
                  <TrendingUp className="text-brand-gold mb-3" />
                  <h3 className="font-serif text-brand-gold text-lg mb-2">Visibilidad Élite</h3>
                  <p className="text-sm text-brand-white/60">Tus anuncios aparecerán primero en sectores exclusivos.</p>
                </div>
                <div className="border border-white/10 p-6 rounded-2xl bg-white/2">
                  <CheckCircle2 className="text-brand-gold mb-3" />
                  <h3 className="font-serif text-brand-gold text-lg mb-2">Cero Fakes</h3>
                  <p className="text-sm text-brand-white/60">Verificación inmediata para garantizar confianza total.</p>
                </div>
              </div>

              <button 
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-brand-pink text-brand-white font-bold py-4 rounded-xl hover:bg-brand-pink/90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <span>Activar Plan Oro ($50)</span>}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-gold/30">
                <MessageCircle className="text-brand-gold" size={40} />
              </div>
              <h2 className="text-3xl font-serif text-brand-gold mb-4">¡Perfil Completado, {name}!</h2>
              <p className="text-brand-white/70 mb-8 max-w-md mx-auto">
                {StitchEngine.getConversionPitch(true)}
              </p>
              
              <a 
                href={`https://wa.me/593${whatsapp}`}
                className="inline-flex items-center gap-3 bg-brand-gold text-brand-black px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-gold"
              >
                <MessageCircle fill="currentColor" />
                Contactar para Activación Final
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
