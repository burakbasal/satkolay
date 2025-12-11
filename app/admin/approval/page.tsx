import { createClient } from '@/utils/supabase/server';
import { ApprovalActions } from '@/components/admin/approval-actions';
import { checkAdminAccess } from '@/utils/admin-auth';
import { AlertTriangle } from 'lucide-react';

export default async function AdminApprovalPage() {
    await checkAdminAccess();
    const supabase = await createClient();

    // Fetch pending items
    // Assuming 'status' column exists. If not, this might return empty or error until migration.
    // Fallback logic: if status column keeps failing, we might need to check 'is_active: false' 
    const { data: pendingItems } = await supabase
        .from('items')
        .select(`
            *,
            profiles (full_name, email)
        `)
        // .eq('status', 'pending') // Standard
        .eq('is_active', false) // Fallback for "not active yet"
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Onay Bekleyenler</h2>
                    <p className="text-slate-400">Yayına girmeyi bekleyen {pendingItems?.length || 0} ilan var.</p>
                </div>
            </div>

            {pendingItems?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-xl bg-slate-900/50 text-slate-500">
                    <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Bekleyen ilan yok.</p>
                    <p className="text-sm">Her şey güncel!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingItems?.map((item: any) => (
                        <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col group hover:border-[#001e93] transition-colors">
                            {/* Image Header */}
                            <div className="aspect-video bg-slate-950 relative">
                                {item.image_urls?.[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image_urls[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">NO IMAGE</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>

                                <div className="flex items-center justify-between text-sm border-t border-slate-800 pt-3 mb-4">
                                    <div className="text-slate-300">
                                        <span className="block text-xs text-slate-500">Satıcı</span>
                                        {item.profiles?.full_name || 'Bilinmiyor'}
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs text-slate-500">Fiyat</span>
                                        <span className="font-bold text-green-400">{item.price} ₺</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <ApprovalActions itemId={item.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
