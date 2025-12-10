export interface Item {
    id: string;
    title: string;
    description?: string;
    price: number;
    currency?: string;
    image_urls: string[];
    city?: string;
    district?: string;
    status?: 'active' | 'sold' | 'pending' | 'rejected';
    created_at?: string;
    user_id?: string;

    // YENİ EKLENEN ÖZELLİKLER
    listing_type?: 'standard' | 'large';
    is_featured?: boolean;
}
