import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host');

    // 1. Domain Redirect Logic
    // Localhost'a dokunma
    const isLocalhost = hostname && hostname.includes('localhost');

    // Eğer localhost değilse ve "satkolay.com" değilse yönlendir
    if (hostname && !isLocalhost && hostname !== 'satkolay.com' && hostname !== 'www.satkolay.com') {
        const url = new URL(request.url);
        url.hostname = 'satkolay.com';
        url.protocol = 'https';
        url.port = ''; // Portu temizle
        return NextResponse.redirect(url);
    }

    // 2. Supabase Auth Logic (Mevcut)
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
