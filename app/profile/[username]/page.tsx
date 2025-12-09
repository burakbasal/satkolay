import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Settings, LogOut, MapPin, Calendar, ShieldCheck, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ListingCard } from '@/components/listing-card';
import { FollowButton, ShareButton, ProfileAvatar, TrustBadges } from '@/components/profile-interactive';
import { FollowModal } from '@/components/profile/follow-modal';
import { ReviewModal } from '@/components/profile/review-modal';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const supabase = await createClient();

    // 1. Profil Sahibini Bul
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (!profile) return notFound();

    // 2. Oturum Kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user?.id === profile.id;
    const currentUserId = user?.id;

    // 3. Verileri Çek (Parallel Fetch)
    // SORGULAR BURADA GÜNCELLENDİ
    const [
        followersRes,
        followingRes,
        reviewsRes,
        itemsRes,
        isFollowingRes
    ] = await Promise.all([
        // A. Takipçi Listesi
        supabase
            .from('follows')
            .select(`
             follower_id,
             follower:profiles!follows_follower_id_fkey (
               username,
               avatar_url,
               full_name
             )
           `)
            .eq('following_id', profile.id),

        // B. Takip Edilenler Listesi
        supabase
            .from('follows')
            .select(`
             following_id,
             following:profiles!follows_following_id_fkey (
               username,
               avatar_url,
               full_name
             )
           `)
            .eq('follower_id', profile.id),

        // C. Puanlar
        supabase.from('reviews').select('rating').eq('reviewee_id', profile.id),

        // D. İlanlar (KULLANICI TALEBİNE GÖRE DÜZELTİLDİ)
        supabase
            .from('items')
            .select('*, profiles!items_user_id_fkey(*)') // İlişkiyi garantiye al
            .eq('user_id', profile.id) // KRİTİK NOKTA: profile.id KULLANILACAK
            .in('status', ['active', 'sold'])
            .order('created_at', { ascending: false }),

        // E. Takip Durumu
        currentUserId
            ? supabase.from('follows').select('*').eq('follower_id', currentUserId).eq('following_id', profile.id).single()
            : Promise.resolve({ data: null })
    ]);

    // Veri İşleme
    const followers = followersRes.data?.map((d: any) => d.follower).filter(Boolean) || [];
    const following = followingRes.data?.map((d: any) => d.following).filter(Boolean) || [];
    const reviews = reviewsRes.data || [];
    const items = itemsRes.data || [];
    const isFollowing = !!isFollowingRes.data;

    // Ortalama Puan Hesaplama
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "Yeni";

    const joinedYear = new Date(profile.created_at).getFullYear();

    return (
        <div className="container mx-auto px-4 py-8 pb-24 font-sans min-h-screen">

            <div className="flex flex-col lg:flex-row gap-8">

                {/* --- SOL PANEL (SIDEBAR) --- */}
                <aside className="w-full lg:w-[30%] shrink-0">
                    <div className="lg:sticky lg:top-24 space-y-6">

                        {/* KULLANICI KARTI */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-white -z-10" />

                            <div className="flex justify-center mb-4">
                                <ProfileAvatar src={profile.avatar_url} alt={profile.full_name || username} />
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || `@${username}`}</h1>
                            <p className="text-gray-500 text-sm mb-2">@{username}</p>

                            {/* Puan & Rozetler */}
                            <div className="flex flex-col items-center justify-center gap-2 mb-6">
                                <div className="flex items-center gap-1 font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm">
                                    <Star className="w-4 h-4 fill-orange-600" />
                                    {avgRating} <span className="text-orange-400 font-normal">({reviews.length})</span>
                                </div>
                                <TrustBadges rating={typeof avgRating === 'string' ? 0 : parseFloat(avgRating)} joinedYear={joinedYear} />
                            </div>

                            {/* İstatistikler */}
                            <div className="grid grid-cols-3 gap-2 border-t border-b py-4 mb-6 border-gray-100">
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">{items.length}</span>
                                    <span className="text-xs text-gray-400">İlan</span>
                                </div>
                                <div className="flex flex-col border-l border-r border-gray-100">
                                    <FollowModal type="followers" count={followers.length} data={followers} />
                                </div>
                                <div className="flex flex-col">
                                    <FollowModal type="following" count={following.length} data={following} />
                                </div>
                            </div>

                            {/* Detaylar */}
                            <div className="space-y-2 text-sm text-gray-500 mb-6">
                                <div className="flex items-center justify-center gap-2">
                                    <MapPin className="w-4 h-4" /> İstanbul
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Calendar className="w-4 h-4" /> Üye: {joinedYear}
                                </div>
                            </div>

                            {/* BUTONLAR */}
                            <div className="space-y-3">
                                {!isOwner ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <FollowButton targetId={profile.id} currentUserId={currentUserId} isFollowingInit={isFollowing} />
                                        <ReviewModal targetId={profile.id} currentUserId={currentUserId} />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {profile.is_admin && (
                                            <Link href="/admin" className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium">
                                                <ShieldCheck className="w-4 h-4" /> Admin Paneli
                                            </Link>
                                        )}
                                        <Link href="/profile/settings" className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"><Settings className="w-4 h-4" /> Profili Düzenle</Link>
                                        <form action="/auth/signout" method="post"><button className="w-full text-red-500 text-xs hover:underline mt-2">Çıkış Yap</button></form>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </aside>

                {/* --- SAĞ PANEL (CONTENT) --- */}
                <main className="flex-1 min-w-0">

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">İlanlar</h2>
                        <div className="lg:hidden text-sm text-gray-500">{items.length} adet</div>
                    </div>

                    {items && items.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <ListingCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                            <div className="grayscale opacity-50 mb-4 text-4xl">📦</div>
                            <h3 className="font-bold text-gray-900">Vitrin Boş</h3>
                            <p className="text-gray-500 text-sm mt-1">Bu kullanıcı henüz aktif bir ilan paylaşmadı.</p>
                        </div>
                    )}

                </main>

            </div>
        </div>
    );
}
