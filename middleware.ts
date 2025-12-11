import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const headers = new Headers(request.headers);

    // 1. GÜVENLİK HEADERLARI (CSP, HSTS, vb.)
    // 'unsafe-eval' ve 'unsafe-inline' Next.js için gereklidir.
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://c.bing.com https://vercel.live https://va.vercel-scripts.com https://xnfuuazgbytejbutffnh.supabase.co;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://xnfuuazgbytejbutffnh.supabase.co https://images.unsplash.com https://*.supabase.co;
    font-src 'self' data: https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://xnfuuazgbytejbutffnh.supabase.co https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://c.bing.com https://vercel.live https://va.vercel-scripts.com;
    block-all-mixed-content;
    upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim(); // Boşlukları temizle

    const securityHeaders = {
        'Content-Security-Policy': cspHeader,
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-DNS-Prefetch-Control': 'on',
    };

    // 2. YÖNLENDİRME MANTIĞI (Redirect)
    // Eski vercel linkinden veya farklı domainden geliyorsa ana domaine at.
    if (hostname && !hostname.includes('localhost') && hostname !== 'satkolay.com' && hostname !== 'www.satkolay.com') {
        const url = new URL(request.url);
        url.hostname = 'satkolay.com'; // Veya www.satkolay.com (tercihe göre)
        url.protocol = 'https';
        url.port = '';

        // Redirect cevabını oluştur
        const response = NextResponse.redirect(url);

        // KRİTİK ADIM: Redirect cevabına da güvenlik headerlarını ekle!
        Object.entries(securityHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    }

    // 3. NORMAL İSTEK (Supabase Auth & Response)
    // Supabase session update işlemini çağırıyoruz
    // updateSession normalde kendi response'unu döner, biz onu alıp header ekleyeceğiz.
    let response = await updateSession(request);

    // Eğer updateSession bir response dönmezse (nadiren), standart next() response oluştur.
    if (!response) {
        response = NextResponse.next({
            request: {
                headers: headers,
            },
        });
    }

    // Normal cevaba da güvenlik headerlarını ekle
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: [
        /*
         * Şu yollar HARİÇ tüm istekleri yakala:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - sitemap.xml (SEO file)
         * - robots.txt (SEO file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
