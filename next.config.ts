import type { NextConfig } from "next";

const nextConfig: any = {
  // 1. Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xnfuuazgbytejbutffnh.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow generic externals if strict whitelist is too restrictive (User requested **)
      }
    ],
  },

  // 2. Hide Server Info
  poweredByHeader: false,

  // 3. Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()'
          },
          {
            key: 'Content-Security-Policy',
            // Note: 'unsafe-inline' and 'unsafe-eval' for scripts allows Next.js functionalitity and 3rd party scripts.
            // In a stricter environment, we would use nonces or hashes.
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms https://*.google.com https://www.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https: http: https://xnfuuazgbytejbutffnh.supabase.co; font-src 'self' data:; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://www.clarity.ms https://xnfuuazgbytejbutffnh.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
              .replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;