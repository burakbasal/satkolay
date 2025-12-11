import { checkAdminAccess } from '@/utils/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
    await checkAdminAccess();
    const supabase = await createClient();

    // Fetch settings
    const { data } = await supabase.from('system_settings').select('key, value');

    // Transform to object
    const settingsMap: any = {};
    if (data) {
        data.forEach((item: any) => {
            settingsMap[item.key] = item.value;
        });
    }

    const initialSettings = {
        maintenance_mode: settingsMap['maintenance_mode'] || false,
        registration_closed: settingsMap['registration_closed'] || false,
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Sistem Ayarları</h2>
                <p className="text-slate-400">Platform genelindeki ayarları buradan yönetin.</p>
            </div>

            <SettingsForm initialSettings={initialSettings} />
        </div>
    );
}
