import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { checkAdminAccess } from '@/utils/admin-auth';

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
                            <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                            {(user.email?.[0] || '?').toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                                {user.full_name || 'İsimsiz'}
                                            </div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                                            user.role === 'moderator' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {(user.role || 'USER').toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded text-xs">Aktif</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-xs border border-blue-500/30 px-3 py-1.5 rounded hover:bg-blue-500/10"
                                    >
                                        Detaylar &rarr;
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
