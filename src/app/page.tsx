import React from "react";
import HomePageClient from "@/components/HomePageClient";
import { supabase } from "@/lib/supabase";

interface DbModel {
  id: string;
  name: string;
  age: number;
  sector: string | null;
  city: string;
  images: string[] | null;
  is_boosted: boolean;
  plan_type: string;
  is_verified_4k: boolean;
  description: string | null;
  whatsapp: string;
  tags: string[] | null;
  personal_note: string | null;
}

// Opt out of client caching for dynamic catalogs so updates are shown immediately
export const revalidate = 0;

export default async function Home() {
  interface DisplayModel {
    id: string;
    name: string;
    age: number;
    location: string;
    images: string[];
    imageUrl: string;
    isBoosted: boolean;
    is_verified_4k: boolean;
    description: string | null;
    whatsapp: string;
    sector: string | null;
    tags: string[] | null;
    plan_type: string;
    personal_note: string;
  }

  let allModels: DisplayModel[] = [];

  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      const fallbackImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
      
      const mappedLiveModels: DisplayModel[] = (data as unknown as DbModel[]).map((m: DbModel) => ({
        id: m.id,
        name: m.name,
        age: m.age,
        location: m.sector ? `${m.sector}, ${m.city}` : m.city,
        images: m.images && m.images.length > 0 ? m.images : [fallbackImage],
        imageUrl: m.images && m.images[0] ? m.images[0] : fallbackImage,
        isBoosted: m.is_boosted || m.plan_type === 'Diamante' || m.plan_type === 'VIP Elite',
        is_verified_4k: m.is_verified_4k,
        description: m.description,
        whatsapp: m.whatsapp,
        sector: m.sector,
        tags: m.tags,
        plan_type: m.plan_type,
        personal_note: m.personal_note || "Cada encuentro es una historia que merece ser contada con elegancia."
      }));
      
      allModels = mappedLiveModels;
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
