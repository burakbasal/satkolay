import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
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

    const isProtected = protectedPaths.some((p) => path.startsWith(p));
    const isAuthPage = authPaths.some((p) => path.startsWith(p));

    // A. Guest -> Protected Route ? Redirect to Login
    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
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
