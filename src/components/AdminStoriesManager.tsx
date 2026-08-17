"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Film, 
  Sparkles, 
  Trash2, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  Camera,
  Play
} from "lucide-react";
import { getAdminStoriesAction, createAdminStoryAction, deleteAdminStoryAction, getAdminModelsAction } from "@/app/actions/admin";
import { sound } from "@/lib/soundEngine";

export default function AdminStoriesManager() {
  const [stories, setStories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [selectedModelId, setSelectedModelId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchStoriesAndModels = async () => {
    setLoading(true);
    try {
      const [storiesData, modelsData] = await Promise.all([
        getAdminStoriesAction(),
        getAdminModelsAction()
      ]);
      setStories(storiesData || []);
      setModels(modelsData || []);
      if (modelsData?.length > 0 && !selectedModelId) {
        setSelectedModelId(modelsData[0].id);
      }
    } catch (err) {
      console.warn("Stories fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoriesAndModels();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModelId || !mediaUrl.trim() || saving) return;

    setSaving(true);
    try {
      await createAdminStoryAction({
        model_id: selectedModelId,
        media_url: mediaUrl.trim(),
        caption: caption.trim() || "Historia 4K Oficial"
      });
      sound.playGoldChime();
      setIsCreating(false);
      setMediaUrl("");
      setCaption("");
      fetchStoriesAndModels();
    } catch (err: any) {
      alert(err.message || "Error al crear historia.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta historia 24h?")) return;
    try {
      await deleteAdminStoryAction(id);
      sound.playSubtleClick();
      setStories(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar historia.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-obsidian border border-brand-gold/30 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-brand-gold/40 text-[9px] font-black uppercase tracking-widest text-brand-gold">
            <Film size={12} />
            <span>Historias 4K Efímeras & Reels de Alto Impacto</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Gestor & Moderador de Historias 24h
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            Publica historias flash oficiales para cualquier modelo del catálogo o elimina contenido expirado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Publicar Historia</span>
          </button>
        </div>
      </div>

      {/* Creation Modal / Drawer */}
      {isCreating && (
        <form onSubmit={handleCreate} className="glass-obsidian border border-brand-gold/40 rounded-3xl p-6 space-y-4 animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white">Nueva Historia 24h para el Catálogo</h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-[#A1A1AA] hover:text-white cursor-pointer">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-[#A1A1AA] uppercase font-bold block mb-1">Modelo Destino</label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-brand-gold"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#0c0c12] text-white">
                    {m.name} ({m.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#A1A1AA] uppercase font-bold block mb-1">URL de Foto / Video 4K</label>
              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-[#A1A1AA] outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#A1A1AA] uppercase font-bold block mb-1">Texto / Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ej: Lista para una velada en Samborondón ✨"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-[#A1A1AA] outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Publicando..." : "Lanzar Historia en Vivo"}
          </button>
        </form>
      )}

      {/* Stories Grid */}
      <div className="glass-obsidian border border-white/10 rounded-3xl p-6">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest font-mono">Cargando historias activas...</span>
          </div>
        ) : stories.length === 0 ? (
          <div className="py-12 text-center text-[#A1A1AA] space-y-2">
            <Film size={36} className="text-brand-gold mx-auto opacity-50" />
            <p className="text-sm font-bold">No hay historias 24h activas en este momento.</p>
            <p className="text-xs text-[#A1A1AA]/60 font-mono">Publica una nueva historia con el botón superior.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stories.map((story) => (
              <div key={story.id} className="glass-dark border border-white/10 rounded-2xl overflow-hidden group hover:border-brand-gold/40 transition-all flex flex-col justify-between">
                
                {/* Media Image */}
                <div className="relative aspect-[9/16] max-h-64 w-full bg-black/50 overflow-hidden">
                  <Image
                    src={story.media_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"}
                    alt={story.caption || "Historia"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top info */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[10px] font-bold text-white z-10">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                      {story.models?.name || "Modelo VIP"}
                    </span>
                    <span className="flex items-center gap-1 text-brand-gold bg-black/60 px-2 py-0.5 rounded-full">
                      <Eye size={11} /> {story.views_count || 0}
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-3 inset-x-3 z-10">
                    <p className="text-xs text-white font-medium line-clamp-2">{story.caption}</p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] text-[#A1A1AA] font-mono flex items-center gap-1">
                    <Clock size={10} /> 24h Activa
                  </span>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Eliminar historia"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
