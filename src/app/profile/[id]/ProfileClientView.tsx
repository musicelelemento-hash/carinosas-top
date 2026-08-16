"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ModelProfile from "@/components/ModelProfile";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export interface ProfileModel {
  id: string;
  name: string;
  age: number;
  location: string;
  description: string;
  images: string[];
  services?: string[];
  isVerified?: boolean;
  plan_type?: string;
  tags?: string[];
  sector?: string;
  whatsapp?: string;
  city?: string;
  is_verified_4k?: boolean;
  is_online?: boolean;
}

interface ProfileClientViewProps {
  id: string;
  initialModel?: ProfileModel | null;
}

export default function ProfileClientView({ id, initialModel }: ProfileClientViewProps) {
  const [model, setModel] = useState<ProfileModel | null>(initialModel || null);
  const [loading, setLoading] = useState(!initialModel);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialModel) {
      setModel(initialModel);
      setLoading(false);
      return;
    }

    async function fetchModel() {
      try {
        setLoading(true);
        const { data, error: sbError } = await supabase
          .from("models")
          .select("id, name, age, city, sector, description, images, tags, plan_type, whatsapp, is_verified_4k, is_online")
          .eq("id", id)
          .single();

        if (data && !sbError) {
          setModel({
            id: data.id,
            name: data.name,
            age: data.age,
            location: data.sector ? `${data.sector}, ${data.city}` : data.city,
            description: data.description || "",
            images: data.images?.length ? data.images : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"],
            tags: data.tags || [],
            plan_type: data.plan_type,
            whatsapp: data.whatsapp,
            isVerified: data.is_verified_4k,
            is_verified_4k: data.is_verified_4k,
            is_online: data.is_online,
            city: data.city,
            sector: data.sector || undefined,
          });
          return;
        }

        setError(true);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchModel();
  }, [id, initialModel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="text-brand-gold animate-spin" />
        <p className="text-[10px] text-brand-gold/40 uppercase font-black tracking-[0.5em]">
          Sincronizando Perfil VIP 4K...
        </p>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-white italic">Perfil No Disponible</h2>
          <p className="text-brand-white/40 text-sm max-w-sm mx-auto">
            Lo sentimos, esta modelo no se encuentra activa en el catálogo en este momento o el link ha expirado.
          </p>
        </div>
        <Link 
          href="/" 
          className="px-8 py-4 glass-premium border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-all"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return <ModelProfile model={model} />;
}
