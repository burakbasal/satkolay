export interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    slug: string;
    depth: number;
    description?: string;
    icon?: string;
    children?: Category[];
}

export interface BreadcrumbItem {
    name: string;
    slug: string;
    path: string;
}
