'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, MapPin, Camera, Bell, MessageCircle, LayoutGrid, ChevronDown, ChevronRight, X, User, Heart, Menu } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, Suspense } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MASTER_DATA } from '@/lib/master-data';
import { LocationPicker } from '@/components/header/location-picker';
import { PwaInstallButton } from '@/components/pwa-install-button';

// --- MASAÜSTÜ ARAMA ---
function DesktopSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    useEffect(() => { setQuery(searchParams.get('query') || ""); }, [searchParams]);
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`); };

    return (
        <form onSubmit={handleSearch} className="flex-1 relative max-w-3xl mx-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-600" /></div>
                <input type="text" className="block w-full pl-11 pr-10 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-1 focus:ring-[#001e93] outline-none transition-all placeholder:text-gray-600 text-base h-11" placeholder="Ürün, marka, kategori ara..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button aria-label="Aramayı Temizle" type="button" onClick={() => { setQuery(""); router.push('/search'); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"><X className="h-5 w-5" /></button>
            </div>
        </form>
    );
}

// --- MOBİL ARAMA (GÜNCELLENDİ: X BUTONU EKLENDİ) ---
function MobileSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");

    // URL'den gelen aramayı mobilde de göster
    useEffect(() => {
        setQuery(searchParams.get('query') || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`);
    };

    const clearSearch = () => {
        setQuery("");
        router.push('/search'); // Aramayı temizle
    };

    return (
        <form onSubmit={handleSearch} className="flex-1 min-w-0 mx-2">
            <div className="relative flex items-center h-11"> {/* Yükseklik h-11 yapıldı */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-600" />
                </div>
                <input
                    type="text"
                    className="w-full h-full bg-gray-100 rounded-full pl-10 pr-9 text-base focus:bg-white focus:ring-1 focus:ring-[#001e93] outline-none transition-all placeholder:text-gray-600"
                    placeholder="Ara..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {/* MOBİL X BUTONU */}
                {query && (
                    <button
                        type="button"
                        aria-label="Aramayı Temizle"
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 active:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </form>
    )
}

// --- NAVBAR ---
export function Navbar() {
    const pathname = usePathname();

    // Admin panelinde Navbar'ı gizle
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const [user, setUser] = useState<any>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(MASTER_DATA[0]?.id || null);
    const [isMounted, setIsMounted] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // İlk yüklemede kullanıcıyı çek
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

        // Değişiklikleri dinle (Giriş/Çıkış anında tetiklenir)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                router.refresh(); // Sunucu bileşenlerini de tazelemek için
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => { await supabase.auth.signOut(); router.refresh(); setUser(null); };
    const activeCategoryData = MASTER_DATA.find(c => c.id === activeCategory) || MASTER_DATA[0];

    return (
        <header className="bg-white font-sans">

            {/* --- MOBİL HEADER (HİZALAMA FIX) --- */}
            <div className="flex md:hidden items-center justify-between px-3 h-16 border-b bg-white sticky top-0 z-50 w-full">

                {/* 0. HAMBURGER MENU (Sadece Desktop'ta göster, Mobilde GİZLE: hidden md:flex) */}
                {isMounted && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2 shrink-0 hidden md:flex" aria-label="Menüyü Aç">
                                <Menu className="w-6 h-6 text-gray-700" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 bg-white">
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b">
                                    <span className="text-3xl font-black text-[#001e93]">SatKolay</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="py-4">
                                        <h3 className="font-bold text-gray-900 mb-3 px-2">Kategoriler</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/search?q=Araba" className="p-2 text-sm bg-gray-50 rounded hover:bg-blue-50 hover:text-[#001e93] transition">🚗 Araba</Link>
                                            <Link href="/search?q=Telefon" className="p-2 text-sm bg-gray-50 rounded hover:bg-blue-50 hover:text-[#001e93] transition">📱 Telefon</Link>
                                            <Link href="/search?q=Elektronik" className="p-2 text-sm bg-gray-50 rounded hover:bg-blue-50 hover:text-[#001e93] transition">💻 Elektronik</Link>
                                            <Link href="/search?q=Ev" className="p-2 text-sm bg-gray-50 rounded hover:bg-blue-50 hover:text-[#001e93] transition">🏠 Ev & Yaşam</Link>
                                            <Link href="/search?q=Motosiklet" className="p-2 text-sm bg-gray-50 rounded hover:bg-blue-50 hover:text-[#001e93] transition">🏍️ Motosiklet</Link>
                                            <Link href="/search?q=Giyim" className="p-2 text-sm bg-gray-50 rounded hover:bg-blue-50 hover:text-[#001e93] transition">👕 Giyim</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
                {!isMounted && (
                    <Button variant="ghost" size="icon" className="mr-2 shrink-0 hidden md:flex" aria-label="Menüyü Aç">
                        <Menu className="w-6 h-6 text-gray-700" />
                    </Button>
                )}

                {/* 1. LOGO: Flex center ile dikey ortalandı (Daha BÜYÜK) */}
                <Link href="/" className="flex items-center h-11 shrink-0">
                    <span className="text-2xl font-black text-[#001e93] tracking-tighter leading-none">SatKolay</span>
                </Link>

                {/* 2. ARAMA: Suspense içine alındı */}
                <Suspense fallback={<div className="flex-1 h-11 bg-gray-100 rounded-full mx-2" />}>
                    <MobileSearchBar />
                </Suspense>

                <div className="shrink-0 mr-1">
                    <LocationPicker />
                </div>
                {/* 3. BİLDİRİM: h-11 ile diğerleriyle aynı yüksekliğe getirildi */}
                <Link href="/notifications" className="flex items-center justify-center h-11 w-11 text-gray-600 shrink-0 relative hover:bg-gray-50 rounded-full" aria-label="Bildirimler">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Link>
            </div>

            {/* --- MASAÜSTÜ HEADER (Aynen Korundu) --- */}
            <div className="hidden md:block w-full">
                <div className="h-16 flex items-center justify-between">
                    <Link href="/" className="text-3xl font-black text-[#001e93] tracking-tighter shrink-0">SatKolay</Link>
                    <Suspense fallback={<div className="h-11 bg-gray-100 rounded-full flex-1 mx-6"></div>}><DesktopSearchBar /></Suspense>
                    <div className="flex items-center gap-3 shrink-0">
                        <LocationPicker />
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile/favorites" className="p-2 hover:bg-gray-100 rounded-full text-gray-600" aria-label="Favorilerim"><Heart className="w-6 h-6" /></Link>
                                <Link href="/chat" className="p-2 hover:bg-gray-100 rounded-full text-gray-600" aria-label="Mesajlar"><MessageCircle className="w-6 h-6" /></Link>
                                <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-full text-gray-600" aria-label="Bildirimler"><Bell className="w-6 h-6" /></Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="relative h-11 w-11 rounded-full ml-1" aria-label="Kullanıcı Menüsü"><Avatar className="h-10 w-10 border"><AvatarImage src={user.user_metadata?.avatar_url} /><AvatarFallback><User className="w-5 h-5" /></AvatarFallback></Avatar></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64" align="end">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'Kullanıcı'}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild><Link href="/profile" className="cursor-pointer w-full text-base">Profilim</Link></DropdownMenuItem>
                                        <DropdownMenuItem asChild><Link href="/profile/listings" className="cursor-pointer w-full text-base">İlanlarım</Link></DropdownMenuItem>
                                        <DropdownMenuItem asChild><Link href="/profile/favorites" className="cursor-pointer w-full text-base">Favorilerim</Link></DropdownMenuItem>
                                        <DropdownMenuItem asChild><Link href="/profile/settings" className="cursor-pointer w-full font-medium text-base">Ayarlar</Link></DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer w-full focus:text-red-600 focus:bg-red-50 text-base">Çıkış Yap</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <PwaInstallButton />
                                <Link href="/sell" className="ml-2 flex items-center gap-2 bg-[#001e93] text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#001e93]/90 transition-all shadow-sm text-sm h-11"><Camera className="w-5 h-5" /> <span>SAT</span></Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="font-bold text-gray-700 hover:text-[#001e93] px-3 text-base">Giriş</Link>
                                <Link href="/sell" className="flex items-center gap-2 bg-[#001e93] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#001e93]/90 transition-all shadow-md h-11 text-sm"><Camera className="w-5 h-5" /> <span>Sat</span></Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mega Menü */}
                <div className="h-14 flex items-center gap-6 border-t py-2 relative">
                    <div className="group h-full flex items-center">
                        <button className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 group-hover:bg-gray-200 transition-colors h-10">
                            <LayoutGrid className="w-5 h-5" /> <span>Tüm Kategoriler</span> <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full left-0 right-0 pt-6 -mt-2 hidden group-hover:block z-[999]">
                            <div className="bg-white shadow-xl rounded-b-xl border border-t-0 border-gray-100 overflow-hidden flex min-h-[500px]">
                                <div className="w-1/4 bg-gray-50 py-3 border-r border-gray-100 max-h-[600px] overflow-y-auto">
                                    {MASTER_DATA.map((cat, idx) => (
                                        <div key={idx} onMouseEnter={() => setActiveCategory(cat.id)} className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors ${activeCategory === cat.id ? 'bg-white text-[#001e93] font-bold border-l-4 border-[#001e93]' : 'text-gray-600 hover:bg-gray-100'}`}>
                                            <div className="flex items-center gap-3">{cat.icon && <cat.icon className="w-6 h-6" />}<span className="text-base">{cat.title}</span></div>
                                            {activeCategory === cat.id && <ChevronRight className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-3/4 p-8 bg-white overflow-y-auto max-h-[600px]">
                                    {activeCategoryData ? (
                                        <div className="grid grid-cols-3 gap-y-10 gap-x-8">
                                            {activeCategoryData.subCategories?.map((sub, idx) => (
                                                <div key={idx} className="break-inside-avoid">
                                                    <Link href={sub.href || '#'} className="block font-bold text-[#001e93] mb-3 hover:underline text-lg">{sub.title}</Link>
                                                    <ul className="space-y-2">
                                                        {sub.items?.map((item, i) => (
                                                            <li key={i}>
                                                                <Link
                                                                    href={`${sub.href}&query=${item}`}
                                                                    className="text-sm text-gray-600 hover:text-black hover:underline block"
                                                                >
                                                                    {item}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                        <li><Link href={sub.href || '#'} className="text-sm font-bold text-gray-900 hover:underline mt-1 inline-block">Tümünü Gör ›</Link></li>
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 overflow-hidden mask-linear">
                        {MASTER_DATA.slice(0, 8).map((cat, idx) => <Link key={idx} href={cat.href || '#'} className="text-gray-600 hover:text-[#001e93] text-sm font-medium whitespace-nowrap">{cat.title}</Link>)}
                    </div>
                </div>
            </div>
        </header>
    );
}