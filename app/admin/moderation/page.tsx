import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { approveItem, rejectItem } from '../actions';

export default async function ModerationPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    // Yetki Kontrolü
    const { data: profile } = await supabase.from('profiles').select('role, is_admin').eq('id', user.id).single();
    const isAuthorized = profile?.is_admin || ['owner', 'admin', 'staff'].includes(profile?.role);

    if (!isAuthorized) return redirect('/');

    // Bekleyenleri Çek
    const { data: pendingItems } = await supabase
        .from('items')
        .select('*, profiles(full_name, email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" /> Onay Bekleyen İlanlar ({pendingItems?.length || 0})
            </h1>

            <div className="space-y-4">
                {pendingItems?.map((item: any) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6">
                        {/* Resim */}
                        <div className="w-48 h-32 bg-gray-100 rounded-lg relative overflow-hidden shrink-0">
                            <Image src={item.image_urls?.[0] || '/placeholder.png'} alt="" fill className="object-cover" />
                        </div>

                        {/* Bilgi */}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{item.description}</p>
                            <div className="mt-3 flex gap-4 text-xs text-gray-400">
                                <span className="text-emerald-600 font-bold text-sm">{item.price} TL</span>
                                <span>Satıcı: {item.profiles?.full_name}</span>
                                <span>Kategori: {item.category}</span>
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="flex flex-col gap-2 justify-center shrink-0">
                            <form action={approveItem.bind(null, item.id)}>
                                <Button className="w-full bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" /> Onayla</Button>
                            </form>
                            <form action={rejectItem.bind(null, item.id)}>
                                <Button variant="destructive" className="w-full"><X className="w-4 h-4 mr-2" /> Reddet</Button>
                            </form>
                        </div>
                    </div>
                ))}

                {(!pendingItems || pendingItems.length === 0) && (
                    <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl">Hiç bekleyen ilan yok. 🎉</div>
                )}
            </div>
        </div>
    )
}
