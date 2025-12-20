import { createClient } from '@/utils/supabase/client';
import { Category } from '@/types/category';

// Central Cache (Simple In-Memory for Client Side)
let cachedTree: Category[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 Minutes

export async function getCategoryTree(): Promise<Category[]> {
    const now = Date.now();
    if (cachedTree && (now - lastFetchTime < CACHE_TTL)) {
        return cachedTree;
    }

    const supabase = createClient();

    // Fetch ALL categories in one go (efficient for < 1000 items)
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id, depth')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

    if (error) {
        console.error('Category Fetch Error:', error);
        return [];
    }

    if (!data) return [];

    // Build Tree
    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];

    // 1. Create all nodes
    data.forEach((row: any) => {
        categoryMap.set(row.id, {
            ...row,
            children: [],
        });
    });

    // 2. Link parents
    data.forEach((row: any) => {
        const cat = categoryMap.get(row.id);
        if (cat) {
            if (row.parent_id) {
                const parent = categoryMap.get(row.parent_id);
                if (parent && parent.children) {
                    parent.children.push(cat);
                }
            } else {
                roots.push(cat);
            }
        }
    });

    cachedTree = roots;
    lastFetchTime = now;
    return roots;
}

// Helper to find a category by slug path (e.g. ['telefon', 'apple'])
export async function findCategoryByPath(slugs: string[]): Promise<Category | null> {
    const tree = await getCategoryTree();

    let currentLevel = tree;
    let foundCategory: Category | null = null;

    for (const slug of slugs) {
        const match = currentLevel.find(c => c.slug === slug);
        if (match) {
            foundCategory = match;
            currentLevel = match.children || [];
        } else {
            return null;
        }
    }
    return foundCategory;
}

// Helper to get flat list of leaves for search
export async function getAllLeafCategories(): Promise<Category[]> {
    const tree = await getCategoryTree();
    const leaves: Category[] = [];

    function traverse(cats: Category[]) {
        for (const cat of cats) {
            if (!cat.children || cat.children.length === 0) {
                leaves.push(cat);
            } else {
                traverse(cat.children);
            }
        }
    }

    traverse(tree);
    return leaves;
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

// Fetch Attributes for a Category
export async function getCategoryAttributes(categoryId: string): Promise<Attribute[]> {
    const supabase = createClient();

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
