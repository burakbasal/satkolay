'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ListingCard } from '@/components/listing-card';
import Link from 'next/link';
import { Camera } from 'lucide-react';

export default function MyListingsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchItems = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('items')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setItems(data);
            setLoading(false);
        };
        fetchItems();
    }, []);

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Yayındaki İlanlarım</h1>

            {items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <ListingCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz ilan vermediniz</h3>
                    <p className="text-gray-500 mb-6">Satılacak ürünlerinizi hemen ekleyin.</p>
                    <Link href="/sell" className="inline-flex items-center gap-2 bg-[#ff3f55] text-white px-6 py-3 rounded-full font-bold hover:bg-[#e63548]">
                        <Camera className="w-5 h-5" /> Hemen Sat
                    </Link>
                </div>
            )}
        </div>
    );
}
