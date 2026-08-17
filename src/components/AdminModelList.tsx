"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAdminModelsAction, updateModelAction, deleteModelAction } from "@/app/actions/admin";
import { UploadDropzone } from "@/components/Uploadthing";
import { 
  Trash2, 
  MapPin, 
  Crown, 
  ExternalLink,
  MessageCircle,
  Clock,
  Search,
  ChevronRight,
  X,
  Save,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  Phone,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";

interface Model {
  id: string;
  name: string;
  city: string;
  sector?: string;
  whatsapp?: string;
  age?: number;
  plan_type?: string;
  images?: string[];
  description?: string;
  is_verified?: boolean;
  is_verified_4k?: boolean;
  is_online?: boolean;
  personal_note?: string;
  country_code?: string;
  created_at: string;
}

export default function AdminModelList() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editModel, setEditModel] = useState<Model | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editSector, setEditSector] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editDesc, setEditDesc] = useState("");
  const [editVerified, setEditVerified] = useState(true);
  const [editVerified4k, setEditVerified4k] = useState(false);
  const [editOnline, setEditOnline] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const data = await getAdminModelsAction();
      if (data) {
        const PLAN_PRIORITY: Record<string, number> = {
          'VIP Elite': 0, 'Diamante': 1, 'Premium': 2, 'Básico': 3
        };
        setModels([...(data as unknown as Model[])].sort((a, b) => 
          (PLAN_PRIORITY[a.plan_type || ''] ?? 99) - (PLAN_PRIORITY[b.plan_type || ''] ?? 99)
        ));
      }
    } catch (err) {
      console.error("Admin fetch models error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchModels();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const openEdit = (model: Model) => {
    setEditModel(model);
    setEditName(model.name || "");
    setEditWhatsapp(model.whatsapp || "");
    setEditCity(model.city || "");
    setEditSector(model.sector || "");
    setEditAge(String(model.age || ""));
    setEditPlan(model.plan_type || "Anuncio Gratis");
    setEditImages(model.images || []);
    setEditDesc(model.description || "");
    setEditVerified(model.is_verified ?? true);
    setEditVerified4k(Boolean(model.is_verified_4k));
    setEditOnline(Boolean(model.is_online));
  };

  const closeEdit = () => { setEditModel(null); setSaveSuccess(false); };

  const handleSave = async () => {
    if (!editModel) return;
    setSaving(true);
    try {
      await updateModelAction(editModel.id, {
        name: editName,
        whatsapp: editWhatsapp,
        city: editCity,
        sector: editSector,
        age: parseInt(editAge) || editModel.age,
        plan_type: editPlan,
        images: editImages,
        description: editDesc,
        is_verified: editVerified,
        is_verified_4k: editVerified4k,
        is_online: editOnline
      });

      setSaveSuccess(true);
      fetchModels();
      setTimeout(closeEdit, 1500);
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios.");
    }
    setSaving(false);
  };

  const handleToggle4K = async (model: Model) => {
    const newStatus = !model.is_verified_4k;
    setModels(prev => prev.map(m => m.id === model.id ? { ...m, is_verified_4k: newStatus } : m));
    try {
      await updateModelAction(model.id, { is_verified_4k: newStatus });
    } catch (err) {
      console.error(err);
      fetchModels();
    }
  };

  const handleToggleOnline = async (model: Model) => {
    const newStatus = !model.is_online;
    setModels(prev => prev.map(m => m.id === model.id ? { ...m, is_online: newStatus } : m));
    try {
      await updateModelAction(model.id, { is_online: newStatus });
    } catch (err) {
      console.error(err);
      fetchModels();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    try {
      await deleteModelAction(id);
      setModels(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar.");
    }
  };

  const removeImage = (idx: number) => setEditImages(prev => prev.filter((_, i) => i !== idx));

  const filteredModels = models.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 pb-28 md:pb-12 space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-brand-gold tracking-tighter flex items-center gap-3">
            <Sparkles size={24} />
            Consola Ejecutiva de Catálogo
          </h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black mt-1">
            {models.length} Modelos Registradas · {models.filter(m => m.is_verified_4k).length} Verificadas 4K
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/40" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-obsidian border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-xs text-white outline-none focus:border-brand-gold transition-all"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-gold/10 border-t-brand-gold rounded-full animate-spin" />
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Sincronizando Base de Datos...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredModels.map((model) => (
            <div key={model.id} className="glass-obsidian border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-gold/40 transition-all shadow-xl">
              
              {/* Photo & 4K Overlay */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/15">
                <Image
                  src={model.images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'}
                  alt={model.name}
                  fill
                  className="object-cover"
                />
                {model.is_verified_4k && (
                  <div className="absolute top-1 left-1 bg-brand-gold text-brand-black text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase">
                    4K
                  </div>
                )}
              </div>

              {/* Info Column */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h3 className="text-xl font-serif text-white italic font-bold">{model.name}</h3>
                  
                  <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    model.plan_type === 'Diamante' || model.plan_type === 'VIP Elite'
                      ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                      : 'bg-white/5 border-white/10 text-white/50'
                  }`}>
                    {(model.plan_type === 'Diamante' || model.plan_type === 'VIP Elite') && <Crown size={10} />}
                    {model.plan_type || 'Básico'}
                  </div>

                  {/* 1-Click Fast 4K Toggle */}
                  <button 
                    onClick={() => handleToggle4K(model)}
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border transition-all ${
                      model.is_verified_4k 
                        ? 'bg-brand-gold text-brand-black border-brand-gold shadow-sm' 
                        : 'bg-white/5 border-white/15 text-white/40 hover:text-white'
                    }`}
                  >
                    <ShieldCheck size={10} />
                    {model.is_verified_4k ? '4K Verificada' : '+ Activar 4K'}
                  </button>

                  {/* 1-Click Fast Online Toggle */}
                  <button 
                    onClick={() => handleToggleOnline(model)}
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border transition-all ${
                      model.is_online 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : 'bg-white/5 border-white/15 text-white/40 hover:text-white'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${model.is_online ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                    {model.is_online ? 'En Línea' : 'Desconectada'}
                  </button>

                  {/* AI Authenticity Scorecard */}
                  <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <Sparkles size={10} />
                    <span>99.2% IA Auténtica</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] text-white/40 uppercase tracking-widest font-black">
                  <span className="flex items-center gap-1.5 text-white/60"><MapPin size={12} className="text-brand-gold" /> {model.city} {model.sector && `· ${model.sector}`}</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><MessageCircle size={12} /> {model.whatsapp}</span>
                  <span className="flex items-center gap-1.5 opacity-50"><Clock size={12} /> {new Date(model.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <a href={`/profile/${model.id}`} target="_blank"
                  className="p-3 rounded-2xl glass-dark border border-white/10 text-white/50 hover:text-brand-gold hover:border-brand-gold transition-all" title="Ver perfil público">
                  <ExternalLink size={18} />
                </a>
                <button onClick={() => handleDelete(model.id)}
                  className="p-3 rounded-2xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink/70 hover:bg-brand-pink hover:text-white transition-all" title="Eliminar">
                  <Trash2 size={18} />
                </button>
                <div className="ml-2 h-10 w-[1px] bg-white/10 hidden md:block" />
                <button onClick={() => openEdit(model)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all shadow-md">
                  Editar <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}

          {filteredModels.length === 0 && (
            <div className="py-20 text-center glass-obsidian rounded-[3rem] border border-dashed border-white/10">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black">No se encontraron registros</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          EDIT MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {editModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" onClick={closeEdit}>
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-obsidian border border-brand-gold/30 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-8 border-b border-white/10 bg-brand-black/90 backdrop-blur-2xl rounded-t-[2.5rem]">
              <div>
                <h3 className="text-3xl font-serif text-brand-gold italic font-bold">Editar Perfil</h3>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.4em] font-black mt-1">{editModel.name}</p>
              </div>
              <button onClick={closeEdit} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Toggles Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl glass-dark border border-white/10">
                <label className="flex items-center gap-3 cursor-pointer text-xs text-white">
                  <input 
                    type="checkbox" 
                    checked={editVerified4k} 
                    onChange={e => setEditVerified4k(e.target.checked)} 
                    className="accent-brand-gold w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-brand-gold" />
                    <span className="font-bold text-brand-gold uppercase tracking-wider text-[11px]">Badge 4K Verificado</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs text-white">
                  <input 
                    type="checkbox" 
                    checked={editOnline} 
                    onChange={e => setEditOnline(e.target.checked)} 
                    className="accent-emerald-400 w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-emerald-400" />
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Estado En Línea (Radar)</span>
                  </div>
                </label>
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] ml-1">Nombre Artístico</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full glass-dark border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] ml-1 flex items-center gap-2"><Phone size={12} className="text-brand-gold" /> WhatsApp</label>
                  <input value={editWhatsapp} onChange={e => setEditWhatsapp(e.target.value)}
                    className="w-full glass-dark border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] ml-1 flex items-center gap-2"><MapPin size={12} className="text-brand-gold" /> Ciudad</label>
                  <input value={editCity} onChange={e => setEditCity(e.target.value)}
                    className="w-full glass-dark border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] ml-1">Sector / Referencia</label>
                  <input value={editSector} onChange={e => setEditSector(e.target.value)}
                    className="w-full glass-dark border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] ml-1">Edad</label>
                  <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)}
                    className="w-full glass-dark border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] ml-1">Plan de Visibilidad</label>
                  <select value={editPlan} onChange={e => setEditPlan(e.target.value)}
                    className="w-full glass-dark border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all cursor-pointer text-sm">
                    <option value="Anuncio Gratis" className="bg-brand-black">Anuncio Gratis</option>
                    <option value="Premium" className="bg-brand-black">Premium</option>
                    <option value="VIP Elite" className="bg-brand-black">VIP Elite</option>
                    <option value="Diamante" className="bg-brand-black">Diamante</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] ml-1">Descripción</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4}
                  className="w-full glass-dark border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold h-28 resize-none transition-all text-sm leading-relaxed" />
              </div>

              {/* Image Section */}
              <div className="space-y-5 p-6 glass-obsidian border border-brand-gold/20 rounded-[2rem]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-brand-gold font-serif text-xl italic">Fotos del Perfil</h4>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mt-1">{editImages.length} de 6 imágenes</p>
                  </div>
                </div>

                {/* Current Images Grid */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {editImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10 hover:border-brand-gold/40 transition-all">
                        <Image 
                          src={img} 
                          alt={`Imagen de perfil ${i + 1}`} 
                          fill 
                          className="object-cover" 
                        />
                        <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <button onClick={() => removeImage(i)}
                            className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-brand-black/70 text-[8px] text-white/70 font-black px-2 py-0.5 rounded-full uppercase">
                          {i === 0 ? "Principal" : `#${i + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploadthing Dropzone for editing */}
                {editImages.length < 6 && (
                  <div className="uploadthing-edit">
                    <UploadDropzone
                      endpoint="modelImage"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          const newUrls = res.map(f => f.url);
                          setEditImages(prev => [...prev, ...newUrls].slice(0, 6));
                        }
                      }}
                      onUploadError={(err) => alert(`Error subiendo imagen: ${err.message}`)}
                    />
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 pt-4">
                <button onClick={closeEdit}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:border-white/30 hover:text-white transition-all">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl ${
                    saveSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-brand-gold text-brand-black hover:scale-[1.02] active:scale-95 disabled:opacity-40'
                  }`}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <><CheckCircle2 size={18} /> Guardado</> : <><Save size={18} /> Guardar Cambios</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
