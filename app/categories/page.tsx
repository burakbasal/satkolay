'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CATEGORIES, CategoryItem } from '@/lib/categories';

export default function CategoriesPage() {
    const router = useRouter();
    const [history, setHistory] = useState<CategoryItem[]>([]);

    const currentParent = history.length > 0 ? history[history.length - 1] : null;
    const currentList = currentParent ? currentParent.subs : CATEGORIES;

    const handleSelect = (item: CategoryItem) => {
        // 1. Alt kategori varsa -> Derine in
        if (item.subs && item.subs.length > 0) {
            setHistory([...history, item]);
        }
        // 2. Alt kategori yoksa (Son Durak) -> Aramaya git
        else {
            // Ebeveyni bul (Örn: "Renault"ya tıklandıysa ebeveyn "Araba"dır)
            // Eğer ebeveyn yoksa (Ana kategoriye tıklandıysa) kendisini kategori yap.
            const parentCategory = currentParent ? currentParent.label : item.label;

            // URL OLUŞTURMA:
            // category = Ebeveyn (Araba)
            // q = Kendisi (Renault)
            const params = new URLSearchParams();
            params.set('category', parentCategory); // category=Araba
            params.set('q', item.label);            // q=Renault

            router.push(`/search?${params.toString()}`);
        }
    };

    const handleBack = () => {
        const newHistory = [...history];
        newHistory.pop();
        setHistory(newHistory);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 h-14 flex items-center gap-3 shadow-sm">
                {history.length > 0 && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </Button>
                )}
                <h1 className="font-bold text-lg text-gray-900 truncate">
                    {currentParent ? currentParent.label : 'Kategoriler'}
                </h1>
            </div>

            {/* GRID LİSTE */}
            <div className="p-3 grid grid-cols-2 gap-3">
                {currentList?.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 aspect-[4/3] shadow-sm active:scale-95 transition-transform cursor-pointer relative overflow-hidden group"
                        >
                            {Icon && <Icon className="w-8 h-8 text-[#ff3f55] opacity-90 group-hover:scale-110 transition-transform" />}

                            <span className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                                {item.label}
                            </span>

                            {item.subs && item.subs.length > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-300 absolute bottom-2 right-2" />
                            )}
                        </div>
                    )
                })}
            </div>

            {(!currentList || currentList.length === 0) && (
                <div className="text-center p-10 text-gray-400">Bu kategoride seçenek yok.</div>
            )}
        </div>
    );
}
