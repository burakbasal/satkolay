'use client';

import { Button } from "@/components/ui/button";
import { Trash, Star, CheckCircle, Eye } from 'lucide-react';
import { deleteItem, toggleItemFeatured } from '@/app/admin/actions';
import { toast } from 'sonner';

interface ItemActionsProps {
    itemId: string;
    isFeatured: boolean;
}

export function ItemActions({ itemId, isFeatured }: ItemActionsProps) {
    const handleToggleFeatured = async () => {
        try {
            await toggleItemFeatured(itemId, isFeatured);
            toast.success(isFeatured ? 'İlan vitrinden kaldırıldı.' : 'İlan vitrine eklendi.');
        } catch (error) {
            toast.error('İşlem başarısız.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
        try {
            await deleteItem(itemId);
            toast.success('İlan silindi.');
        } catch (error) {
            toast.error('İlan silinemedi.');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <a
                href={`/item/${itemId}`}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Görüntüle"
            >
                <Eye className="w-4 h-4" />
            </a>

            <Button
                onClick={handleToggleFeatured}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-slate-800 ${isFeatured ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                title={isFeatured ? "Vitrinden Kaldır" : "Vitrine Ekle"}
            >
                {isFeatured ? <Star className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4" />}
            </Button>

            <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-900/20 text-slate-400 hover:text-red-500"
                title="İlanı Sil"
            >
                <Trash className="w-4 h-4" />
            </Button>
        </div>
    );
}
