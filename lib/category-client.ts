import { createClient } from '@/utils/supabase/client';
import { Category } from '@/types/category';

// Fetch the full category tree (Client Side / Isomorphic)
export async function getCategoryTree(): Promise<Category[]> {
    const supabase = createClient();
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('depth', { ascending: true })
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];

    // First pass: Create objects and map them
    categories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: Build hierarchy
    categories.forEach(cat => {
        const fullCat = categoryMap.get(cat.id)!;
        if (cat.parent_id) {
            const parent = categoryMap.get(cat.parent_id);
            if (parent) {
                parent.children?.push(fullCat);
            }
        } else {
            roots.push(fullCat);
        }
    });

    return roots;
}
