'use client';

import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/navbar').then(mod => mod.Navbar), { ssr: false });
const BottomNav = dynamic(() => import('@/components/bottom-nav').then(mod => mod.BottomNav), { ssr: false });

export function ClientLayout() {
    return (
        <>
            <Navbar />
            <BottomNav />
        </>
    );
}
