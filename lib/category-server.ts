import { createClient } from '@/utils/supabase/server';
import { Category, BreadcrumbItem } from '@/types/category';

// Find a category by its full URL path (e.g. ['elektronik', 'telefon', 'iphone'])
// Verifies the chain to ensure valid URL structure
export async function findCategoryByPath(slugs: string[]): Promise<{ category: Category | null, breadcrumbs: BreadcrumbItem[] }> {
    const supabase = await createClient(); // Server Client

    // We fetch categories matching the slugs
    const { data: candidates, error } = await supabase
        .from('categories')
        .select('*')
        .in('slug', slugs);

    if (error || !candidates || candidates.length === 0) {
        return { category: null, breadcrumbs: [] };
    }

    let currentParentId: string | null = null;
    const breadcrumbs: BreadcrumbItem[] = [];
    let matchedCategory: Category | null = null;
    let accumulatedPath = '';

    // Walk through the requested slug path and verify hierarchy
    for (let i = 0; i < slugs.length; i++) {
        const currentSlug = slugs[i];

        // Find candidate at this 'level' 
        const found = candidates.find(c => c.slug === currentSlug && c.parent_id === currentParentId);

        if (!found) {
            // Path broken
            return { category: null, breadcrumbs: [] };
        }

        matchedCategory = found as Category;
        currentParentId = found.id;

        accumulatedPath += `/${found.slug}`;
        breadcrumbs.push({
            name: found.name,
            slug: found.slug,
            path: `/category${accumulatedPath}`
        });
    }

    return { category: matchedCategory, breadcrumbs };
}

// Fetch filters for a specific category
export async function getCategoryFilters(categoryId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('category_attributes')
        .select(`
            id,
            is_required,
            is_filterable,
            display_order,
            attribute:attributes (
                id,
                name,
                code,
                type,
                options,
                unit
            )
        `)
        .eq('category_id', categoryId)
        .eq('is_filterable', true)
        .order('display_order');

    if (error) return [];

    return data.map(item => ({
        ...item.attribute,
        isRequired: item.is_required
    }));
}
