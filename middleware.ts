import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const headers = new Headers(request.headers);

    // 1. GÜVENLİK HEADERLARI (CSP, HSTS, vb.)
    // 'unsafe-eval' ve 'unsafe-inline' Next.js için gereklidir.
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://c.bing.com https://vercel.live https://va.vercel-scripts.com https://xnfuuazgbytejbutffnh.supabase.co;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://xnfuuazgbytejbutffnh.supabase.co https://images.unsplash.com https://*.supabase.co https://*.googleusercontent.com http://googleusercontent.com https://c.clarity.ms;
    font-src 'self' data: https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://xnfuuazgbytejbutffnh.supabase.co https://*.supabase.co wss://xnfuuazgbytejbutffnh.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://c.bing.com https://vercel.live https://va.vercel-scripts.com;
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

    // 3. BAKIM MODU & AYARLAR KONTROLÜ (API route'larına dokunma)
    if (!request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/_next')) {
        // Supabase client oluştur (Middleware için)
        // Not: Middleware'de createServerClient from @supabase/ssr kullanımı biraz farklıdır,
        // ama burada updateSession içinde zaten kullanılıyor. Biz basit bir REST fetch yapabiliriz 
        // veya updateSession'ı çağırdıktan sonra supabase'i kullanabiliriz.
        // Performans için REST API fetch (fetch) kullanalım.

        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

            // Fetch settings
            const settingsRes = await fetch(`${supabaseUrl}/rest/v1/system_settings?select=key,value`, {
                headers: {
                    'ApiKey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                },
                cache: 'no-store' // Always fresh
            });

            if (settingsRes.ok) {
                const settingsData = await settingsRes.json();
                const maintenanceMode = settingsData.find((s: any) => s.key === 'maintenance_mode')?.value;
                const registrationClosed = settingsData.find((s: any) => s.key === 'registration_closed')?.value;

                // A. BAKIM MODU KONTROLÜ
                if (maintenanceMode) {
                    // Check VIP first (only if we have a robust way, or rely on explicit excludes first)
                    // Strategy: 
                    // 1. Exclude public paths (static, system, maintenance page)
                    // 2. Exclude Auth (so admins can login)
                    // 3. If not excluded, THEN check VIP.

                    const isExplicitlyAllowed =
                        request.nextUrl.pathname.startsWith('/_next') ||
                        request.nextUrl.pathname.startsWith('/static') ||
                        request.nextUrl.pathname.startsWith('/api') ||
                        request.nextUrl.pathname.startsWith('/bakimdayiz') ||
                        request.nextUrl.pathname.startsWith('/auth');

                    if (!isExplicitlyAllowed) {
                        let isVip = false;
                        try {
                            const supabase = createServerClient(
                                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                                {
                                    cookies: {
                                        getAll() { return request.cookies.getAll() },
                                        setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)) },
                                    },
                                }
                            );

                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                                // Admin/Moderator Check
                                const { data: profile } = await supabase
                                    .from('profiles')
                                    .select('role')
                                    .eq('id', user.id)
                                    .single();

                                if (profile && (profile.role === 'admin' || profile.role === 'moderator')) {
                                    isVip = true;
                                }
                            }
                        } catch (e) {
                            console.error("Maintenance VIP check error", e);
                        }

                        // If NOT VIP -> Go to Maintenance
                        if (!isVip) {
                            return NextResponse.redirect(new URL('/bakimdayiz', request.url));
                        }
                    }
                } else {
                    // Bakım modu kapalıysa ve kullanıcı manuel olarak /bakimdayiz'a girdiyse -> Anasayfaya at
                    if (request.nextUrl.pathname.startsWith('/bakimdayiz')) {
                        return NextResponse.redirect(new URL('/', request.url));
                    }
                }

                // B. KAYIT KAPALI KONTROLÜ
                if (registrationClosed && request.nextUrl.pathname === '/auth/register') {
                    // Prevent access to register page if closed, redirect to login
                    return NextResponse.redirect(new URL('/auth/login?error=registration_closed', request.url));
                }
            }
        } catch (e) {
            console.error("Middleware settings check failed", e);
        }
    }

    // 4. NORMAL İSTEK (Supabase Auth & Response)
    // Supabase session update işlemini çağırıyoruz
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
