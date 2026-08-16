import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { COUNTRIES } from '@/lib/countries';

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
  const cityRoutes: MetadataRoute.Sitemap = COUNTRIES.flatMap((country) =>
    country.provinces.flatMap((province) =>
      province.cantons.map((canton) => ({
        url: `${baseUrl}/?country=${country.id}&city=${encodeURIComponent(canton.name)}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: canton.isPopular ? 0.9 : 0.8,
      }))
    )
  );

  // 3. Dynamic Model Profiles
  let modelRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: models } = await supabase
      .from('models')
      .select('id, updated_at')
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
