import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/movies/', '/tv/', '/cast/'],
        disallow: ['/api/', '/admin/', '/login/', '/activity/', '/watched/', '/account/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://reeltime.app/sitemap.xml',
  };
}
