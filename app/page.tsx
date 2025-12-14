import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { ListingCard } from '@/components/listing-card';
import { normalizeCityInput } from '@/lib/normalization';
import { cookies } from 'next/headers';
import { HeroSlider } from '@/components/home/hero-slider';
import { TrendCategories } from '@/components/home/trend-categories';

export const dynamic = 'force-dynamic';

/* ✅ SEO METADATA — BURASI ÇOK ÖNEMLİ */
export const metadata: Metadata = {
  title: 'İkinci Elin En Yeni Adresi – SatKolay',
  description:
    "SatKolay, ikinci el alışverişi hızlı, güvenli ve kolay hale getiren yeni nesil bir platformdur. Kullanmadığınız eşyaları kolayca satın, aradığınız ürünlere uygun fiyatlarla ulaşın.",
  alternates: {
    canonical: 'https://www.satkolay.com/',
  },
  openGraph: {
    title: 'İkinci Elin En Yeni Adresi – SatKolay',
    description:
      "SatKolay, ikinci el alışverişi hızlı, güvenli ve kolay hale getiren yeni nesil bir platformdur. Kullanmadığınız eşyaları kolayca satın, aradığınız ürünlere uygun fiyatlarla ulaşın.",
    url: 'https://www.satkolay.com/',
    siteName: 'SatKolay',
    type: 'website',
  },
};

export default async function Home() {
  // Cookie üzerinden şehir bilgisini al
  const cookieStore = await cookies();
  const selectedCityCookie = cookieStore.get('user_city');
  const rawCity = selectedCityCookie?.value;

  const dbCity = normalizeCityInput(rawCity);

  const supabase = await createClient();

  let query = supabase
    .from('items')
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
    <div className="w-full">
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. TREND KATEGORİLER */}
      <TrendCategories />

      {/* 3. VİTRİN BAŞLIĞI */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <h1 className="text-xl font-bold text-gray-800">
          {dbCity ? `${dbCity} İlanları` : 'Vitrin'}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({items?.length || 0} ilan)
          </span>
        </h1>
      </div>

      {/* İLANLAR */}
      {items && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 grid-flow-dense">
          {items.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <h3 className="text-lg font-bold text-gray-900">Henüz İlan Yok</h3>
          <p className="text-gray-500 mt-2">
            Bu kriterlerde ilan bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
}
