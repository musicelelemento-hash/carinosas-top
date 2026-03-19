"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  Image,
  Phone
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

  const fetchModels = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const PLAN_PRIORITY: Record<string, number> = {
        'VIP Elite': 0, 'Diamante': 1, 'Premium': 2, 'Básico': 3
      };
      setModels([...data].sort((a, b) => 
        (PLAN_PRIORITY[a.plan_type] ?? 99) - (PLAN_PRIORITY[b.plan_type] ?? 99)
      ));
    }
    setLoading(false);
  };

  useEffect(() => { fetchModels(); }, []);

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
  };

  const closeEdit = () => { setEditModel(null); setSaveSuccess(false); };

  const handleSave = async () => {
    if (!editModel) return;
    setSaving(true);
    const { error } = await supabase.from('models').update({
      name: editName,
      whatsapp: editWhatsapp,
      city: editCity,
      sector: editSector,
      age: parseInt(editAge) || editModel.age,
      plan_type: editPlan,
      images: editImages,
      description: editDesc,
    }).eq('id', editModel.id);

    if (!error) {
      setSaveSuccess(true);
      fetchModels();
      setTimeout(closeEdit, 1500);
    } else {
      alert("Error al guardar cambios.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    const { error } = await supabase.from('models').delete().eq('id', id);
    if (!error) setModels(prev => prev.filter(m => m.id !== id));
    else alert("Error al eliminar.");
  };

  const removeImage = (idx: number) => setEditImages(prev => prev.filter((_, i) => i !== idx));

  const filteredModels = models.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-brand-gold tracking-tighter">Gestión de Catálogo</h2>
          <p className="text-[10px] text-brand-white/40 uppercase tracking-[0.3em] font-black">Control Total de Publicaciones</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/40" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-black/40 border border-white/10 rounded-full py-3 pl-12 pr-6 text-xs text-white outline-none focus:border-brand-gold transition-all"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-gold/10 border-t-brand-gold rounded-full animate-spin" />
          <span className="text-[10px] text-brand-white/20 uppercase tracking-widest">Sincronizando Base de Datos...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredModels.map((model) => (
            <div key={model.id} className="glass-dark border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-gold/30 transition-all">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                <img
                  src={model.images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h3 className="text-xl font-serif text-brand-white">{model.name}</h3>
                  <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    model.plan_type === 'Diamante' || model.plan_type === 'VIP Elite'
                      ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {(model.plan_type === 'Diamante' || model.plan_type === 'VIP Elite') && <Crown size={10} />}
                    {model.plan_type || 'Básico'}
                  </div>
                  {model.images && model.images.length > 1 && (
                    <span className="text-[8px] text-white/30 font-black uppercase tracking-widest flex items-center gap-1">
                      <Image size={10} /> {model.images.length} fotos
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] text-brand-white/30 uppercase tracking-widest font-black">
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-brand-gold" /> {model.city} {model.sector && `- ${model.sector}`}</span>
                  <span className="flex items-center gap-1.5 text-brand-pink/60"><MessageCircle size={12} /> {model.whatsapp}</span>
                  <span className="flex items-center gap-1.5 opacity-50"><Clock size={12} /> {new Date(model.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={`/profile/${model.id}`} target="_blank"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-brand-gold hover:border-brand-gold transition-all" title="Ver perfil público">
                  <ExternalLink size={18} />
                </a>
                <button onClick={() => handleDelete(model.id)}
                  className="p-3 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink/60 hover:bg-brand-pink hover:text-white transition-all" title="Eliminar">
                  <Trash2 size={18} />
                </button>
                <div className="ml-2 h-10 w-[1px] bg-white/5 hidden md:block" />
                <button onClick={() => openEdit(model)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all">
                  Editar <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
          {filteredModels.length === 0 && (
            <div className="py-20 text-center glass-dark rounded-[3rem] border border-dashed border-white/10">
              <p className="text-[10px] text-brand-white/20 uppercase tracking-[0.5em] font-black">No se encontraron registros</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          EDIT MODAL with full image upload support
          ═══════════════════════════════════════════════════════════════ */}
      {editModel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={closeEdit}>
          <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-3xl" />
          
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-dark border border-brand-gold/20 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-8 border-b border-white/5 bg-brand-black/60 backdrop-blur-2xl rounded-t-[2.5rem]">
              <div>
                <h3 className="text-3xl font-serif text-brand-gold italic">Editar Perfil</h3>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-black mt-1">{editModel.name}</p>
              </div>
              <button onClick={closeEdit} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] ml-1">Nombre Artístico</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] ml-1 flex items-center gap-2"><Phone size={12} className="text-brand-gold" /> WhatsApp</label>
                  <input value={editWhatsapp} onChange={e => setEditWhatsapp(e.target.value)}
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] ml-1 flex items-center gap-2"><MapPin size={12} className="text-brand-gold" /> Ciudad</label>
                  <input value={editCity} onChange={e => setEditCity(e.target.value)}
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] ml-1">Sector / Referencia</label>
                  <input value={editSector} onChange={e => setEditSector(e.target.value)}
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] ml-1">Edad</label>
                  <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)}
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] ml-1">Plan de Visibilidad</label>
                  <select value={editPlan} onChange={e => setEditPlan(e.target.value)}
                    className="w-full bg-brand-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer">
                    <option value="Anuncio Gratis">Anuncio Gratis</option>
                    <option value="Premium">Premium</option>
                    <option value="Diamante">Diamante</option>
                    <option value="VIP Elite">VIP Elite</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] ml-1">Descripción</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4}
                  className="w-full bg-brand-black/40 border border-white/10 rounded-3xl py-4 px-6 text-white outline-none focus:border-brand-gold h-32 resize-none transition-all" />
              </div>

              {/* ─── Image Section ─── */}
              <div className="space-y-5 p-6 glass-premium border border-brand-gold/10 rounded-[2rem]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-brand-gold font-serif text-xl italic">Fotos del Perfil</h4>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mt-1">{editImages.length} de 6 imágenes · Arrastra o sube para añadir más</p>
                  </div>
                </div>

                {/* Current Images Grid */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {editImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10 hover:border-brand-gold/40 transition-all">
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => removeImage(i)}
                            className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-brand-black/70 text-[8px] text-white/60 font-black px-2 py-0.5 rounded-full uppercase">
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
                {editImages.length >= 6 && (
                  <p className="text-center text-[9px] text-brand-gold/50 uppercase font-black tracking-widest py-4">Límite de 6 fotos alcanzado. Elimina alguna para subir más.</p>
                )}
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 pt-4">
                <button onClick={closeEdit}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-white/30 hover:text-white transition-all">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl ${
                    saveSuccess
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-gold text-brand-black hover:scale-[1.02] active:scale-95 disabled:opacity-40'
                  }`}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <><CheckCircle2 size={18} /> Guardado</> : <><Save size={18} /> Guardar Cambios</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .uploadthing-edit [data-ut-element="root"] {
          background: rgba(5, 5, 5, 0.4);
          border: 2px dashed rgba(212, 175, 55, 0.2);
          border-radius: 1.5rem;
          padding: 2rem;
          transition: all 0.3s;
        }
        .uploadthing-edit [data-ut-element="root"]:hover {
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(212, 175, 55, 0.03);
        }
        .uploadthing-edit [data-ut-element="label"] {
          color: rgba(212, 175, 55, 0.6) !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          text-transform: uppercase;
          letter-spacing: 0.3em;
        }
        .uploadthing-edit [data-ut-element="button"],
        .uploadthing-edit .ut-button {
          background-color: #D4AF37 !important;
          color: #050505 !important;
          border-radius: 1rem !important;
          font-weight: 900 !important;
          font-size: 10px !important;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 0.75rem 1.5rem !important;
        }
        .uploadthing-edit .ut-allowed-content { display: none; }
      `}</style>
    </div>
  );
}
