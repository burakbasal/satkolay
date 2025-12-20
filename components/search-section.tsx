'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Menu } from 'lucide-react'
import { getCategoryTree } from '@/lib/category-client'
import { Category } from '@/types/category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function SearchSection() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [query, setQuery] = useState("")

    useEffect(() => {
        getCategoryTree().then(setCategories)
    }, [])

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query)}`)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch()
    }

    return (
        <div className="relative z-20">
            {/* Search Bar Section */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 pb-16 pt-8 rounded-b-[2rem] shadow-lg">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-3xl font-bold text-white md:text-5xl">
                        Ne arıyorsun?
                    </h1>
                    <div className="relative mx-auto max-w-2xl flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <Input
                                className="h-14 w-full rounded-full border-none bg-white pl-12 text-lg shadow-xl placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500"
                                placeholder="Araba, telefon, bisiklet..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="h-14 rounded-full px-8 text-lg font-bold bg-gray-900 hover:bg-gray-800 shadow-xl"
                        >
                            Ara
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mega Menu Section - Floating overlapping the header */}
            <div className="mx-auto max-w-6xl px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-visible relative">
                    <div className="flex divide-x divide-gray-100 overflow-x-auto scrollbar-hide">
                        {/* All Categories Button */}
                        <div className="hidden md:flex items-center px-6 py-4 bg-gray-50 font-bold text-gray-700 whitespace-nowrap">
                            <Menu className="mr-2 h-5 w-5" />
                            Kategoriler
                        </div>

                        {/* Category Items */}
                        {categories.slice(0, 7).map((category) => (
                            <div
                                key={category.id}
                                className="group static"
                                onMouseEnter={() => setActiveCategory(category.id)}
                                onMouseLeave={() => setActiveCategory(null)}
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-4 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap relative h-full",
                                        activeCategory === category.id && "bg-orange-50 text-orange-600"
                                    )}
                                >
                                    {/* Icon if provided in DB, otherwise omit or use generic */}
                                    <span className="group-hover:font-bold transition-all">{category.name}</span>
                                </Link>

                                {/* Mega Menu Dropdown */}
                                <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-2xl rounded-b-xl p-8 hidden group-hover:block z-50 min-h-[300px]">
                                    <div className="grid grid-cols-4 gap-8">
                                        {category.children && category.children.length > 0 ? (
                                            category.children.map((sub, idx) => (
                                                <div key={idx} className="space-y-4">
                                                    <Link
                                                        href={`/category/${category.slug}/${sub.slug}`} // Deep link
                                                        className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-2 block hover:text-orange-600"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                    {/* If 3rd level exists (Micro Categories) */}
                                                    {sub.children && sub.children.length > 0 && (
                                                        <div className="flex flex-col space-y-2 mt-2">
                                                            {sub.children.slice(0, 5).map((micro, mIdx) => (
                                                                <Link
                                                                    key={mIdx}
                                                                    href={`/category/${category.slug}/${sub.slug}/${micro.slug}`}
                                                                    className="text-sm text-gray-600 hover:text-orange-600"
                                                                >
                                                                    {micro.name}
                                                                </Link>
                                                            ))}
                                                            {sub.children.length > 5 && (
                                                                <Link href={`/category/${category.slug}/${sub.slug}`} className="text-xs text-orange-500 font-medium hover:underline">
                                                                    Tümü ({sub.children.length})
                                                                </Link>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-3 flex items-center justify-center text-gray-400 italic">
                                                Bu kategoride henüz alt kategori bulunmuyor.
                                            </div>
                                        )}

                                        {/* Placeholder for visual balance */}
                                        <div className="col-span-1 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-center">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">
                                                    {category.name} kategorisindeki en popüler ilanları keşfet.
                                                </p>
                                                <Link href={`/category/${category.slug}`}>
                                                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                                        Tümünü Gör
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Link
                            href="/categories"
                            className="flex items-center px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                        >
                            Tümü...
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
