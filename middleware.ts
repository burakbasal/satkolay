import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // 0. DOMAIN REDIRECTION (VERCEL -> CUSTOM)
    const hostname = request.nextUrl.hostname;
    if (hostname.includes('vercel.app')) {
        const newUrl = new URL(request.nextUrl.pathname, 'https://www.satkolay.com');
        newUrl.search = request.nextUrl.search;
        return NextResponse.redirect(newUrl, 301);
    }

    // 1. UPDATE SESSION (Supabase Magic)
    // We use the response from updateSession as the base
    const response = await updateSession(request);

    // 2. CHECK AUTH FOR PROTECTED ROUTES
    // We need a lightweight check. Since updateSession already refreshed cookies,
    // we can create a client just to check the user status for redirection logic.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll() { /* No need to set here, updateSession did it */ },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const path = request.nextUrl.pathname;

    // 3. DEFINE ZONES
    const protectedPaths = ['/admin', '/profile', '/sell', '/messages', '/favorites'];
    const authPaths = ['/auth'];

    // 4. MAINTENANCE MODE CHECK (CRITICAL SECURITY)
    try {
        const { data: settings } = await supabase
            .from('platform_settings')
            .select('is_maintenance_mode')
            .eq('id', 1)
            .single();

        if (settings?.is_maintenance_mode) {
            // Exceptions: 
            // 1. Admin/Login paths
            // 2. Static assets (handled by config matcher mostly, but double check)
            // 3. The maintenance page itself (prevent loop)
            const isAllowedPath =
                path.startsWith('/admin') ||
                path.startsWith('/login') ||
                path.startsWith('/auth') ||
                path === '/maintenance';

            // Check if user is admin (Strict Check)
            let isAdmin = false;
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                isAdmin = profile?.role === 'admin' || profile?.role === 'moderator';
            }

            // Redirect logic
            if (!isAllowedPath && !isAdmin) {
                // If not on maintenance page, send them there
                if (path !== '/maintenance') {
                    return NextResponse.redirect(new URL('/maintenance', request.url));
                }
            }
        }
    } catch (e) {
        // Fail open or closed? Fail open (allow access) on db error to prevent lockouts during outages? 
        // Or fail closed. Let's stick to fail open for now to avoid breaking the site if settings table is missing.
        console.error("Middleware Settings Check Error:", e);
    }


    const isProtected = protectedPaths.some((p) => path.startsWith(p));
    const isAuthPage = authPaths.some((p) => path.startsWith(p));

    // A. Guest -> Protected Route ? Redirect to Login
    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // B. User -> Login Page ? Redirect to Home
    if (isAuthPage && user) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // C. Return the Supabase-synced response
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes)
         * - static (public images)
         * - robots.txt
         * - sitemap.xml
         * - manifest.webmanifest
         */
        '/((?!_next/static|_next/image|favicon.ico|api|static|robots.txt|sitemap.xml|manifest.webmanifest).*)',
    ],
};
