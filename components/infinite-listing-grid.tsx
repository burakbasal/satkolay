'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ListingCard } from '@/components/listing-card';
import { ListingSkeleton } from '@/components/listing-skeleton';
import { getItems } from '@/app/actions/get-items';

// Basic Type Definition based on usage
type Item = any; // we can refine this if we have a shared type

interface InfiniteListingGridProps {
    initialItems: Item[];
    city?: string;
    district?: string;
}

export function InfiniteListingGrid({
    initialItems,
    city,
    district,
}: InfiniteListingGridProps) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [page, setPage] = useState(2); // Start from page 2 since page 1 is initialItems
    const [hasMore, setHasMore] = useState(true);
    const [ref, inView] = useInView();

    // Reset state when filters change
    useEffect(() => {
        setItems(initialItems);
        setPage(2);
        setHasMore(true);
    }, [initialItems, city, district]); // Dependencies might be redundant if key changes on parent, but safe

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreItems();
        }
    }, [inView, hasMore]);

    const loadMoreItems = async () => {
        const nextItems = await getItems({ page, city, district });

        if (nextItems && nextItems.length > 0) {
            setItems((prev) => [...prev, ...nextItems]);
            setPage((prev) => prev + 1);
        } else {
            setHasMore(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <ListingCard key={item.id} item={item} />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    <ListingSkeleton />
                    <ListingSkeleton />
                    <ListingSkeleton />
                    <ListingSkeleton />
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                    Tüm ilanlar bu kadar.
                </div>
            )}
        </>
    );
}
