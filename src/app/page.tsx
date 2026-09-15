import React from "react";
import HomePageClient from "@/components/HomePageClient";
import ReferralTracker from "@/components/ReferralTracker";
import { supabase } from "@/lib/supabase";
import { rankModels } from "@/lib/ranking";

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
  is_online?: boolean;
  country_code?: string;
  created_at?: string;
  voice_greeting_url?: string;
  description: string | null;
  whatsapp: string;
  tags: string[] | null;
  personal_note: string | null;
}

// Opt out of client caching for dynamic catalogs so updates are shown immediately
export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams?: Promise<{ city?: string }> }) {
  interface DisplayModel {
    id: string;
    name: string;
    age: number;
    location: string;
    city: string;
    images: string[];
    imageUrl: string;
    isBoosted: boolean;
    is_verified_4k: boolean;
    is_online: boolean;
    country_code?: string;
    created_at?: string;
    voice_greeting_url?: string;
    description: string | null;
    whatsapp: string;
    sector: string | null;
    tags: string[] | null;
    plan_type: string;
    personal_note: string;
  }

  let allModels: DisplayModel[] = [];

  try {
    let rawModels: Record<string, unknown>[] | null = null;

    const primaryQuery = await supabase
      .from('models')
      .select('id, name, age, sector, city, images, is_boosted, plan_type, is_verified_4k, is_online, country_code, created_at, voice_greeting_url, description, whatsapp, tags, personal_note')
      .order('created_at', { ascending: false });

    if (!primaryQuery.error && primaryQuery.data) {
      rawModels = primaryQuery.data as unknown as Record<string, unknown>[];
    } else {
      // Fallback if some columns are not yet present in Supabase
      const fallbackQuery = await supabase
        .from('models')
        .select('id, name, age, sector, city, images, is_boosted, plan_type, is_verified_4k, is_online, description, whatsapp, tags')
        .order('created_at', { ascending: false });
      
      if (fallbackQuery.data) {
        rawModels = fallbackQuery.data as unknown as Record<string, unknown>[];
      }
    }

    if (rawModels && rawModels.length > 0) {
      const fallbackImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
      
      const mappedLiveModels: DisplayModel[] = (rawModels as unknown as DbModel[]).map((m: DbModel) => ({
        id: m.id,
        name: m.name,
        age: m.age,
        location: m.sector ? `${m.sector}, ${m.city}` : m.city,
        city: m.city,
        images: m.images && m.images.length > 0 ? m.images : [fallbackImage],
        imageUrl: m.images && m.images[0] ? m.images[0] : fallbackImage,
        isBoosted: m.is_boosted || m.plan_type === 'Diamante' || m.plan_type === 'VIP Elite',
        is_verified_4k: m.is_verified_4k,
        is_online: Boolean(m.is_online),
        country_code: m.country_code || 'EC',
        created_at: m.created_at,
        voice_greeting_url: m.voice_greeting_url,
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

  // Recomendación inteligente del feed (Hook loop / recompensa variable).
  // Se priorizan verificadas 4K + en línea + destacadas, con coincidencia de
  // ciudad del usuario y una mezcla determinista para que el feed no sea
  // aburrido (patrón TikTok). No fabrica datos: reordena los reales.
  const cityParam = (await searchParams)?.city;
  const ranked = rankModels(allModels, cityParam);

  return (
    <>
      <ReferralTracker />
      <HomePageClient initialModels={ranked} />
    </>
  );
}
