'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ListingCard } from '@/components/listing-card';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchFavs = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('favorites')
                .select('*, item:items(*)')
                .eq('user_id', user.id);

            if (data) setFavorites(data);
            setLoading(false);
        };
        fetchFavs();
    }, []);

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Heart className="w-6 h-6 text-red-500 fill-current" /> Favorilerim</h1>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.map((fav) => (
                        <ListingCard key={fav.id} item={fav.item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Favori ilanınız yok</h3>
                    <p className="text-gray-500">Beğendiğiniz ilanları favorilere ekleyerek takip edebilirsiniz.</p>
                </div>
            )}
        </div>
    );
}
