'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ReviewModal({ targetId, currentUserId }: { targetId: string, currentUserId?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async () => {
        if (!currentUserId) return router.push('/login');
        if (rating === 0) return toast.error("Lütfen puan verin.");
        setLoading(true);

        try {
            const { error } = await supabase.from('reviews').upsert({
                reviewer_id: currentUserId,
                reviewee_id: targetId,
                rating: rating,
                comment: comment
            }, { onConflict: 'reviewer_id, reviewee_id' });

            if (error) throw error;

            toast.success("Değerlendirme gönderildi!");
            setIsOpen(false);
            setRating(0);
            setComment("");
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-8 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 gap-1">
                    <Star className="w-3 h-3" /> Puan Ver
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Kullanıcıyı Değerlendir</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* YILDIZLAR */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`transition-colors ${rating >= star ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`}
                            >
                                <Star className={`w-8 h-8 ${rating >= star ? 'fill-orange-500' : ''}`} />
                            </button>
                        ))}
                    </div>

                    <div className="text-center font-bold text-lg text-gray-700">
                        {rating > 0 ? `${rating} Yıldız` : 'Puan Seçin'}
                    </div>

                    {/* YORUM */}
                    <textarea
                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-200 outline-none min-h-[100px]"
                        placeholder="Deneyiminizi paylaşın (İsteğe bağlı)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <Button onClick={handleSubmit} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Gönder'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
