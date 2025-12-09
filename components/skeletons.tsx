import { Skeleton } from "@/components/ui/skeleton"

export function ListingSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" /> {/* Resim alanı */}
            <div className="space-y-2 p-2">
                <Skeleton className="h-4 w-[250px]" /> {/* Başlık */}
                <Skeleton className="h-4 w-[200px]" /> {/* Fiyat */}
                <div className="flex justify-between pt-2">
                    <Skeleton className="h-3 w-[100px]" /> {/* Konum */}
                    <Skeleton className="h-3 w-[50px]" /> {/* Tarih */}
                </div>
            </div>
        </div>
    )
}

export function GridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <ListingSkeleton key={i} />
            ))}
        </div>
    )
}
