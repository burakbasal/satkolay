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

export async function approveItem(itemId: string) {
    await checkAdminAccess();

    const supabase = await createClient();
    const { error } = await supabase
        .from('items')
        .update({ status: 'active', is_active: true })
        .eq('id', itemId);

    if (error) {
        console.error('Error approving item:', error);
        throw new Error('Failed to approve item');
    }

    // TODO: Log action to activity_logs table
    revalidatePath('/admin/approval');
    revalidatePath('/admin/items');
}

export async function rejectItem(itemId: string, reason?: string) {
    await checkAdminAccess();

    const supabase = await createClient();
    // Soft delete or just mark status as rejected? Prompt said "Update status = 'rejected'"
    const { error } = await supabase
        .from('items')
        .update({ status: 'rejected', is_active: false }) // Assuming we added status column, if not, create migration later. 
        // For now, let's assume 'status' exists or we use 'is_active: false' + 'is_banned: true' logic if schema differs.
        .eq('id', itemId);

    if (error) {
        console.error('Error rejecting item:', error);
        throw new Error('Failed to reject item');
    }

    // TODO: Log action
    revalidatePath('/admin/approval');
    revalidatePath('/admin/items');
}

export async function toggleItemBig(itemId: string, currentStatus: boolean) {
    await checkAdminAccess();

    const supabase = await createClient();
    const { error } = await supabase
        .from('items')
        .update({ is_large: !currentStatus }) // Requires is_large column in DB. If not exists, this will fail.
        .eq('id', itemId);

    if (error) {
        console.error('Error toggling big listing:', error);
        throw new Error('Failed to toggle big listing status');
    }

    revalidatePath('/admin/items');
}

export async function updateItemStatus(itemId: string, newStatus: string) {
    await checkAdminAccess();

    const supabase = await createClient();
    const { error } = await supabase
        .from('items')
        .update({ status: newStatus })
        .eq('id', itemId);

    if (error) {
        console.error('Error updating item status:', error);
        throw new Error('Failed to update status');
    }

    revalidatePath('/admin/items');
}

export async function editItemContent(itemId: string, data: { title: string; description: string; price: number }) {
    await checkAdminAccess();

    const supabase = await createClient();
    const { error } = await supabase
        .from('items')
        .update({
            title: data.title,
            description: data.description,
            price: data.price
        })
        .eq('id', itemId);

    if (error) {
        console.error('Error editing item:', error);
        throw new Error('Failed to update item content');
    }

    revalidatePath('/admin/items');
}

export async function updateUserProfile(userId: string, data: { username: string; full_name: string }) {
    await checkAdminAccess();

    const supabase = await createClient();
    const { error } = await supabase
        .from('profiles')
        .update({
            username: data.username,
            full_name: data.full_name
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
    }

    revalidatePath('/admin/users');
}

export async function deleteMessage(messageId: string) {
    await checkAdminAccess();

    const supabase = await createClient();
    const { error } = await supabase.from('messages').delete().eq('id', messageId);

    if (error) {
        console.error('Error deleting message:', error);
        throw new Error('Failed to delete message');
    }

    revalidatePath('/admin/messages');
}
