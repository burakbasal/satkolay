import { createClient } from '@/utils/supabase/server';
import { ListingCard } from '@/components/listing-card';
import { normalizeCityInput } from '@/lib/normalization';

export default async function Home({ searchParams }: { searchParams: Promise<{ city?: string, district?: string }> }) {
  const params = await searchParams;
  const rawCity = params?.city;
  const dbCity = normalizeCityInput(rawCity);

  const supabase = await createClient();

  let query = supabase.from('items')
    .select('*, profiles(username, avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (dbCity && dbCity !== 'all') {
    if (dbCity === 'İstanbul' || dbCity === 'Istanbul') {
      query = query.or('city.ilike.%İstanbul%,city.ilike.%Istanbul%');
    } else if (dbCity === 'İzmir' || dbCity === 'Izmir') {
      query = query.or('city.ilike.%İzmir%,city.ilike.%Izmir%');
    } else {
      query = query.ilike('city', `%${dbCity}%`);
    }
  }

  const { data: items } = await query;

  return (
    <main className="container mx-auto px-4 py-8 pb-24 min-h-screen">
      {/* BAŞLIK */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          {dbCity ? `${dbCity} İlanları` : 'Vitrin'}
          <span className="ml-2 text-sm font-normal text-gray-500">({items?.length || 0} ilan)</span>
        </h1>
      </div>

      {/* İLANLAR */}
      {items && items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <h3 className="text-lg font-bold text-gray-900">Henüz İlan Yok</h3>
          <p className="text-gray-500 mt-2">Bu kriterlerde ilan bulunamadı.</p>
        </div>
      )}
    </main>
  );
}
