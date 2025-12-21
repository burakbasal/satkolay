import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ListingCard } from '@/components/listing-card';
import { findCategoryByPath, getCategoryFilters } from '@/lib/services/serverCategoryService';
import { Button } from '@/components/ui/button';

type Params = Promise<{ slug: string[] }>;

export async function generateMetadata(
    props: { params: Params },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await props.params;
    const result = await findCategoryByPath(slug);

    if (!result) return { title: 'Sayfa Bulunamadı | SatKolay' };
    const { category, breadcrumbs } = result;

    // Format: "iPhone 15 (Akıllı Telefonlar) İlanları..."
    const parentName = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].name : '';
    const titleStr = parentName
        ? `${category.name} (${parentName}) İkinci El İlanları | SatKolay`
        : `${category.name} İlanları & Fiyatları | SatKolay`;

    return {
        title: titleStr,
        description: category.description || `En uygun fiyatlı ${category.name} ilanları SatKolay'da.`,
        alternates: {
            canonical: `https://www.satkolay.com/category/${slug.join('/')}`,
        },
        openGraph: {
            title: titleStr,
            description: `Satılık ${category.name} modelleri ve fiyatları.`,
        }
    };
}

export default async function CategoryPage(props: { params: Params }) {
    const { slug } = await props.params;
    const result = await findCategoryByPath(slug);

    if (!result) {
        notFound();
    }
    const { category, breadcrumbs } = result;

    const supabase = await createClient();
    const filters = await getCategoryFilters(category.id);

    // Get subcategories to display "Drill Down" options
    // We want the direct children of the CURRENT category
    const { data: children } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', category.id)
        .order('name');

    // Query Items
    // For this implementation, we'll matching by category_id directly.
    let query = supabase
        .from('items')
        .select('*, owner:profiles!owner_id(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

    query = query.eq('category_id', category.id);

    // Fallback search by string if ID returns nothing (hybrid approach not implemented here to stay clean)

    const { data: items } = await query;
    const safeItems = items || [];

    // JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category.name} İlanları`,
        description: category.description,
        url: `https://www.satkolay.com/category/${slug.join('/')}`,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Anasayfa',
                    item: 'https://www.satkolay.com'
                },
                ...breadcrumbs.map((b, i) => ({
                    '@type': 'ListItem',
                    position: i + 2,
                    name: b.name,
                    item: `https://www.satkolay.com/category/${breadcrumbs.slice(0, i + 1).map(x => x.slug).join('/')}`
                }))
            ]
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
                <Link href="/" className="hover:underline">Anasayfa</Link>
                {breadcrumbs.map((crumb, index) => {
                    // Path construction: /category/slug1/slug2...
                    // Since breadcrumbs are ordered from root, we can slice the array up to current index + 1
                    const path = `/category/${breadcrumbs.slice(0, index + 1).map(b => b.slug).join('/')}`;

                    return (
                        <span key={crumb.id} className="flex items-center">
                            <span className="mx-2">›</span>
                            {index === breadcrumbs.length - 1 ? (
                                <span className="font-semibold text-gray-900">{crumb.name}</span>
                            ) : (
                                <Link href={path} className="hover:underline">
                                    {crumb.name}
                                </Link>
                            )}
                        </span>
                    );
                })}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* SIDEBAR FILTERS */}
                <aside className="hidden lg:block space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Kategoriler</h3>
                        {/* Show siblings or children? Children is better for drill-down. */}
                        {children && children.length > 0 ? (
                            <ul className="space-y-2">
                                {children.map(child => (
                                    <li key={child.id}>
                                        <Link
                                            href={`/category/${slug.join('/')}/${child.slug}`}
                                            className="text-gray-600 hover:text-[#001e93] hover:underline flex items-center justify-between"
                                        >
                                            {child.name}
                                            <span className="text-xs text-gray-400">›</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400">Alt kategori bulunmuyor.</p>
                        )}
                    </div>

                    {/* DYNAMIC FILTERS */}
                    {filters.length > 0 && filters.map((filter: any) => (
                        <div key={filter.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">{filter.name}</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {filter.options && Array.isArray(filter.options) && filter.options.map((opt: string) => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" className="peer h-4 w-4 rounded border-gray-300 text-[#001e93] focus:ring-[#001e93]" />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* MAIN CONTENT */}
                <div className="lg:col-span-3">
                    {/* Header */}
                    <div className="mb-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                        <p className="text-gray-600 max-w-3xl">
                            {category.description || `En yeni ${category.name} ilanlarını inceleyin, karşılaştırın ve güvenle satın alın.`}
                        </p>
                    </div>

                    {/* Subcategories Pills (Mobile/Desktop Quick Access) */}
                    {children && children.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {children.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/category/${slug.join('/')}/${sub.slug}`}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#001e93] hover:text-[#001e93] transition-all shadow-sm active:scale-95"
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Listings Grid */}
                    {safeItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {safeItems.map((item) => (
                                <ListingCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Henüz İlan Yok</h3>
                            <p className="text-gray-500 mt-2">Bu kategoride şu an aktif ilan bulunmuyor.</p>
                            {children && children.length > 0 && <p className="text-sm text-[#001e93] mt-1 font-medium">Alt kategorilere göz atabilirsiniz.</p>}

                            <Link href="/sell" className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#001e93] text-white font-bold hover:bg-[#001570] transition shadow-lg hover:shadow-xl">
                                İlk İlanı Sen Ver
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
