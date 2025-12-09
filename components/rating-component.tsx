'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Star } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function RatingComponent({ targetId, currentUserId }: { targetId: string, currentUserId?: string }) {
    const [myRating, setMyRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    // 1. Mevcut Puanımı Öğren
    useEffect(() => {
        if (!currentUserId) return;

        const fetchRating = async () => {
            const { data } = await supabase
                .from('user_ratings')
                .select('score')
                .eq('rater_id', currentUserId)
                .eq('target_id', targetId)
                .single();

            if (data) setMyRating(data.score);
        };
        fetchRating();
    }, [currentUserId, targetId]);

    // 2. Puan Ver / Güncelle
    const handleRate = async (value: string) => {
        if (!currentUserId) return toast.error("Puan vermek için giriş yapmalısın.");

        setLoading(true);
        const score = parseInt(value);

        // Upsert: Varsa güncelle, yoksa ekle (Unique constraint sayesinde)
        const { error } = await supabase
            .from('user_ratings')
            .upsert(
                { rater_id: currentUserId, target_id: targetId, score: score },
                { onConflict: 'rater_id, target_id' }
            );

        if (error) {
            console.error(error);
            toast.error("Puan verilemedi.");
        } else {
            setMyRating(score);
            toast.success(`Puanın güncellendi: ${score}/10 ⭐`);
            router.refresh(); // Ortalamayı güncellemek için sayfayı yenile
        }
        setLoading(false);
    };

    return (
        <div className="w-full mt-2">
            <div className="flex items-center gap-2 mb-1">
                <Star className={`w-4 h-4 ${myRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                <span className="text-xs text-gray-500 font-medium">
                    {myRating ? `Senin Puanın: ${myRating}` : 'Satıcıyı Puanla'}
                </span>
            </div>

            <Select onValueChange={handleRate} value={myRating?.toString()} disabled={loading}>
                <SelectTrigger className="w-full h-9 text-sm bg-white border-gray-200">
                    <SelectValue placeholder="Puan Seç (1-10)" />
                </SelectTrigger>
                <SelectContent>
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(score => (
                        <SelectItem key={score} value={score.toString()}>
                            {score} Yıldız
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
