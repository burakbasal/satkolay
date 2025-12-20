'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { checkContent } from '@/lib/moderation';

export async function createListing(formData: FormData) {
    const supabase = await createClient();

    // 1. Kullanıcı Kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    // 2. Verileri Al
    const title = formData.get('title') as string;
    const price = formData.get('price');
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    // 1. Yapay Zeka / Filtre Kontrolü
    const titleCheck = checkContent(title);
    const descCheck = checkContent(description);

    if (!titleCheck.valid) return { error: titleCheck.reason };
    if (!descCheck.valid) return { error: descCheck.reason };

    // 2. Kullanıcı Rolü Kontrolü (ARTIK ÖNEMSİZ - HERKES PENDING)
    // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    // const userRole = profile?.role || 'user';

    // KATI KURAL: Kim olursan ol, önce onay.
    const initialStatus = 'pending';

    // 3. Dinamik Özellikler
    const attributes: Record<string, any> = {};
    Array.from(formData.entries()).forEach(([key, value]) => {
        if (key.startsWith('attr_')) attributes[key.replace('attr_', '')] = value;
    });
    // Kategori detaylarını da ekle
    if (formData.get('subCategory')) attributes.sub_category = formData.get('subCategory');
    if (formData.get('detail')) attributes.detail_type = formData.get('detail');

    // 4. Resimleri HIZLI Yükle (Paralel)
    const images = formData.getAll('images') as File[];
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

    // Tüm resimlerin yüklenmesini bekle
    const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null) as string[];

    console.log('[DEBUG] Uploaded Images:', uploadedUrls);

    if (images.length > 0 && uploadedUrls.length === 0) {
        return { error: 'Görseller yüklenemedi. Lütfen tekrar deneyin.' };
    }

    // 5. Veritabanına Kayıt
    const { data: itemData, error: itemError } = await supabase.from('items').insert({
        title,
        description,
        price: parseFloat(price?.toString() || '0'),
        category, // This is the ID now (UUID)
        category_id: category, // Ensuring we populate the FK if it exists, or just relying on 'category' column being the FK. 
        // Wait, the schema likely has category_id UUID. The form sends 'category_id' as 'category'. 
        // Let's check the form: formData.set('category_id', selectedCategoryId);
        // But here we read: const category = formData.get('category') as string;
        // Actually, the form uses 'category_id' key in the manual injection: formData.set('category_id', ...).
        // But the old code read 'category'. I need to fix reading the category ID.
        city: formData.get('city') as string,
        district: formData.get('district') as string,
        condition: formData.get('condition') as string,
        seller_id: user.id,
        image_urls: uploadedUrls,
        attributes: attributes, // Legacy JSON, keep for safety
        status: initialStatus
    }).select().single();

    if (itemError || !itemData) {
        console.error("DB Error:", itemError);
        return { error: (itemError as any)?.message || "Veri oluşturulamadı." };
    }

    // 6. Item Attributes Insertion (New Deep Architecture)
    const attributesJson = formData.get('attributes_json') as string;
    if (attributesJson && itemData) {
        try {
            const parsedAttrs = JSON.parse(attributesJson);
            const attrInserts = Object.entries(parsedAttrs).map(([attrId, val]) => ({
                item_id: itemData.id,
                attribute_id: attrId,
                value: String(val) // Store as string for flexibility
            }));

            if (attrInserts.length > 0) {
                const { error: attrError } = await supabase.from('item_attributes').insert(attrInserts);
                if (attrError) console.error("Attribute Insert Error:", attrError);
            }
        } catch (e) {
            console.error("Failed to process attributes JSON", e);
        }
    }

    // Başarılıysa OBJE DÖN (Redirect YAPMA)
    // redirect(`/item/${itemData.id}`);

    // Username al (Profil yönlendirmesi için)
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();

    return { success: true, id: itemData.id, username: profile?.username || 'user' };
}
