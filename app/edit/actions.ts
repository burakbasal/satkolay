'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().min(1),
    category: z.string().min(1),
    city: z.string().min(1),
    district: z.string().min(1),
});

export async function updateListing(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Giriş yapmalısınız' };
    }

    const itemId = formData.get('itemId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;

    // Dinamik Özellikleri Ayıkla (attr_ ile başlayanlar)
    const attributes: Record<string, any> = {};
    Array.from(formData.entries()).forEach(([key, value]) => {
        if (key.startsWith('attr_')) {
            attributes[key.replace('attr_', '')] = value;
        }
    });

    // Validasyon
    const validation = schema.safeParse({ title, description, price, category, city, district });
    if (!validation.success) {
        return { error: 'Lütfen tüm alanları doğru doldurunuz.' };
    }

    // 1. Yeni Resimleri Yükle
    const images = formData.getAll('images') as File[];
    let newImageUrls: string[] = [];

    if (images && images.length > 0) {
        const uploadPromises = images
            .filter(img => img.size > 0 && img.type.startsWith('image/'))
            .map(async (image) => {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error } = await supabase.storage.from('listing-images').upload(filePath, image);
                if (error) return null;

                const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);
                return data.publicUrl;
            });

        newImageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null) as string[];
    }

    // Mevcut Resimler + Yeni Resimler
    // (Not: Mevcut resimleri client'tan "existing_images" olarak yollaman gerekebilir,
    // ya da basitlik adına: eski resimleri database'den çekip üzerine ekle.)

    // Basit Yöntem: Client tarafı "keep_urls" array'i yollasın.
    const keepUrls = formData.getAll('keep_urls') as string[];
    const finalImageUrls = [...keepUrls, ...newImageUrls];


    // Veritabanı Güncelleme
    const { error } = await supabase
        .from('items')
        .update({
            title,
            description,
            price,
            category,
            location: `${city}, ${district}`,
            city,
            district,
            attributes, // JSONB güncelleme,
            image_urls: finalImageUrls,
            status: 'pending' // HER GÜNCELLEMEDE ONAYA DÜŞER
        })
        .eq('id', itemId)
        .eq('seller_id', user.id); // Güvenlik: Sadece sahibi güncelleyebilir

    if (error) {
        return { error: 'Güncelleme sırasında bir hata oluştu.' };
    }

    redirect(`/item/${itemId}`);
}
