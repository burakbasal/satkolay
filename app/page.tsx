import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { ListingCard } from '@/components/listing-card';
import { normalizeCityInput } from '@/lib/normalization';
import { cookies } from 'next/headers';
import { HeroSlider } from '@/components/home/hero-slider';
import { TrendCategories } from '@/components/home/trend-categories';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

/* ✅ SEO METADATA — AUTHORITY MODE */
export const metadata: Metadata = {
  title: "SatKolay | Türkiye'nin Güvenli İkinci El Pazar Yeri",
  description:
    "SatKolay ile ikinci el alışveriş çok kolay. Güvenli ödeme sistemi, komisyonsuz satış ve ücretsiz kargo fırsatlarıyla hemen alıp satmaya başlayın.",
  alternates: {
    canonical: 'https://www.satkolay.com',
  },
  openGraph: {
    title: "SatKolay | Türkiye'nin Güvenli İkinci El Pazar Yeri",
    description:
      "SatKolay ile ikinci el alışveriş çok kolay. Güvenli ödeme sistemi, komisyonsuz satış ve ücretsiz kargo fırsatlarıyla hemen alıp satmaya başlayın.",
    url: 'https://www.satkolay.com',
    siteName: 'SatKolay',
    type: 'website',
    images: [
      {
        url: 'https://www.satkolay.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SatKolay - Güvenli İkinci El Alışveriş',
      }
    ]
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

  // --- ENTITY SCHEMAS (Organization + WebSite) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.satkolay.com/#organization',
        name: 'SatKolay',
        url: 'https://www.satkolay.com',
        logo: 'https://www.satkolay.com/icon.png',
        sameAs: [
          'https://instagram.com/satkolay',
          'https://twitter.com/satkolay'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          availableLanguage: ['Turkish']
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.satkolay.com/#website',
        url: 'https://www.satkolay.com',
        name: 'SatKolay',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.satkolay.com/search?query={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <div className="w-full">
      {/* SCHEMA INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. TREND KATEGORİLER */}
      <TrendCategories />

      {/* 3. VİTRİN HEADER (Semantic H1 + Dynamic H2 + SEO Text) */}
      <div className="mb-6 px-4 md:px-0">
        {/* Static H1 for Authority */}
        <h1 className="text-xl font-bold text-gray-800">
          Türkiye'nin Güvenli İkinci El Pazar Yeri
        </h1>

        {/* Dynamic H2 for Context/Filtering */}
        <h2 className="text-sm text-gray-600 mt-1 flex items-center gap-2">
          {dbCity ? (
            <>
              <span>{dbCity} İkinci El İlanları</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                {items?.length || 0}
              </span>
            </>
          ) : (
            <>
              <span>Vitrin</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                {items?.length || 0} ilan
              </span>
            </>
          )}
        </h2>

        {/* Visible SEO Text */}
        <p className="text-xs text-gray-400 mt-2 max-w-2xl hidden md:block">
          SatKolay; telefon, elektronik, ev eşyası ve araba aksesuarları kategorilerinde güvenli ödeme ile ikinci el alışveriş imkanı sunar.
        </p>
      </div>

      {/* İLANLAR */}
      {items && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 grid-flow-dense">
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
