import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/profile/', '/search', '/login', '/register', '/sell', '/api/', '/_next/'],
        },
        sitemap: 'https://www.satkolay.com/sitemap.xml',
    }
}
