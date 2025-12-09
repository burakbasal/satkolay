'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SortSelect() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'smart';

    const handleSortChange = (value: string) => {
        // Mevcut parametreleri koru (username, category vs. kaybolmasın)
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);

        // Bulunduğumuz sayfada kal, sadece parametreleri güncelle
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[220px] bg-white border-gray-300 h-10 text-sm">
                <SelectValue placeholder="Sırala" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="smart">Akıllı Sıralama</SelectItem>
                <SelectItem value="views">En Çok İzlenenler</SelectItem>
                <SelectItem value="newest">Yayınlanma Tarihi (En Yeni)</SelectItem>
                <SelectItem value="price_asc">Fiyat (Önce En Düşük)</SelectItem>
                <SelectItem value="price_desc">Fiyat (Önce En Yüksek)</SelectItem>
                <SelectItem value="distance">Mesafeye Göre</SelectItem>
            </SelectContent>
        </Select>
    );
}
