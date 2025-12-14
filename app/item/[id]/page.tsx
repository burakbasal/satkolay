import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { MapPin, ShieldCheck, User, AlertTriangle } from 'lucide-react';
import { ImageGallery } from "@/components/image-gallery";
import { ItemActions } from "@/components/item-actions";
import { FavoriteButton } from '@/components/favorite-button';
import { ShareButton } from '@/components/share-button';
import { ListingCard } from '@/components/listing-card';

type Params = Promise<{ id: string }>;

// --- METADATA ---
export async function generateMetadata(
    props: { params: Params },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.params;
    const id = params.id;
    const supabase = await createClient();

    const { data: item } = await supabase
        .from('items')
        .select('title, description, city, price, image_urls')
        .eq('id', id)
        .single();

    if (!item) return { title: 'Ürün Bulunamadı | SatKolay' };

    const city = item.city || 'Türkiye';
    const price = item.price?.toLocaleString('tr-TR');
    const title = `${item.title} – ${city} | SatKolay (Güvenli Ödeme)`;
    const description = `${item.title}. ${city} konumunda, ${price} TL fiyatla satılık. SatKolay güvencesiyle hemen al.`.substring(0, 160);

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.satkolay.com/product/${id}`,
        },
        openGraph: {
            title,
            description,
            images: item.image_urls?.[0] ? [item.image_urls[0]] : [],
        },
    };
}

export default async function ItemPage(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;
    const supabase = await createClient();

    // 1. Fetch Data
    const { data: item, error } = await supabase
        .from('items')
        .select('*, owner:profiles!owner_id(*)')
        .eq('id', id)
        .single();

    const { data: { user } } = await supabase.auth.getUser();

    // 2. Similar Items Logic
    let similarItems: any[] = [];
    if (item) {
        const { data: simData } = await supabase
            .from('items')
            .select('*')
            .eq('category', item.category)
            .eq('status', 'active')
            .neq('id', item.id)
            .order('created_at', { ascending: false })
            .limit(4);
        similarItems = simData || [];
    }

    // 3. Error Handling
    if (error || !item) {
        return (
            <div className="container mx-auto p-10 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl w-full text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-red-700 mb-2">Veri Çekme Hatası!</h1>
                    <p className="text-gray-700 mb-4">Bu ürün görüntülenemiyor.</p>
                    <Link href="/" className="mt-6 inline-block bg-gray-900 text-white px-6 py-2 rounded-full">Anasayfaya Dön</Link>
                </div>
            </div>
        );
    }

    // 4. Security & Access Logic
    const { data: viewerProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
    const ownerId = item.owner_id;
    const ownerProfile = item.owner || item.profiles;
    const isOwner = user?.id === ownerId;
    const isAdmin = ['admin', 'owner', 'staff', 'moderator'].includes(viewerProfile?.role);

    if (item.status !== 'active' && ((!isOwner && !isAdmin) || !ownerId)) {
        if (!isAdmin) notFound();
    }

    const images = item.image_urls && item.image_urls.length > 0
        ? item.image_urls
        : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];

    // 5. PREPARE SCHEMA DATA
    const productUrl = `https://www.satkolay.com/product/${item.id}`;
    const imageUrl = item.image_urls?.[0] || 'https://www.satkolay.com/og-image.png'; // Fallback
    const brandName = item.attributes?.brand || 'SatKolay';

    // A. Product Schema
    const productSchema = {
        '@type': 'Product',
        name: item.title,
        image: imageUrl,
        description: item.description || item.title,
        brand: {
            '@type': 'Brand',
            name: brandName
        },
        offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'TRY',
            url: productUrl,
            availability: item.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: item.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
        }
    };

    // B. Breadcrumb Schema
    const breadcrumbSchema = {
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': 'https://www.satkolay.com' },
            { '@type': 'ListItem', 'position': 2, 'name': item.category || 'Vitrin', 'item': 'https://www.satkolay.com/search' },
            { '@type': 'ListItem', 'position': 3, 'name': item.title, 'item': productUrl }
        ]
    };

    // C. FAQ Schema (The Dominance Move)
    const faqSchema = {
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Bu ürünü nasıl güvenle alabilirim?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'SatKolay "Güvenli Ödeme" sistemi ile paranız havuzda tutulur. Ürünü teslim alıp onaylayana kadar satıcıya aktarılmaz.'
                }
            },
            {
                '@type': 'Question',
                name: 'İade hakkım var mı?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Eğer ürün anlatılandan farklıysa veya gönderilmezse, paranız %100 iade edilir.'
                }
            }
        ]
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [productSchema, breadcrumbSchema, faqSchema]
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <Link href="/" className="hover:underline">Anasayfa</Link> ›
                {item.category && <><Link href={`/search?category=${item.category}`} className="hover:underline">{item.category}</Link> ›</>}
                <span className="text-gray-900 font-medium truncate max-w-[300px]">{item.title}</span>
            </div>

            {/* UYARI BANDI (Sadece Admin/Owner görür) */}
            {item.status !== 'active' && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    <div>
                        <p className="font-bold">Bu ilan şu an yayında değil ({item.status})</p>
                        <p className="text-sm">Sadece siz ve yöneticiler görebilir. Diğer kullanıcılara 404 sayfası gösterilir.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <ImageGallery images={images} />
                    <div className="bg-white p-6 rounded-xl border border-gray-200 mt-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">İlan Açıklaması</h2>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 space-y-4 sticky top-24 h-fit">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <ShareButton title={item.title} text={item.description || ''} />
                            <FavoriteButton itemId={item.id} />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{item.price?.toLocaleString('tr-TR')} TL</h1>
                        <h2 className="text-lg text-gray-700 mb-4 leading-snug pr-10">{item.title}</h2>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                            <MapPin className="w-4 h-4" /> <span>{item.city || item.location || 'Konum Yok'}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
                            <div><span className="block text-gray-500">Durum</span><span className="font-medium">{item.condition || 'Belirtilmemiş'}</span></div>
                            {item.attributes?.brand && <div><span className="block text-gray-500">Marka</span><span className="font-medium">{item.attributes.brand}</span></div>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <Link href={`/profile/${ownerProfile?.username}`} className="flex items-center gap-4 mb-6 hover:bg-gray-50 p-2 rounded-lg transition-colors -ml-2">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
                                {ownerProfile?.avatar_url ? (
                                    <img src={ownerProfile.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-lg text-gray-900">{ownerProfile?.full_name || 'Satıcı'}</div>
                                <div className="text-xs text-gray-500">Üyelik: 2025</div>
                            </div>
                        </Link>

                        <ItemActions itemId={item.id} ownerId={ownerId} userId={user?.id || null} price={item.price} />
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-3">
                        <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">Cüzdanım Güvende</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-tight">Ödemeniz, ürünü teslim alıp onaylayana kadar SatKolay havuzunda güvenle saklanır.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Items */}
            <div className="mt-12 border-t pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Buna Bakanlar Şunları da Beğendi</h3>
                {similarItems && similarItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {similarItems.map((simItem: any) => (
                            <ListingCard key={simItem.id} item={simItem} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">Bu kategoride başka ilan bulunamadı.</p>
                )}
            </div>
        </div>
    );
}
