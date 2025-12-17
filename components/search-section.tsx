'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Menu } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function SearchSection() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

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
                            />
                        </div>
                        <Button className="h-14 rounded-full px-8 text-lg font-bold bg-gray-900 hover:bg-gray-800 shadow-xl">
                            Ara
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mega Menu Section - Floating overlapping the header */}
            <div className="mx-auto max-w-6xl px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-visible relative">
                    <div className="flex divide-x divide-gray-100 overflow-x-auto scrollbar-hide">
                        {/* All Categories Button (Optional, for mobile mainly or just as a header) */}
                        <div className="hidden md:flex items-center px-6 py-4 bg-gray-50 font-bold text-gray-700 whitespace-nowrap">
                            <Menu className="mr-2 h-5 w-5" />
                            Kategoriler
                        </div>

                        {/* Category Items */}
                        {CATEGORIES.map((category) => (
                            <div
                                key={category.id}
                                className="group static"
                                onMouseEnter={() => setActiveCategory(category.id)}
                                onMouseLeave={() => setActiveCategory(null)}
                            >
                                <Link
                                    href={category.href}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-4 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap relative",
                                        activeCategory === category.id && "bg-orange-50 text-orange-600"
                                    )}
                                >
                                    {/* Icon */}
                                    {category.icon && (
                                        <category.icon className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                                    )}
                                    <span className="group-hover:font-bold transition-all">{category.label}</span>
                                </Link>

                                {/* Mega Menu Dropdown */}
                                <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-2xl rounded-b-xl p-8 hidden group-hover:block z-50 min-h-[300px]">
                                    <div className="grid grid-cols-4 gap-8">
                                        {category.subs && category.subs.length > 0 ? (
                                            category.subs.map((sub, idx) => (
                                                <div key={idx} className="space-y-4">
                                                    <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-2">
                                                        {sub.label}
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {sub.subs && sub.subs.map((link, linkIdx) => (
                                                            <li key={linkIdx}>
                                                                <Link
                                                                    href={link.href}
                                                                    className="text-gray-500 hover:text-orange-600 hover:underline flex items-center text-sm"
                                                                >
                                                                    <ChevronRight className="h-3 w-3 mr-1 text-gray-300" />
                                                                    {link.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-3 flex items-center justify-center text-gray-400 italic">
                                                Bu kategoride henüz alt kategori bulunmuyor.
                                            </div>
                                        )}

                                        {/* Placeholder for visual balance or featured items in category */}
                                        <div className="col-span-1 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-center">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">
                                                    {category.label} kategorisindeki en popüler ilanları keşfet.
                                                </p>
                                                <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                                    Tümünü Gör
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
