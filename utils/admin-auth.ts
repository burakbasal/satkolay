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
        .select('role, is_admin') // Hem yeni 'role' hem eski 'is_admin' desteği için
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        // Profil yoksa ana sayfaya at
        redirect('/');
    }

    // 3. Admin kontrolü (Hem role='admin' hem de is_admin=true kabul edelim)
    const isAdmin = profile.role === 'admin' || profile.is_admin === true;

    if (!isAdmin) {
        redirect('/');
    }

    return user;
}
