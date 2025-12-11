import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Sadece admin paneli vs. gizlenmeli
        },
        sitemap: 'https://satkolay.com/sitemap.xml',
    };
}
