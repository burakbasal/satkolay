import { createClient } from '@/utils/supabase/server';
import { DataTable, DataTableCell, DataTableRow } from '@/components/admin/data-table';
import { Shield, Ban, Edit, Trash } from 'lucide-react';

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Kullanıcı Yönetimi</h2>
                    <p className="text-slate-400">Toplam {profiles?.length || 0} kullanıcı.</p>
                </div>
            </div>

            <DataTable headers={['Kullanıcı', 'Rol', 'Katılma Tarihi', 'ID', 'İşlemler']}>
                {profiles?.map((profile) => (
                    <DataTableRow key={profile.id}>
                        <DataTableCell>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                                    {profile.full_name?.[0] || '?'}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{profile.full_name || 'İsimsiz'}</div>
                                    <div className="text-xs text-slate-500">{profile.email}</div>
                                </div>
                            </div>
                        </DataTableCell>
                        <DataTableCell>
                            {profile.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-purple-500/20">
                                    <Shield className="w-3 h-3" /> Admin
                                </span>
                            ) : profile.role === 'staff' ? (
                                <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-500/20">
                                    Personel
                                </span>
                            ) : (
                                <span className="text-slate-400">Kullanıcı</span>
                            )}
                        </DataTableCell>
                        <DataTableCell>
                            {new Date(profile.created_at).toLocaleDateString('tr-TR')}
                        </DataTableCell>
                        <DataTableCell>
                            <code className="bg-slate-950 px-2 py-1 rounded text-xs font-mono text-slate-500 select-all">
                                {profile.id.split('-')[0]}...
                            </code>
                        </DataTableCell>
                        <DataTableCell>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Düzenle">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Banla">
                                    <Ban className="w-4 h-4" />
                                </button>
                            </div>
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTable>
        </div>
    );
}
