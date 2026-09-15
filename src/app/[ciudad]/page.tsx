import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { COUNTRIES } from "@/lib/countries";
import { slugify, cityBaseName, humanizeSlug } from "@/lib/slug";
import ProfileCard from "@/components/ProfileCard";
import ReferralTracker from "@/components/ReferralTracker";
import CityViewTracker from "@/components/CityViewTracker";

// ── Mapa slug → datos de ciudad (construido una vez) ──────────────────────────
interface CityMeta {
  cityLabel: string;
  country: string;
  flag: string;
  region: string;
  isPopular: boolean;
}

const CITY_MAP: Record<string, CityMeta> = (() => {
  const map: Record<string, CityMeta> = {};
  for (const country of COUNTRIES) {
    if (!country.available) continue;
    for (const province of country.provinces) {
      for (const canton of province.cantons) {
        const base = cityBaseName(canton.name);
        const slug = slugify(base);
        if (!slug) continue;
        // Primera ocurrencia gana (evita duplicados entre países)
        if (!map[slug]) {
          map[slug] = {
            cityLabel: base,
            country: country.name,
            flag: country.flag,
            region: province.region || province.name,
            isPopular: Boolean(canton.isPopular),
          };
        }
      }
    }
  }
  return map;
})();

export const revalidate = 3600; // ISR 1h para contenido de ciudad

export function generateStaticParams() {
  return Object.keys(CITY_MAP).map((slug) => ({ ciudad: slug }));
}

export function generateMetadata({ params }: { params: Promise<{ ciudad: string }> }): Promise<Metadata> {
  return params.then(({ ciudad }) => {
    const slug = ciudad.toLowerCase();
    const meta = CITY_MAP[slug];
    const city = meta?.cityLabel || humanizeSlug(slug);
    const country = meta?.country || "Ecuador";
    const title = `Acompañantes VIP en ${city}`;
    const ogTitle = `Acompañantes VIP en ${city} | Cariñosas.top`;
    const description = `Acompañantes VIP 4K verificadas en ${city}, ${country}. Citas discretas, reserva directa por WhatsApp y total privacidad. ${meta?.region ? `Zona: ${meta.region}.` : ""}`;
    const canonical = `https://carinosas.top/${slug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title: ogTitle,
        description,
        url: canonical,
        siteName: "Cariñosas.top",
        locale: "es_EC",
        type: "website",
        images: [
          {
            url: "/og-luxury.png",
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description,
        images: ["/og-luxury.png"],
      },
      other: { "geo.region": country.toUpperCase().slice(0, 2) || "EC" },
    };
  });
}

export default async function CityPage({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params;
  const slug = ciudad.toLowerCase();
  const meta = CITY_MAP[slug];
  const city = meta?.cityLabel || humanizeSlug(slug);
  const country = meta?.country || "Ecuador";

  interface CityModel {
    id: string;
    name: string;
    age: number;
    location: string;
    imageUrl?: string;
    images?: string[];
    is_verified_4k?: boolean;
    plan_type?: string;
    whatsapp?: string;
    sector?: string | null;
  }

  let models: CityModel[] = [];
  try {
    const { data } = await supabase
      .from("models")
      .select("id, name, age, sector, city, images, is_verified_4k, plan_type, whatsapp")
      .ilike("city", `%${city}%`)
      .not("id", "like", "a1000000-0000-0000-0000-0000000000%")
      .limit(24)
      .order("created_at", { ascending: false });

    if (data) {
      models = data.map((m) => ({
        id: m.id,
        name: m.name,
        age: m.age,
        location: m.sector ? `${m.sector}, ${m.city}` : m.city,
        imageUrl: m.images?.[0],
        images: m.images,
        is_verified_4k: m.is_verified_4k,
        plan_type: m.plan_type,
        whatsapp: m.whatsapp,
        sector: m.sector,
      }));
    }
  } catch (err) {
    console.error("CityPage Supabase fetch error:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: `Cariñosas.top — ${city}`,
        description: `Directorio de acompañantes VIP verificadas en ${city}, ${country}.`,
        url: `https://carinosas.top/${slug}`,
        areaServed: { "@type": "City", name: city },
        address: { "@type": "PostalAddress", addressLocality: city, addressCountry: country.toUpperCase().slice(0, 2) },
      },
      {
        "@type": "ItemList",
        name: `Acompañantes en ${city}`,
        itemListElement: models.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://carinosas.top/profile/${m.id}`,
          name: `${m.name}, ${m.age}`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#08080B] text-white pt-20 pb-28 md:pb-0">
      <ReferralTracker />
      <CityViewTracker city={city} slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header de ciudad */}
      <section className="relative px-5 sm:px-6 mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white shrink-0"
              aria-label="Volver al inicio"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold">
              {meta?.flag || "📍"} {country} · {meta?.region || "Directorio"}
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Acompañantes VIP en <span className="text-brand-gold">{city}</span>
          </h1>
          <p className="text-white/55 text-sm max-w-2xl leading-relaxed">
            Perfiles VIP 4K verificados en {city}, {country}. Citas discretas, reserva directa por WhatsApp y total privacidad.
            {models.length > 0 ? ` ${models.length} anuncio${models.length === 1 ? "" : "s"} disponibles ahora.` : ""}
          </p>
        </div>
      </section>

      {/* Grid de perfiles */}
      <section className="px-5 sm:px-6 max-w-7xl mx-auto">
        {models.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {models.map((m) => (
              <ProfileCard key={m.id} {...m} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/[0.08] bg-[#101014] p-10 text-center">
            <p className="font-serif text-2xl font-bold text-white">Aún no hay perfiles en {city}</p>
            <p className="text-white/55 mt-2 text-sm max-w-md mx-auto">
              Estamos sembrando {city}. Si trabajas en la zona, sé de las primeras en publicar con
              perfil destacado y sello 4K verificado.
            </p>
            <Link
              href="/publicar-anuncio"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-brand-gold text-brand-black font-bold text-sm"
            >
              Publicar mi perfil en {city}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* CTA de marca */}
      <section className="px-5 sm:px-6 mt-10 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-brand-gold/30 bg-brand-gold/[0.05] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-xl font-bold text-white">¿Trabajas en {city}?</p>
            <p className="text-white/55 text-sm mt-1">Publica gratis y recibe contactos directos por WhatsApp.</p>
          </div>
          <Link
            href="/publicar-anuncio"
            className="shrink-0 px-6 py-3 rounded-2xl bg-brand-gold text-brand-black font-bold text-sm"
          >
            Publicar anuncio
          </Link>
        </div>
      </section>
    </main>
  );
}
