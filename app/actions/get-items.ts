'use server';

import { createClient } from '@/utils/supabase/server';
import { normalizeCityInput } from '@/lib/normalization';

const ITEMS_PER_PAGE = 12;

export async function getItems({
    page = 1,
    city,
    district,
}: {
    page?: number;
    city?: string;
    district?: string;
}) {
    const supabase = await createClient();

    // Pagination calculation
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const dbCity = normalizeCityInput(city);
    const dbDistrict = district ? decodeURIComponent(district) : undefined;

    let query = supabase
        .from('items')
        .select('*, profiles(username, avatar_url)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(from, to);

    // City Filtering Logic (Preserved from original page.tsx)
    if (dbCity && dbCity !== 'all') {
        if (dbCity === 'İstanbul' || dbCity === 'Istanbul') {
            query = query.or('city.ilike.%İstanbul%,city.ilike.%Istanbul%');
        } else if (dbCity === 'İzmir' || dbCity === 'Izmir') {
            query = query.or('city.ilike.%İzmir%,city.ilike.%Izmir%');
        } else if (dbCity === 'Iğdır' || dbCity === 'Igdir') {
            query = query.or('city.ilike.%Iğdır%,city.ilike.%Igdir%');
        } else {
            query = query.ilike('city', `%${dbCity}%`);
        }
    }

    // District Filtering Logic
    if (dbDistrict && dbDistrict !== 'all') {
        query = query.ilike('district', `%${dbDistrict}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching items:', error);
        return [];
    }

    return data;
}
