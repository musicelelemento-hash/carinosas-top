import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { COUNTRIES } from '@/lib/countries';
import { slugify, cityBaseName } from '@/lib/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carinosas.top';
  const lastModified = new Date();

  // 1. Core Top Authority Landing Pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/radar`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/boveda-secreta`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/concierge`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publicar-anuncio`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // 2. City & Province International Landing Pages for Local SEO
  // P0 SEO: URLs limpias (/quito, /machala) en lugar de ?country=X&city=Y
  // (los query params generaban contenido duplicado y no eran páginas SEO reales).
  const seenCitySlugs = new Set<string>();
  const cityRoutes: MetadataRoute.Sitemap = [];
  for (const country of COUNTRIES) {
    if (!country.available) continue;
    for (const province of country.provinces) {
      for (const canton of province.cantons) {
        const slug = slugify(cityBaseName(canton.name));
        if (!slug || seenCitySlugs.has(slug)) continue;
        seenCitySlugs.add(slug);
        cityRoutes.push({
          url: `${baseUrl}/${slug}`,
          lastModified,
          changeFrequency: 'daily',
          priority: canton.isPopular ? 0.9 : 0.7,
        });
      }
    }
  }

  // 3. Dynamic Model Profiles
  let modelRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: models } = await supabase
      .from('models')
      .select('id, updated_at')
      .not('id', 'like', 'a1000000-0000-0000-0000-0000000000%')
      .limit(500);

    if (models && models.length > 0) {
      modelRoutes = models.map((m) => ({
        url: `${baseUrl}/profile/${m.id}`,
        lastModified: m.updated_at ? new Date(m.updated_at) : lastModified,
        changeFrequency: 'daily',
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.warn("Sitemap dynamic fetch notice:", err);
  }

  return [...coreRoutes, ...cityRoutes, ...modelRoutes];
}
