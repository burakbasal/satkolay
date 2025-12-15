import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ListingCard } from '@/components/listing-card';

const CATEGORY_MAP: Record<string, string> = {
    'araba': 'Araba',
    'telefon': 'Telefon',
    'elektronik': 'Elektronik',
    'ev-yasam': 'Ev & Yaşam',
    'giyim': 'Giyim',
    'motosiklet': 'Motosiklet',
    'bilgisayar': 'Bilgisayar',
    'beyaz-esya': 'Beyaz Eşya',
    'anne-bebek': 'Anne & Bebek',
    'spor-outdoor': 'Spor & Outdoor',
    'kitap-muzik': 'Kitap, Müzik & Hobi',
    'evcil-hayvan': 'Evcil Hayvanlar',
    'kozmetik': 'Kişisel Bakım & Kozmetik',
    'diger': 'Diğer'
};

const RELATED_SEARCHES: Record<string, string[]> = {
    // ARABA & VASITA
    'araba': [
        'Renault', 'Volkswagen', 'Fiat', 'Ford', 'Opel', 'Peugeot', 'Honda', 'Toyota', 'Hyundai', 'BMW', 'Mercedes'
    ],
    'motosiklet': [
        'Honda', 'Yamaha', 'Kuba', 'RKS', 'Mondial', 'Arora', 'Kask', 'Motosiklet Montu', 'Eldiven'
    ],

    // TELEFON & İLETİŞİM
    'telefon': [
        'iPhone 15', 'iPhone 13', 'iPhone 11', 'iPhone 14 Pro Max', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Redmi', 'Vivo', 'Şarj Cihazı', 'Bluetooth Kulaklık'
    ],

    // ELEKTRONİK & BİLGİSAYAR
    'elektronik': [
        'Televizyon', 'Fotoğraf Makinesi', 'Drone', 'PlayStation', 'Xbox', 'Akıllı Saat', 'Tablet', 'Projeksiyon', 'Ses Sistemi'
    ],
    'bilgisayar': [
        'Dizüstü Bilgisayar', 'Masaüstü Bilgisayar', 'Oyuncu Bilgisayarı', 'Monitör', 'Yazıcı', 'Ekran Kartı', 'Modem', 'Tablet'
    ],

    // EV & YAŞAM & MOBİLYA
    'ev-yasam': [
        'Koltuk Takımı', 'Yemek Masası', 'Yatak Odası', 'Halı', 'Perde', 'Avize', 'Lambader', 'Tablo', 'Ayna', 'Bahçe Mobilyası'
    ],
    'beyaz-esya': [
        'Buzdolabı', 'Çamaşır Makinesi', 'Bulaşık Makinesi', 'Fırın', 'Klima', 'Kombi', 'Süpürge', 'Ütü', 'Mikrodalga'
    ],

    // GİYİM & MODA
    'giyim': [
        'Kadın Giyim', 'Erkek Giyim', 'Ayakkabı', 'Mont', 'Çanta', 'Elbise', 'Tesettür Giyim', 'Spor Ayakkabı', 'Saat', 'Güneş Gözlüğü'
    ],

    // ANNE & BEBEK & OYUNCAK
    'anne-bebek': [
        'Bebek Arabası', 'Oto Koltuğu', 'Mama Sandalyesi', 'Park Yatak', 'Bebek Bezi', 'Oyuncak Araba', 'Akülü Araba', 'Lego', 'Eğitici Oyuncak'
    ],

    // SPOR & OUTDOOR
    'spor-outdoor': [
        'Bisiklet', 'Elektrikli Bisiklet', 'Koşu Bandı', 'Kamp Çadırı', 'Balıkçılık', 'Olta', 'Uyku Tulumu', 'Dambıl', 'Pilates'
    ],

    // KİTAP & MÜZİK & HOBİ
    'kitap-muzik': [
        'Roman', 'Ders Kitabı', 'Plak', 'Gitar', 'Bağlama', 'Piyano', 'Keman', 'Puzzle', 'Kutu Oyunları'
    ],

    // EVCİL HAYVAN
    'evcil-hayvan': [
        'Kedi Maması', 'Köpek Maması', 'Akvaryum', 'Kedi Kumu', 'Köpek Tasması', 'Kuş Kafesi'
    ],

    // KİŞİSEL BAKIM
    'kozmetik': [
        'Parfüm', 'Makyaj', 'Cilt Bakımı', 'Saç Kurutma Makinesi', 'Tıraş Makinesi', 'Epilasyon Aleti'
    ],

    'diger': [
        'Ofis Mobilyaları', 'Kırtasiye', 'Yapı Market', 'Hırdavat', 'Jeneratör', 'Tarım Aletleri'
    ]
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const { slug } = await props.params;
    const categoryName = CATEGORY_MAP[slug];

    if (!categoryName) return { title: 'Sayfa Bulunamadı | SatKolay' };

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
    const { slug } = await props.params;
    const categoryName = CATEGORY_MAP[slug];

    if (!categoryName) {
        notFound();
    }

    const supabase = await createClient();
    const { data: items } = await supabase
        .from('items')
        .select('*, owner:profiles!owner_id(*)')
        .eq('category', categoryName)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

    const safeItems = items || [];
    const relatedTags = RELATED_SEARCHES[slug] || [];

    // STRICT JSON-LD: RAW STRINGS ONLY
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${categoryName} İlanları`,
        description: `Satılık ikinci el ${categoryName} ilanları.`,
        url: `https://www.satkolay.com/category/${slug}`,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Anasayfa',
                    item: 'https://www.satkolay.com'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: categoryName,
                    item: `https://www.satkolay.com/category/${slug}`
                }
            ]
        },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: safeItems.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://www.satkolay.com/product/${item.id}`
            }))
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb Visual */}
            <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                <Link href="/" className="hover:underline">Anasayfa</Link> ›
                <span className="font-semibold text-gray-900">{categoryName}</span>
            </div>

            {/* Header */}
            <div className="mb-4 bg-white p-6 rounded-xl border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">İkinci El {categoryName}</h1>
                <p className="text-gray-600 max-w-3xl">
                    Aradığınız <strong>{categoryName}</strong> modelleri uygun fiyatlarla burada.
                    SatKolay güvencesiyle, ister elden teslim ister kargo seçenekleriyle güvenle alışveriş yapabilirsiniz.
                </p>
            </div>

            {/* RELATED SEARCH PILLS (New Feature) */}
            {relatedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {relatedTags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/search?category=${encodeURIComponent(categoryName)}&query=${encodeURIComponent(tag)}`}
                            className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* Grid */}
            {safeItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {safeItems.map((item) => (
                        <ListingCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-900">Henüz İlan Yok</h3>
                    <p className="text-gray-500 mt-2">Bu kategoride şu an aktif ilan bulunmuyor.</p>
                    <Link href="/sell" className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-full hover:opacity-80 transition">
                        İlk İlanı Sen Ver
                    </Link>
                </div>
            )}
        </div>
    );
}
