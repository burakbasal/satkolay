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

export interface Attribute {
    id: string;
    name: string;
    code: string;
    type: 'text' | 'number' | 'select' | 'boolean' | 'date';
    options?: string[] | null;
    unit?: string | null;
    is_required: boolean;
}

export async function getCategoryAttributes(categoryId: string): Promise<Attribute[]> {
    const supabase = createClient();

    // We need to fetch attributes for this category AND its parents (if we supported inheritance, but for now just direct)
    // Actually, let's just fetch direct attributes for the selected category.
    const { data, error } = await supabase
        .from('category_attributes')
        .select(`
            is_required,
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

    if (error) {
        console.error('Error fetching attributes:', error);
        return [];
    }

    return data.map((item: any) => ({
        ...item.attribute,
        options: typeof item.attribute.options === 'string' ? JSON.parse(item.attribute.options) : item.attribute.options,
        is_required: item.is_required
    }));
}
