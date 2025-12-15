import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

import { ImageGallery } from '@/components/image-gallery';
import { ItemActions } from '@/components/item-actions';
import { FavoriteButton } from '@/components/favorite-button';
import { ShareButton } from '@/components/share-button';
import { ListingCard } from '@/components/listing-card';

type Params = Promise<{ id: string }>;

/* =========================
   METADATA
========================= */
export async function generateMetadata(
    props: { params: Params },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await props.params;
    const supabase = await createClient();

    const { data: item } = await supabase
        .from('items')
        .select('title, description, city, price, image_urls')
        .eq('id', id)
        .single();

    if (!item) {
        return { title: 'Ürün Bulunamadı | SatKolay' };
    }

    const city = item.city || 'Türkiye';
    const price = item.price?.toLocaleString('tr-TR');
    const title = `${item.title} – ${city} | SatKolay (Güvenli Ödeme)`;
    const description = `${item.title}. ${city} konumunda, ${price} TL fiyatla satılık. SatKolay güvencesiyle hemen al.`.slice(
        0,
        160
    );

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

/* =========================
   PAGE
========================= */
export default async function ItemPage(props: { params: Params }) {
    const { id } = await props.params;
    const supabase = await createClient();

    const { data: item, error } = await supabase
        .from('items')
        .select('*, owner:profiles!owner_id(*)')
        .eq('id', id)
        .single();

    if (error || !item) {
        return (
            <div className="container mx-auto p-10 min-h-[60vh] flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-red-700 mb-2">
                        Ürün görüntülenemiyor
                    </h1>
                    <Link
                        href="/"
                        className="inline-block mt-4 bg-gray-900 text-white px-5 py-2 rounded-full"
                    >
                        Anasayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    const images =
        item.image_urls && item.image_urls.length > 0
            ? item.image_urls
            : ['https://www.satkolay.com/og-image.png'];

    /* =========================
       SIMILAR ITEMS
    ========================= */
    const { data: similarItems } = await supabase
        .from('items')
        .select('*')
        .eq('category', item.category)
        .eq('status', 'active')
        .neq('id', item.id)
        .limit(4);

    /* =========================
       JSON-LD (CLEAN & VALID)
    ========================= */
    const productUrl = `https://www.satkolay.com/product/${item.id}`;
    const brandName = item.attributes?.brand || 'SatKolay';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Product',
                name: item.title,
                image: images[0],
                description: item.description || item.title,
                brand: {
                    '@type': 'Brand',
                    name: brandName,
                },
                offers: {
                    '@type': 'Offer',
                    price: item.price,
                    priceCurrency: 'TRY',
                    url: productUrl,
                    availability:
                        item.status === 'active'
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                    itemCondition:
                        item.condition === 'new'
                            ? 'https://schema.org/NewCondition'
                            : 'https://schema.org/UsedCondition',
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Anasayfa',
                        item: 'https://www.satkolay.com',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: item.category || 'Vitrin',
                        item: item.category
                            ? `https://www.satkolay.com/search?category=${item.category}`
                            : 'https://www.satkolay.com/search',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: item.title,
                        item: productUrl,
                    },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'Bu ürünü nasıl güvenle alabilirim?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                'SatKolay Güvenli Ödeme sistemi ile paranız ürün elinize geçip onaylayana kadar korunur.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'İade hakkım var mı?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                'Ürün gönderilmezse veya anlatılandan farklıysa paranız %100 iade edilir.',
                        },
                    },
                ],
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb UI */}
            <div className="text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:underline">
                    Anasayfa
                </Link>{' '}
                › <span className="text-gray-900">{item.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <ImageGallery images={images} />
                    <div className="bg-white mt-6 p-6 rounded-xl border">
                        <h2 className="text-lg font-bold mb-3">İlan Açıklaması</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {item.description}
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 space-y-4 sticky top-24 h-fit">
                    <div className="bg-white p-6 rounded-xl border relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <ShareButton title={item.title} text={item.description || ''} />
                            <FavoriteButton itemId={item.id} />
                        </div>

                        <h1 className="text-3xl font-black mb-2">
                            {item.price?.toLocaleString('tr-TR')} TL
                        </h1>

                        <div className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg mt-4">
                            <ShieldCheck className="text-green-600 w-6 h-6" />
                            <p className="text-xs text-gray-600">
                                Ödeme, ürünü teslim alıp onaylayana kadar güvenle tutulur.
                            </p>
                        </div>

                        <ItemActions
                            itemId={item.id}
                            ownerId={item.owner_id}
                            userId={null}
                            price={item.price}
                        />
                    </div>
                </div>
            </div>

            {/* Similar Items */}
            {similarItems && similarItems.length > 0 && (
                <div className="mt-12 border-t pt-8">
                    <h3 className="text-xl font-bold mb-6">
                        Buna Bakanlar Şunları da Beğendi
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {similarItems.map((s) => (
                            <ListingCard key={s.id} item={s} />
                        ))}
                    </div>
                </div>
            )}

            {/* VISIBLE FAQ */}
            <div className="mt-12 bg-white border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">
                    Sıkça Sorulan Sorular
                </h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <strong>Bu ürünü nasıl güvenle alabilirim?</strong>
                        <p className="text-gray-600 mt-1">
                            SatKolay Güvenli Ödeme sistemiyle paranız ürün elinize geçip
                            onaylayana kadar korunur.
                        </p>
                    </div>
                    <div>
                        <strong>İade hakkım var mı?</strong>
                        <p className="text-gray-600 mt-1">
                            Ürün gönderilmezse veya anlatılandan farklıysa paranız %100
                            iade edilir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
