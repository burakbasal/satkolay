import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SatKolay - İkinci Elin Yeni Adresi',
        short_name: 'SatKolay',
        description: 'Türkiye\'nin en güvenli ikinci el pazar yeri.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#001e93',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    }
}
