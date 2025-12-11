import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SatKolay - İkinci Elin Yeni Adresi',
        short_name: 'SatKolay',
        description: 'Türkiye\'nin en hızlı büyüyen ikinci el pazar yeri.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#001e93',
        icons: [
            {
                src: '/icon',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/icon?size=192',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon?size=512',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
