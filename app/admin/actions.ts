'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Admin Yetki Kontrolü
async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Oturum yok");

    const { data: profile } = await supabase.from('profiles').select('role, is_admin').eq('id', user.id).single();
    // Owner, Admin veya Staff işlem yapabilir (Rol dağıtımı hariç)
    if (!['owner', 'admin', 'staff'].includes(profile?.role)) throw new Error("Yetkisiz işlem!");
    return { supabase, myRole: profile.role };
}

// --- İLAN YÖNETİMİ ---

export async function deleteItem(itemId: string) {
    const { supabase } = await checkAdmin();
    // SOFT DELETE: Veriyi silme, durumunu 'deleted' yap.
    await supabase.from('items').update({ status: 'deleted' }).eq('id', itemId);
    revalidatePath('/admin');
}

export async function approveItem(itemId: string) {
    const { supabase } = await checkAdmin();
    await supabase.from('items').update({ status: 'active' }).eq('id', itemId);
    revalidatePath('/admin');
}

export async function rejectItem(itemId: string, reason: string) {
    const { supabase } = await checkAdmin();

    // 1. İlanı Reddet
    const { data: item, error } = await supabase
        .from('items')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', itemId)
        .select('seller_id, title')
        .single();

    if (error) throw new Error(error.message);

    // 2. Bildirim Gönder
    await supabase.from('notifications').insert({
        user_id: item.seller_id,
        item_id: itemId,
        type: 'item_rejected',
        message: reason // Red Sebebi
    });

    // 3. Log
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('admin_logs').insert({
        admin_id: user?.id,
        action: 'reject_item',
        target_id: itemId,
        details: `Sebep: ${reason}`
    });

    revalidatePath('/admin');
}

// --- KULLANICI YÖNETİMİ ---

export async function toggleBan(userId: string, currentStatus: boolean) {
    const { supabase } = await checkAdmin();
    await supabase.from('profiles').update({ is_banned: !currentStatus }).eq('id', userId);
    revalidatePath('/admin');
}

export async function deleteUser(userId: string) {
    const { supabase, myRole } = await checkAdmin();
    if (myRole !== 'owner') throw new Error("Sadece Kurucu kullanıcı silebilir.");

    await supabase.from('profiles').delete().eq('id', userId);
    revalidatePath('/admin');
}

export async function toggleAdmin(userId: string, currentStatus: boolean) {
    // Bu eski fonksiyon, updateRole kullanılması daha doğru ama geriye dönük uyumluluk için kalsın
    const { supabase, myRole } = await checkAdmin();
    if (myRole !== 'owner') throw new Error("Sadece Kurucu yetki verebilir.");

    await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('id', userId);
    revalidatePath('/admin');
}

// --- ROL ATAMA (GERİ GELDİ) ---
export async function updateRole(userId: string, newRole: string) {
    const { supabase, myRole } = await checkAdmin();

    if (myRole !== 'owner') {
        throw new Error("Sadece Kurucu (Owner) rütbe dağıtabilir.");
    }

    // Yeni rol admin yetkisi gerektiriyor mu?
    const giveAdminAccess = ['owner', 'admin', 'staff'].includes(newRole);

    await supabase.from('profiles').update({
        role: newRole,
        is_admin: giveAdminAccess
    }).eq('id', userId);

    revalidatePath('/admin');
}
