import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carinosas.top';
  const lastModified = new Date();

  // Top SEO Landing Paths for Search Engine Authority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/#catalogo`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/#vip-club`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const { data: models } = await supabase
      .from('models')
      .select('id, updated_at')
      .limit(200);

    if (models && models.length > 0) {
      const modelRoutes: MetadataRoute.Sitemap = models.map((m) => ({
        url: `${baseUrl}/profile/${m.id}`,
        lastModified: m.updated_at ? new Date(m.updated_at) : lastModified,
        changeFrequency: 'daily',
        priority: 0.9,
      }));
      return [...staticRoutes, ...modelRoutes];
    }
  } catch (err) {
    console.warn("Sitemap dynamic fetch notice:", err);
  }

  return staticRoutes;
}
