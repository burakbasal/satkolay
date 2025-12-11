import { createClient } from '@/utils/supabase/server';
import UserRow from '@/components/admin/user-row';
import { checkAdminAccess } from '@/utils/admin-auth';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    await checkAdminAccess();
    // Using await createClient() because utility function is likely async as seen in codebase history
    const supabase = await createClient();
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-6 text-red-400">Veri hatası: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Kullanıcı Yönetimi</h2>
                    <p className="text-slate-400">Toplam {users?.length || 0} kullanıcı.</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">UUID</th>
                                <th className="px-6 py-4">Kullanıcı</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Kayıt</th>
                                <th className="px-6 py-4 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {users?.map((user) => (
                                <UserRow key={user.id} user={user} />
                            ))}
                            {(!users || users.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Kullanıcı bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
