```
import { createClient } from '@/utils/supabase/server';
import { checkAdminAccess } from '@/utils/admin-auth';
import { UserListRow } from '@/components/admin/user-list-row';

export default async function UsersPage() {
    await checkAdminAccess();
    const supabase = await createClient();
    const { data: users, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (error) return <div className="p-4 text-red-500">Hata: {error.message}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Kullanıcı Yönetimi</h2>
                    <p className="text-slate-400">Toplam {users?.length || 0} kullanıcı.</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Kullanıcı</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Kayıt Tarihi</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users?.map((user) => (
                            <UserListRow key={user.id} user={user} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
