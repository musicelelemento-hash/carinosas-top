"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ModelProfile from "@/components/ModelProfile";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DynamicProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchModel() {
      try {
        setLoading(true);
        // 1. Check Supabase
        const { data, error: sbError } = await supabase
          .from("models")
          .select("*")
          .eq("id", id)
          .single();

        if (data && !sbError) {
          setModel(data);
          return;
        }

        // 2. Mock fallback (for testing or specific static IDs)
        if (id === "valentina") {
           setModel({
             id: "valentina",
             name: "Valentina",
             age: 23,
             location: "Quito",
             sector: "Cumbayá",
             description: "Modelo exclusiva con un aura de misterio y elegancia natural. Valentina personifica la sofisticación de Quito, ofreciendo una compañía que trasciende lo convencional para convertirse en una experiencia de alto diseño.",
             images: [
               "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200",
               "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200"
             ],
             plan_type: "VIP Elite",
             isVerified: true,
             tags: ["#Elite", "#Luxury", "#QuitoNight"],
             whatsapp: "593900000000",
             city: "Quito"
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4">
         <Loader2 size={48} className="text-brand-gold animate-spin" />
         <p className="text-[10px] text-brand-gold/40 uppercase font-black tracking-[0.5em]">Sincronizando Perfil VIP...</p>
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
            <p className="text-brand-white/40 text-sm max-w-sm mx-auto">Lo sentimos, esta modelo no se encuentra activa en el catálogo en este momento o el link ha expirado.</p>
         </div>
         <Link href="/" className="px-8 py-4 glass-premium border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-all">
            Volver al Inicio
         </Link>
      </div>
    );
  }

  return <ModelProfile model={model} />;
}
