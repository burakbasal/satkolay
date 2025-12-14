'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { MessageCircle, Edit, Trash2, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';

export function ItemActions({ itemId, sellerId, userId, price }: { itemId: string, sellerId: string, userId: string | null, price: number }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleAction = async (action: 'chat' | 'offer') => {
        if (!userId) return router.push('/login');
        if (loading) return;
        setLoading(true);

        try {
            if (!sellerId) {
                toast.error("Satıcı bilgisi bulunamadı.");
                return;
            }

            // 1. Bu ürün için zaten bir konuşma var mı?
            const { data: existingConv } = await supabase
                .from('conversations')
                .select('id')
                .eq('item_id', itemId)
                .or(`and(user1_id.eq.${userId},user2_id.eq.${sellerId}),and(user1_id.eq.${sellerId},user2_id.eq.${userId})`)
                .single();

            let conversationId = existingConv?.id;

            // 2. Yoksa yeni oluştur
            if (!conversationId) {
                const { data: newConv, error } = await supabase
                    .from('conversations')
                    .insert({
                        user1_id: userId,
                        user2_id: sellerId,
                        item_id: itemId
                    })
                    .select()
                    .single();

                if (error) throw error;
                conversationId = newConv.id;
            }

            // 3. Yönlendir
            let url = `/chat?id=${conversationId}`;
            if (action === 'offer') {
                // Teklif verilecekse parametre ekle
                url += `&offerPrice=${price}`;
            }
            router.push(url);

        } catch (error) {
            console.error(error);
            toast.error("İşlem başlatılamadı.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("İlanı silmek istediğinize emin misiniz?")) return;
        const { error } = await supabase.from('items').delete().eq('id', itemId);
        if (!error) {
            toast.success("İlan silindi.");
            router.push('/');
            router.refresh();
        }
    };

    // İlan Sahibi
    if (userId === sellerId) {
        return (
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => router.push(`/edit/${itemId}`)} className="w-full border-gray-300">
                    <Edit className="w-4 h-4 mr-2" /> Düzenle
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" /> Sil
                </Button>
            </div>
        );
    }

    // Alıcı
    return (
        <div className="grid gap-3">
            <Button
                onClick={() => handleAction('chat')}
                disabled={loading || !sellerId}
                className="w-full bg-[#001e93] hover:bg-[#e63548] text-white font-bold h-12 text-lg"
            >
                {loading ? <Loader2 className="animate-spin" /> : <><MessageCircle className="mr-2 w-5 h-5" /> Sohbet</>}
            </Button>
            <Button
                onClick={() => handleAction('offer')}
                disabled={loading || !sellerId}
                variant="outline"
                className="w-full border-[#001e93] text-[#001e93] hover:bg-red-50 font-bold h-12 text-lg"
            >
                <Tag className="mr-2 w-5 h-5" /> Teklif Ver
            </Button>
        </div>
    );
}
