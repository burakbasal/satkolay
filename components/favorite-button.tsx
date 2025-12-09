'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FavoriteButtonProps {
    itemId: string;
    className?: string;
    variant?: 'icon' | 'button';
}

export function FavoriteButton({ itemId, className, variant = 'icon' }: FavoriteButtonProps) {
    const [isFav, setIsFav] = useState(false);
    const [animate, setAnimate] = useState(false); // Animasyon state'i
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkFav = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('item_id', itemId).single();
            if (data) setIsFav(true);
        };
        checkFav();
    }, [itemId]);

    const toggleFav = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push('/login');

        // Animasyonu tetikle
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300); // 300ms sonra durdur

        const newState = !isFav;
        setIsFav(newState);

        if (newState) {
            await supabase.from('favorites').insert({ user_id: user.id, item_id: itemId });
            toast.success('Favorilere eklendi ❤️');
        } else {
            await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_id', itemId);
            toast('Favorilerden çıkarıldı');
        }
        router.refresh();
    };

    if (variant === 'button') {
        return (
            <button
                onClick={toggleFav}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-95", isFav ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50", className)}
            >
                <Heart className={cn("w-5 h-5 transition-transform duration-300", isFav && "fill-current", animate && "scale-125")} />
                <span>{isFav ? 'Favorilerde' : 'Favoriye Ekle'}</span>
            </button>
        )
    }

    return (
        <button
            onClick={toggleFav}
            className={cn("p-2 rounded-full transition-all active:scale-75", isFav ? "bg-white text-red-500" : "bg-white/90 text-gray-500 hover:text-red-500", className)}
        >
            <Heart className={cn("w-5 h-5 transition-transform duration-300", isFav && "fill-current", animate && "scale-150")} />
        </button>
    );
}
