import Link from "next/link"
import { Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { ListingCard } from "@/components/listing-card"

export async function ListingGrid({ city, district }: { city?: string, district?: string }) {
    const supabase = await createClient()
    let query = supabase
        .from('items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(12)

    if (city && city !== 'all') {
        query = query.ilike('city', `%${city}%`)
    }

    if (district && district !== 'all') {
        query = query.ilike('district', `%${district}%`)
    }

    const { data: items, error } = await query

    if (error) {
        console.error("Homepage fetch error:", error)
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50 rounded-2xl border border-red-100">
                <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                    <Tag className="h-8 w-8 text-red-500 transform rotate-180" />
                </div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Bağlantı Sorunu</h3>
                <p className="text-red-700 max-w-md text-sm">
                    Şu an ilanlara ulaşılamıyor, lütfen birazdan tekrar deneyin.
                </p>
            </div>
        )
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                <div className="bg-orange-50 p-4 rounded-full mb-4">
                    <Tag className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz İlan Yok</h3>
                <p className="text-gray-500 max-w-md mb-6">
                    Şu anda vitrinde hiç ürün yok. İlk ilanı sen ver ve satış yapmaya başla!
                </p>
                <Link href="/sell">
                    <Button className="bg-[#ff3f55] hover:bg-[#e63548] text-white font-bold rounded-full px-8">
                        Hemen İlan Ver
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map((item) => (
                <ListingCard key={item.id} item={item} />
            ))}
        </div>
    )
}
