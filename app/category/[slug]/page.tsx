import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ListingCard } from '@/components/listing-card';

// Slug to DB Name Mapping
const CATEGORY_MAP: Record<string, string> = {
    'araba': 'Araba',
    'telefon': 'Telefon',
    'elektronik': 'Elektronik',
    'ev-yasam': 'Ev & Yaşam',
    'diger': 'Diğer',
    'giyim': 'Giyim', // Added common category just in case
    'spor': 'Spor',   // Added common category just in case
    'kozmetik': 'Kozmetik' // Added common category just in case
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const categoryName = CATEGORY_MAP[slug];

    if (!categoryName) return { title: 'Kategori Bulunamadı | SatKolay' };

    return {
        title: `${categoryName} İkinci El İlanları & Fiyatları | SatKolay`,
        description: `En temiz ve uygun fiyatlı ikinci el ${categoryName} ilanları SatKolay'da. Güvenli ödeme sistemi ile ${categoryName} alıp satmak çok kolay.`,
        alternates: {
            canonical: `https://www.satkolay.com/category/${slug}`,
        },
        openGraph: {
            title: `${categoryName} İlanları - SatKolay`,
            description: `Güvenli ikinci el ${categoryName} alışverişinin adresi.`,
        }
    };
}

export default async function CategoryPage(props: { params: Params }) {
    const params = await props.params;
    const { slug } = params;
    const categoryName = CATEGORY_MAP[slug];

    if (!categoryName) {
        notFound(); // Returns 404 if slug is invalid
    }

    const supabase = await createClient();
    const { data: items } = await supabase
        .from('items')
        .select('*, profiles(*)') // Fetch owner profile for card
        .eq('category', categoryName)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

    // Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${categoryName} İlanları`,
        url: `https://www.satkolay.com/category/${slug}`,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': 'https://www.satkolay.com' },
                { '@type': 'ListItem', 'position': 2, 'name': categoryName, 'item': `https://www.satkolay.com/category/${slug}` }
            ]
        },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: items?.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://www.satkolay.com/product/${item.id}`
            }))
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                <Link href="/" className="hover:underline">Anasayfa</Link>
                <span>›</span>
                <span className="font-semibold text-gray-900">{categoryName}</span>
            </div>

            {/* Header & SEO Text */}
            <div className="mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">İkinci El {categoryName}</h1>
                <p className="text-gray-600 max-w-3xl leading-relaxed">
                    Aradığınız <strong>{categoryName}</strong> modelleri uygun fiyatlarla burada.
                    SatKolay güvencesiyle, ister elden teslim ister kargo seçenekleriyle güvenle alışveriş yapabilirsiniz.
                    Sahibinden satılık ikinci el {categoryName} fırsatlarını kaçırmayın.
                </p>
            </div>

            {/* Listings Grid */}
            {items && items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.map((item) => (
                        <ListingCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-900">Henüz İlan Yok</h3>
                    <p className="text-gray-500 mt-2">Bu kategoride şu an aktif ilan bulunmuyor.</p>
                    <Link href="/sell" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg">
                        İlk İlanı Sen Ver
                    </Link>
                </div>
            )}
        </div>
    );
}
