import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function checkAdminAccess() {
    const supabase = await createClient();

    // 1. Kullanıcıyı al
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login');
    }

    // 2. Profildeki rolü kontrol et
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        redirect('/');
    }

    // 3. Rol Kontrolü (Admin = Owner, Moderator = Staff)
    // DB roles: 'admin', 'moderator'
    const allowedRoles = ['admin', 'moderator'];
    const hasRole = allowedRoles.includes(profile.role) || profile.is_admin === true;

    if (!hasRole) {
        // Yetkisiz giriş
        redirect('/');
    }

    // Profile objesini ve user'ı döndür ki sayfalarda tekrar çekmek zorunda kalmayalım
    return { user, profile };
}
