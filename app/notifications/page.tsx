'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, TrendingDown, XCircle } from 'lucide-react';

export default function NotificationsPage() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const fetchNotifs = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('notifications')
                .select(`*, item:items(*)`) // İlişkili ilanı da çek
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setNotifications(data);
        };
        fetchNotifs();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bell className="w-6 h-6" /> Bildirimler</h1>

            <div className="space-y-3 max-w-2xl">
                {notifications.length > 0 ? notifications.map((notif) => (
                    <Link key={notif.id} href={`/item/${notif.item_id}`} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition relative overflow-hidden">
                        {/* Resim */}
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <Image src={notif.item?.image_urls?.[0] || '/placeholder.png'} alt="" fill className="object-cover" />
                        </div>

                        {/* İçerik */}
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 line-clamp-1">{notif.item?.title}</h3>

                            {notif.type === 'item_rejected' ? (
                                <div className="mt-1">
                                    <p className="text-sm font-bold text-red-600 flex items-center gap-1">
                                        <XCircle className="w-4 h-4" /> İlan Reddedildi
                                    </p>
                                    <p className="text-xs text-red-800 mt-1 bg-red-100 p-2 rounded">
                                        Sebep: {notif.message}
                                    </p>
                                </div>
                            ) : notif.type === 'price_drop' ? (
                                <div className="mt-1">
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <TrendingDown className="w-4 h-4 text-green-600" /> Fiyat Düştü!
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-gray-400 line-through text-sm">{notif.old_price} TL</span>
                                        <span className="text-red-600 font-bold text-lg">{notif.new_price} TL</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 mt-1">Bir bildiriminiz var.</p>
                            )}

                            <p className="text-xs text-gray-400 mt-2">{new Date(notif.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>

                        {!notif.is_read && <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"></div>}
                    </Link>
                )) : (
                    <div className="text-center py-10 text-gray-400">Henüz bildiriminiz yok.</div>
                )}
            </div>
        </div>
    );
}
