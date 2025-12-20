'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getCategoryTree } from '@/lib/category-client';
import { Category } from '@/types/category';

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [history, setHistory] = useState<Category[]>([]);

    useEffect(() => {
        getCategoryTree().then(setCategories);
    }, []);

    const currentParent = history.length > 0 ? history[history.length - 1] : null;

    // Determine the list to display:
    const currentList = currentParent
        ? currentParent.children || []
        : categories;

    const handleSelect = (item: Category) => {
        // 1. If it has children, go deeper
        if (item.children && item.children.length > 0) {
            setHistory([...history, item]);
        }
        // 2. If leaf node or user wants to see items for this level
        // In this explorer, usually leaf triggers navigation.
        // But maybe we want to allow navigation at any level?
        // Let's assume if it has children, we drill down.
        // What if user wants to see "All Smartphones" (level 2)?
        // We can add a "See All" button or make the header clickable.
        // For now, strict drill down until leaf or explicitly clicked 'See All' if we add it.
        // Actually, adhering to the "category/[...slug]" model:
        else {
            const path = [...history, item].map(c => c.slug).join('/');
            router.push(`/category/${path}`);
        }
    };

    const handleBack = () => {
        const newHistory = [...history];
        newHistory.pop();
        setHistory(newHistory);
    };

    const handleSeeAll = () => {
        if (!currentParent) return;
        const path = history.map(c => c.slug).join('/');
        router.push(`/category/${path}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 h-14 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    {history.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </Button>
                    )}
                    <h1 className="font-bold text-lg text-gray-900 truncate">
                        {currentParent ? currentParent.name : 'Kategoriler'}
                    </h1>
                </div>
                {/* Option to navigate to current parent URL */}
                {currentParent && (
                    <Button variant="ghost" size="sm" onClick={handleSeeAll} className="text-[#001e93] text-xs font-bold">
                        Tümünü Gör
                    </Button>
                )}
            </div>

            {/* GRID LIST */}
            <div className="p-3 grid grid-cols-2 gap-3">
                {currentList.map((item) => {
                    // Icon logic: The DB `icon` column might contain a string name or URL.
                    // For now, we omit dyanmic icons or need a map. 
                    // To keep it simple, we just show text or static icon.
                    const hasSubs = item.children && item.children.length > 0;

                    return (
                        <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 aspect-[4/3] shadow-sm active:scale-95 transition-transform cursor-pointer relative overflow-hidden group"
                        >
                            {/* Placeholder Icon */}
                            {/* <Icon className="w-8 h-8 text-[#001e93] opacity-90 group-hover:scale-110 transition-transform" /> */}

                            <span className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                                {item.name}
                            </span>

                            {hasSubs && (
                                <ChevronRight className="w-4 h-4 text-gray-300 absolute bottom-2 right-2" />
                            )}
                        </div>
                    )
                })}
            </div>

            {(!currentList || currentList.length === 0) && (
                <div className="text-center p-10 text-gray-400">
                    <p>Bu kategoride seçenek yok.</p>
                    <Button variant="link" onClick={handleBack}>Geri Dön</Button>
                </div>
            )}
        </div>
    );
}
