import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { ListingCard } from '@/components/listing-card';
import { SearchFilters } from '@/components/search-filters';
import { normalizeCityInput } from '@/lib/normalization';
import Link from 'next/link';
import Image from 'next/image';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: {
    searchParams: SearchParams;
}): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const { category, q, query, city, min_price, max_price, sort } = searchParams;
    const queryText = (q || query) as string | undefined;

    // 1. Build Title
    let title = 'İkinci El İlanlar ve Fiyatlar | SatKolay';
    let description = 'Aradığınız tüm ikinci el ürünler, güvenli ödeme ve taksit seçenekleriyle SatKolay\'da.';

    const categoryStr = typeof category === 'string' ? category : '';
    const cityStr = typeof city === 'string' ? city : '';

    if (categoryStr && queryText) {
        title = `${queryText} ${categoryStr} İlanları | SatKolay`;
        description = `${categoryStr} kategorisinde ${queryText} araması için en uygun fiyatlı ilanlar.`;
    } else if (categoryStr) {
        title = `${categoryStr} İlanları ve Fiyatları | SatKolay`;
        description = `En temiz ikinci el ${categoryStr} modelleri ve fiyatları SatKolay'da.`;
    } else if (queryText) {
        title = `"${queryText}" Arama Sonuçları | SatKolay`;
    }

    // 2. Build Canonical (Clean URL)
    // Only keep 'category' and 'query' for the master version of the page
    const canonicalParams = new URLSearchParams();
    if (categoryStr) canonicalParams.set('category', categoryStr);
    if (queryText) canonicalParams.set('query', queryText);
    if (cityStr) canonicalParams.set('city', cityStr);

    const canonicalString = canonicalParams.toString();
    const canonicalUrl = `https://www.satkolay.com/search${canonicalString ? `?${canonicalString}` : ''}`;

    // 3. Robots Logic (Smart Indexing)
    // Don't index complex filter combinations to preserve crawl budget
    const isComplexFilter = (min_price || max_price || sort);
    const shouldIndex = !isComplexFilter;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: shouldIndex,
            follow: true,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
        }
    };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const supabase = await createClient();

    const queryText = (params.q || params.query) as string | undefined; // q veya query

    // Parametreleri al
    const category = params.category as string | undefined;
    const minPrice = params.min_price;
    const maxPrice = params.max_price;
    const sort = params.sort;
    const rawCity = params.city as string | undefined;
    const dbCity = normalizeCityInput(rawCity);
    const rawDistrict = params.district as string | undefined;
    const dbDistrict = rawDistrict ? decodeURIComponent(rawDistrict) : undefined;

    // --- 1. İLAN SORGUSU ---
    let itemQuery = supabase.from('items')
        .select('*, profiles(username, avatar_url)')
        .eq('status', 'active');

    if (queryText) {
        itemQuery = itemQuery.or(`title.ilike.%${queryText}%,description.ilike.%${queryText}%`);
    }
    if (category && category !== 'all') itemQuery = itemQuery.ilike('category', `%${category}%`);
    if (dbCity && dbCity !== 'all') {
        if (['İstanbul', 'Istanbul'].includes(dbCity)) itemQuery = itemQuery.or('city.ilike.%İstanbul%,city.ilike.%Istanbul%');
        else if (['İzmir', 'Izmir'].includes(dbCity)) itemQuery = itemQuery.or('city.ilike.%İzmir%,city.ilike.%Izmir%');
        else itemQuery = itemQuery.ilike('city', `%${dbCity}%`);
    }
    if (dbDistrict && dbDistrict !== 'all') itemQuery = itemQuery.ilike('district', `%${dbDistrict}%`);
    if (minPrice) itemQuery = itemQuery.gte('price', minPrice);
    if (maxPrice) itemQuery = itemQuery.lte('price', maxPrice);

    // Sıralama
    if (sort === 'price-asc') itemQuery = itemQuery.order('price', { ascending: true });
    else if (sort === 'price-desc') itemQuery = itemQuery.order('price', { ascending: false });
    else itemQuery = itemQuery.order('created_at', { ascending: false });

    const { data: items } = await itemQuery;

    // --- 2. KULLANICI SORGUSU (YENİ ÖZELLİK) ---
    // Sadece bir arama kelimesi varsa kullanıcı ara
    let profiles = null;
    if (queryText) {
        const { data: foundProfiles } = await supabase
            .from('profiles')
            .select('username, avatar_url, full_name')
            .or(`username.ilike.%${queryText}%,full_name.ilike.%${queryText}%`)
            .limit(5); // En fazla 5 profil göster
        profiles = foundProfiles;
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8">

                <aside className="w-full lg:w-64 shrink-0">
                    <div className="sticky top-24">
                        <SearchFilters />
                    </div>
                </aside>

                <main className="flex-1 min-w-0">

                    {/* KULLANICI SONUÇLARI (Varsa Göster) */}
                    {profiles && profiles.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-md font-bold text-gray-700 mb-3">Kullanıcılar</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {profiles.map((profile) => (
                                    <Link key={profile.username} href={`/profile/${profile.username}`} className="flex flex-col items-center gap-2 min-w-[80px] p-2 hover:bg-gray-50 rounded-lg transition">
                                        <div className="relative w-14 h-14">
                                            <Image
                                                src={profile.avatar_url || "/placeholder-avatar.png"}
                                                alt={profile.username}
                                                fill
                                                className="rounded-full object-cover border border-gray-200"
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-900 truncate max-w-[100px]">@{profile.username}</span>
                                    </Link>
                                ))}
                            </div>
                            <hr className="border-gray-100 mt-2" />
                        </div>
                    )}

                    {/* İLAN SONUÇLARI */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {category ? `${category}` : 'İlanlar'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {items?.length || 0} sonuç bulundu
                                {queryText && <span className="ml-1">("{queryText}" için)</span>}
                            </p>
                        </div>
                    </div>

                    {items && items.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 grid-flow-dense">
                            {items.map(item => (
                                <ListingCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-lg font-bold text-gray-900">İlan Bulunamadı</h3>
                            <p className="text-gray-500 text-center max-w-xs mt-2">
                                Farklı kelimelerle aramayı deneyebilirsiniz.
                            </p>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}