'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addAddress(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Oturum açmalısınız.' };

    const title = formData.get('title') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;
    const open_address = formData.get('open_address') as string;

    if (!title || !city || !district || !open_address) {
        return { error: 'Tüm alanları doldurun.' };
    }

    const { error } = await supabase.from('user_addresses').insert({
        user_id: user.id,
        title,
        city,
        district,
        open_address
    });

    if (error) return { error: error.message };

    revalidatePath('/profile/settings');
    return { success: true };
}

export async function deleteAddress(addressId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('user_addresses').delete().eq('id', addressId);

    if (error) return { error: error.message };

    revalidatePath('/profile/settings');
    return { success: true };
}
