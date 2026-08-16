import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carinosas.top';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/panel-modelo',
          '/auth/callback',
          '/*?*preview=*',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'YandexBot',
          'DuckDuckBot',
          'Baiduspider',
          'Twitterbot',
          'facebookexternalhit',
          'WhatsApp',
          'TelegramBot',
        ],
        allow: '/',
        disallow: ['/admin', '/api/', '/panel-modelo'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
