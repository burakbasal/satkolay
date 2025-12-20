import { createClient } from '@/utils/supabase/server';
import { Category } from '@/types/category';

// Helper to find a category by slug path (e.g. ['telefon', 'apple']) - SERVER SIDE
export async function findCategoryByPath(slugs: string[]): Promise<{ category: Category, breadcrumbs: Category[] } | null> {
    const supabase = await createClient();

    // Strategy: 
    // 1. Find the last slug's component.
    // 2. Verify the path upwards.
    // OR simpler: Fetch the tree and traverse.
    // Given the tree size (< 500 items), fetching all is fast and easiest for correctness.

    const { data: allCategories, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

    if (error || !allCategories) return null;

    // Build Map
    const catMap = new Map<string, any>();
    allCategories.forEach(c => catMap.set(c.id, { ...c, children: [] }));
    allCategories.forEach(c => {
        if (c.parent_id && catMap.has(c.parent_id)) {
            catMap.get(c.parent_id).children.push(catMap.get(c.id));
        }
    });

    // Find Roots
    const roots = allCategories.filter(c => !c.parent_id).map(c => catMap.get(c.id));

    // Traverse
    let currentLevel = roots;
    let foundCategory: any = null;
    const breadcrumbs: Category[] = [];

    for (const slug of slugs) {
        const match = currentLevel.find((c: any) => c.slug === slug);
        if (match) {
            foundCategory = match;
            breadcrumbs.push({ ...match, children: undefined }); // Clean for breadcrumbs
            currentLevel = match.children;
        } else {
            return null;
        }
    }

    return { category: foundCategory, breadcrumbs };
}

// Get Filters for a Category (Server Side)
export async function getCategoryFilters(categoryId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('category_attributes')
        .select(`
            id,
            is_required,
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
        .order('display_order');

    if (error) return [];

    return data.map((item: any) => ({
        id: item.attribute.id,
        name: item.attribute.name,
        code: item.attribute.code,
        type: item.attribute.type,
        options: typeof item.attribute.options === 'string' ? JSON.parse(item.attribute.options) : item.attribute.options,
        unit: item.attribute.unit
    }));
}
