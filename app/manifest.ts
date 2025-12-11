import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SatKolay',
        short_name: 'SatKolay',
        description: 'İkinci El Pazar Yeri',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#001e93',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
