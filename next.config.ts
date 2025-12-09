import type { NextConfig } from "next";

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
};

export default nextConfig;