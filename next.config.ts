import type { NextConfig } from "next";

// GÜVENLİK POLİTİKASI (CSP)
// Not: 'unsafe-inline' ve 'unsafe-eval' Next.js'in düzgün çalışması için (özellikle dev modda) genelde gereklidir.
// Prodüksiyonda daha sıkı hale getirilebilir ama şimdilik sitenin patlamaması için bu ayar en dengelisidir.
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://c.bing.com https://vercel.live https://va.vercel-scripts.com;
    connect-src 'self' https://xnfuuazgbytejbutffnh.supabase.co https://www.google-analytics.com https://www.clarity.ms https://c.bing.com https://vercel.live;
    img-src 'self' blob: data: https://xnfuuazgbytejbutffnh.supabase.co https://images.unsplash.com;
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  // 1. GİZLİLİK: "X-Powered-By: Next.js" başlığını kaldır (Scannerlar framework'ü tanıyamasın)
  poweredByHeader: false,

  /* Hata olsa bile build almayı zorla */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 2. HTTP GÜVENLİK BAŞLIKLARI
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Clickjacking koruması (Site iframe içine alınamaz)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // MIME sniffing engeli
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Gizlilik koruması
          },
          {
            key: 'Permissions-Policy', // Gereksiz donanım erişimlerini kapat
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security', // HTTPS Zorunluluğu (2 yıl)
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Cross-Origin İzolasyonu
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless', // Resimlerin yüklenmesini engellememesi için 'require-corp' yerine 'credentialless' daha güvenlidir.
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
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