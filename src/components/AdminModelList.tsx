"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Trash2, 
  MapPin, 
  Crown, 
  Trash, 
  ExternalLink,
  MessageCircle,
  Clock,
  Search,
  ChevronRight
} from "lucide-react";

export default function AdminModelList() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchModels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const PLAN_PRIORITY: Record<string, number> = {
        'VIP Elite': 0,
        'Diamante': 1,
        'Premium': 2,
        'Básico': 3
      };
      const sorted = [...data].sort((a, b) => {
        const pA = PLAN_PRIORITY[a.plan_type] ?? 99;
        const pB = PLAN_PRIORITY[b.plan_type] ?? 99;
        return pA - pB;
      });
      setModels(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    
    const { error } = await supabase.from('models').delete().eq('id', id);
    if (!error) {
      setModels(prev => prev.filter(m => m.id !== id));
    } else {
      alert("Error al eliminar.");
    }
  };

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
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

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-gold/10 border-t-brand-gold rounded-full animate-spin" />
          <span className="text-[10px] text-brand-white/20 uppercase tracking-widest">Sincronizando Base de Datos...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredModels.map((model) => (
            <div key={model.id} className="glass-dark border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-gold/30 transition-all">
              {/* Photo Preview */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                <img 
                  src={model.images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Main Info */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h3 className="text-xl font-serif text-brand-white">{model.name}</h3>
                  <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    model.plan_type === 'Diamante' || model.plan_type === 'VIP Elite'
                    ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                    : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {model.plan_type === 'Diamante' || model.plan_type === 'VIP Elite' ? <Crown size={10} /> : null}
                    {model.plan_type || 'Básico'}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] text-brand-white/30 uppercase tracking-widest font-black">
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-brand-gold" /> {model.city} {model.sector && `- ${model.sector}`}</span>
                  <span className="flex items-center gap-1.5 text-brand-pink/60"><MessageCircle size={12} /> {model.whatsapp}</span>
                  <span className="flex items-center gap-1.5 opacity-50"><Clock size={12} /> {new Date(model.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <a 
                  href={`/profile/${model.id}`} 
                  target="_blank"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-brand-gold hover:border-brand-gold transition-all"
                  title="Ver perfil público"
                >
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => handleDelete(model.id)}
                  className="p-3 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink/60 hover:bg-brand-pink hover:text-white transition-all shadow-lg shadow-brand-pink/10"
                  title="Eliminar publicación"
                >
                  <Trash2 size={18} />
                </button>
                <div className="ml-2 h-10 w-[1px] bg-white/5 hidden md:block" />
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all">
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
    </div>
  );
}
