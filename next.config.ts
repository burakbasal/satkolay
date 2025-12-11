import type { NextConfig } from "next";

// CSP Politikasını tanımla (Okunabilirlik için ayrı string)
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://source.unsplash.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  /* Hata olsa bile build almayı zorla */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* Resim optimizasyonu için Supabase'e izin ver */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Güvenlik Headerları
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 1. CSP (XSS ve Script Koruması)
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          // 2. Clickjacking Koruması
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 3. MIME Sniffing Engelleme
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 4. Referrer Bilgisi Koruması
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 5. Donanım İzinleri Kısıtlaması (Kamera, Mikrofon vb.)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          // 6. HSTS (Zorunlu HTTPS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // 7. Opsiyonel: Cross-Origin Politikaları
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // Auth işlemleri için allow-popups önerilir
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          }
        ],
      },
    ];
  },
};

export default nextConfig;