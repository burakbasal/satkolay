import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // 1. Update Session (Critical for Supabase)
    // This returns a response with set-cookie headers
    const { response, supabase } = await updateSession(request);

    // 2. Check Auth Status
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // 3. Define Protected Routes (Require Login)
    const protectedPaths = ['/admin', '/profile', '/sell', '/messages', '/favorites'];

    // 4. Define Auth Routes (Redirect if already logged in)
    const authPaths = ['/auth'];

    // LOGIC:
    const isProtected = protectedPaths.some((p) => path.startsWith(p));
    const isAuthPage = authPaths.some((p) => path.startsWith(p));

    // A. Guest trying to access Protected Route -> Login
    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // B. Logged-in User trying to access Login/Register -> Home
    if (isAuthPage && user) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // C. Allow everything else (Homepage, Search, Public Items)
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
         */
        '/((?!_next/static|_next/image|favicon.ico|api|static|robots.txt|sitemap.xml).*)',
    ],
};
