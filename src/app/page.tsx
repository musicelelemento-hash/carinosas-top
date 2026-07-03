import React from "react";
import HomePageClient from "@/components/HomePageClient";
import { supabase } from "@/lib/supabase";

// Opt out of client caching for dynamic catalogs so updates are shown immediately
export const revalidate = 0;

const STATIC_MODELS = [
  { id: '1', name: 'Valentina', age: 21, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200'], isBoosted: true, is_verified_4k: true, plan_type: 'VIP Elite' },
  { id: '2', name: 'Camila', age: 23, location: 'Guayaquil', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200'], is_verified_4k: true, plan_type: 'Diamante' },
  { id: '3', name: 'Luciana', age: 22, location: 'Cuenca', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200'], plan_type: 'Premium' },
  { id: '4', name: 'Alessandra', age: 25, location: 'Manta', imageUrl: 'https://images.unsplash.com/photo-1503105391650-704fd6827a88?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1503105391650-704fd6827a88?auto=format&fit=crop&q=80&w=1200'], isBoosted: true, plan_type: 'VIP Elite' },
  { id: '5', name: 'Isabella', age: 24, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200'], plan_type: 'Anuncio Gratis' },
  { id: '6', name: 'Antonella', age: 26, location: 'Guayaquil', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200'], plan_type: 'Premium' },
];

export default async function Home() {
  let allModels = [...STATIC_MODELS];

  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      const mappedLiveModels = data.map((m: any) => ({
        id: m.id,
        name: m.name,
        age: m.age,
        location: m.sector ? `${m.sector}, ${m.city}` : m.city,
        images: m.images && m.images.length > 0 ? m.images : [STATIC_MODELS[0].imageUrl],
        imageUrl: m.images && m.images[0] ? m.images[0] : STATIC_MODELS[0].imageUrl,
        isBoosted: m.is_boosted || m.plan_type === 'Diamante' || m.plan_type === 'VIP Elite',
        is_verified_4k: m.is_verified_4k,
        description: m.description,
        whatsapp: m.whatsapp,
        sector: m.sector,
        tags: m.tags,
        plan_type: m.plan_type,
        personal_note: m.personal_note || "Cada encuentro es una historia que merece ser contada con elegancia."
      }));
      
      allModels = [...mappedLiveModels, ...STATIC_MODELS];
    }
  } catch (err) {
    console.error("Server-side Supabase model fetch error:", err);
  }

  // Priority and sorting logic
  const PLAN_PRIORITY: Record<string, number> = {
    'VIP Elite': 0,
    'Diamante': 0,
    'Oro': 1,
    'Premium': 2,
    'Plata': 2,
    'Anuncio Gratis': 3,
    'Gratis': 3,
    'Básico': 3
  };
  
  allModels.sort((a, b) => {
    const pA = PLAN_PRIORITY[a.plan_type as string] ?? 99;
    const pB = PLAN_PRIORITY[b.plan_type as string] ?? 99;
    
    if (pA !== pB) return pA - pB;
    
    const bA = (a.isBoosted || a.plan_type === 'Diamante' || a.plan_type === 'VIP Elite') ? 0 : 1;
    const bB = (b.isBoosted || b.plan_type === 'Diamante' || b.plan_type === 'VIP Elite') ? 0 : 1;
    
    return bA - bB;
  });

  return <HomePageClient initialModels={allModels} />;
}
