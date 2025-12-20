"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types/category";
import { getCategoryTree } from "@/lib/category-client";

interface CategoryPickerProps {
    onSelect: (categoryId: string) => void;
    selectedCategoryId?: string;
}

export function CategoryPicker({ onSelect, selectedCategoryId }: CategoryPickerProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [history, setHistory] = useState<Category[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(selectedCategoryId || null);

    useEffect(() => {
        getCategoryTree().then(setCategories);
    }, []);

    // Helper to find path to initial selected category if provided
    // (Not fully implemented for brevity, assuming fresh pick for now)

    const currentParent = history.length > 0 ? history[history.length - 1] : null;
    const currentList = currentParent ? currentParent.children || [] : categories;

    const handleSelect = (category: Category) => {
        // If has children, drill down
        if (category.children && category.children.length > 0) {
            setHistory([...history, category]);
        } else {
            // Leaf node selected
            setSelectedId(category.id);
            onSelect(category.id);
        }
    };

    const handleBack = () => {
        const newHistory = [...history];
        newHistory.pop();
        setHistory(newHistory);
        setSelectedId(null);
    };

    const handleReset = () => {
        setHistory([]);
        setSelectedId(null);
    };

    return (
        <div className="w-full border rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Header / Breadcrumbs */}
            <div className="bg-gray-50 p-3 border-b flex items-center gap-2 text-sm">
                {history.length > 0 ? (
                    <button onClick={handleReset} className="text-gray-500 hover:text-gray-900 font-medium">
                        Kategoriler
                    </button>
                ) : (
                    <span className="font-bold text-gray-900">Kategori Seç</span>
                )}

                {history.map((cat, idx) => (
                    <div key={cat.id} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <button
                            onClick={() => {
                                // Slice history to this point
                                setHistory(history.slice(0, idx + 1));
                            }}
                            className={cn(
                                "hover:underline",
                                idx === history.length - 1 ? "font-bold text-gray-900" : "text-gray-600"
                            )}
                        >
                            {cat.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="h-64 overflow-y-auto p-2">
                {currentList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1">
                        {currentList.map((cat) => {
                            const hasChildren = cat.children && cat.children.length > 0;
                            const isSelected = selectedId === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleSelect(cat)}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors",
                                        isSelected ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-gray-100 text-gray-700"
                                    )}
                                >
                                    <span>{cat.name}</span>
                                    {hasChildren ? (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        isSelected && <Check className="w-4 h-4 text-blue-600" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Kategori bulunamadı.
                    </div>
                )}
            </div>

            {/* Selected Info Footer */}
            {selectedId && (
                <div className="p-3 bg-blue-50 border-t flex items-center justify-between">
                    <span className="text-sm text-blue-800">Seçilen: <strong>{history[history.length - 1]?.name || 'Kategori'}</strong></span>
                    <button onClick={handleReset} className="text-xs text-blue-600 hover:underline">Değiştir</button>
                </div>
            )}
        </div>
    );
}
