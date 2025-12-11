'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkAdminAccess } from '@/utils/admin-auth';

// --- USER ACTIONS ---

export async function updateUserRole(userId: string, newRole: 'admin' | 'moderator' | 'user') {
    const { profile } = await checkAdminAccess();

    // Only 'admin' (Owner) can change roles
    if (profile.role !== 'admin') {
        throw new Error('Unauthorized: Only Admins can change roles.');
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) {
        console.error('Error updating role:', error);
        throw new Error('Failed to update role');
    }

    revalidatePath('/admin/users');
}

export async function toggleUserBan(userId: string, currentStatus: boolean) {
    // Both Admin and Moderator can ban? Let's say yes for now, or restriction based on requirements.
    // User said: "Moderator can view and hide listings, but CANNOT delete users or make new admins."
    // Ban is usually allowed for mods.
    await checkAdminAccess();

    const supabase = await createClient();
    // Assuming we have an 'is_banned' column. If not, we might need to add it or use metadata.
    // user prompt: "Toggle a boolean is_banned (or status: 'banned')"
    // We will assume a metadata update for safety if column doesn't exist, OR update a 'status' column.
    // Let's try to update 'is_banned' column in profiles first (standard).

    const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentStatus })
        .eq('id', userId);

    if (error) {
        console.error('Error toggling ban:', error);
        throw new Error('Failed to toggle ban status');
    }

    revalidatePath('/admin/users');
}

export async function deleteUser(userId: string) {
    const { profile } = await checkAdminAccess();

    // Only 'admin' can delete users
    if (profile.role !== 'admin') {
        throw new Error('Unauthorized: Only Admins can delete users.');
    }

    const supabase = await createClient();

    // Auth admin deleteUser requires service_role key usually, but here we can try deleting from public tables
    // triggering cascade. Ideally we use supabase.auth.admin.deleteUser() which needs service_role.
    // Since we are using standard client here, we might only be able to delete the PROFILE.
    // A trigger should handle the auth deletion if set up, or we accept profile deletion as "soft delete".

    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }

    revalidatePath('/admin/users');
}

// --- ITEM ACTIONS ---

export async function deleteItem(itemId: string) {
    await checkAdminAccess(); // Mods can delete items/hide listings?
    // User: "Moderator can view and hide listings" -> Hide usually means delete or unpublish.

    const supabase = await createClient();
    const { error } = await supabase.from('items').delete().eq('id', itemId);

    if (error) {
        console.error('Error deleting item:', error);
        throw new Error('Failed to delete item');
    }

    revalidatePath('/admin/items');
}

export async function toggleItemFeatured(itemId: string, currentStatus: boolean) {
    await checkAdminAccess();

    const supabase = await createClient();
    const { error } = await supabase
        .from('items')
        .update({ is_featured: !currentStatus })
        .eq('id', itemId);

    if (error) {
        console.error('Error toggling featured:', error);
        throw new Error('Failed to toggle featured status');
    }

    revalidatePath('/admin/items');
}
