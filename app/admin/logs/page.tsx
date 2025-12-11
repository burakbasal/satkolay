import { createClient } from '@/utils/supabase/server';
import { DataTable, DataTableCell, DataTableRow } from '@/components/admin/data-table';
import { checkAdminAccess } from '@/utils/admin-auth';

export default async function AdminLogsPage() {
    await checkAdminAccess();
    const supabase = await createClient();

    // Fetch logs if table exists, else empty
    const { data: logs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tight">Aktivite Logları</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <DataTable headers={['Tarih', 'Kullanıcı', 'Eylem', 'Detay']}>
                    {logs?.map((log: any) => (
                        <DataTableRow key={log.id}>
                            <DataTableCell>
                                <span className="font-mono text-xs text-slate-500">
                                    {new Date(log.created_at).toLocaleString('tr-TR')}
                                </span>
                            </DataTableCell>
                            <DataTableCell>
                                <span className="text-white font-medium">{log.actor_id} (ID)</span>
                            </DataTableCell>
                            <DataTableCell>
                                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                    {log.action_type || 'INFO'}
                                </span>
                            </DataTableCell>
                            <DataTableCell>
                                <span className="text-slate-400 text-sm max-w-md truncate block">
                                    {JSON.stringify(log.details || log.metadata || {})}
                                </span>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                    {(!logs || logs.length === 0) && (
                        <div className="p-8 text-center text-slate-500">
                            Henüz log kaydı bulunmuyor.
                        </div>
                    )}
                </DataTable>
            </div>
        </div>
    );
}
