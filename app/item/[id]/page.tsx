import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, Share2, ShieldCheck, User, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/image-gallery";
import { ItemActions } from "@/components/item-actions";
import { FavoriteButton } from '@/components/favorite-button';
import { ShareButton } from '@/components/share-button';
import { ListingCard } from '@/components/listing-card';

type Params = Promise<{ id: string }>;

export default async function ItemPage(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;

    const supabase = await createClient();

    // 1. İlanı Çekmeye Çalış (Hata yakalama açık)
    const { data: item, error } = await supabase
        .from('items')
        .select('*, profiles(id, username, full_name, avatar_url)')
        .eq('id', id)
        .single();

    const { data: { user } } = await supabase.auth.getUser();

    // --- BENZER İLANLARI ÇEK ---
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

    // --- HATA VARSA EKRANA BAS (404 VERME) ---
    if (error || !item) {
        return (
            <div className="container mx-auto p-10 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl w-full text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-red-700 mb-2">Veri Çekme Hatası!</h1>
                    <p className="text-gray-700 mb-4">Bu ürün görüntülenemiyor. İşte teknik sebebi:</p>

                    <div className="bg-black text-green-400 p-4 rounded-lg text-left font-mono text-sm overflow-auto mb-6">
                        {error ? JSON.stringify(error, null, 2) : "Hata yok ama 'item' verisi boş (Null) döndü."}
                    </div>

                    <div className="text-sm text-gray-500">
                        <strong>Olası Sebepler:</strong><br />
                        1. RLS Politikası (Okuma izni yok).<br />
                        2. ID yanlış veya silinmiş.<br />
                        3. İlişki hatası (Profiles tablosuna bağlanamıyor).
                    </div>

                    <Link href="/" className="mt-6 inline-block bg-gray-900 text-white px-6 py-2 rounded-full">Anasayfaya Dön</Link>
                </div>
            </div>
        );
    }

    // --- GÜVENLİK DUVARI (YENİ) ---
    const { data: viewerProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
    const isOwner = user?.id === item.seller_id;
    const isAdmin = ['admin', 'owner', 'staff'].includes(viewerProfile?.role);

    // Eğer ilan yayında değilse VE giren kişi sahibi/admin değilse -> 404
    if (item.status !== 'active' && !isOwner && !isAdmin) {
        notFound();
    }

    // --- HATA YOKSA SAYFAYI GÖSTER ---

    // Resim Garantisi
    const images = item.image_urls && item.image_urls.length > 0
        ? item.image_urls
        : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen font-sans">
            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <Link href="/" className="hover:underline">Anasayfa</Link> ›
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
                {/* SOL: GALERİ */}
                <div className="w-full lg:w-2/3">
                    <ImageGallery images={images} />
                    <div className="bg-white p-6 rounded-xl border border-gray-200 mt-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">İlan Açıklaması</h2>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                    </div>
                </div>

                {/* SAĞ: BİLGİ KARTI */}
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
                        <Link href={`/profile/${item.profiles?.username}`} className="flex items-center gap-4 mb-6 hover:bg-gray-50 p-2 rounded-lg transition-colors -ml-2">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
                                {item.profiles?.avatar_url ? (
                                    <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-lg text-gray-900">{item.profiles?.full_name || 'Satıcı'}</div>
                                <div className="text-xs text-gray-500">Üyelik: 2025</div>
                            </div>
                        </Link>

                        <ItemActions itemId={item.id} sellerId={item.seller_id} userId={user?.id || null} price={item.price} />
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

            {/* --- BENZER İLANLAR --- */}
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