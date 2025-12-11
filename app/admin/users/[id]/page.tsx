import { createClient } from '@/utils/supabase/server';
import { checkAdminAccess } from '@/utils/admin-auth';
import { notFound } from 'next/navigation';
import { UserActions } from '@/components/admin/user-actions';
import { Shield, Package, MessageSquare, AlertCircle, ExternalLink, Calendar, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
    // Await params for Next.js 15+ if needed, but params is usually available props
    const userId = params.id;

    // Admin Access Check
    const { profile: currentAdmin } = await checkAdminAccess();

    const supabase = await createClient();

    // 1. Fetch User Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!profile) return notFound();

    // 2. Fetch Stats & Activity
    const { count: itemsCount, data: items } = await supabase.from('items')
        .select('*', { count: 'exact' })
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false });

    // Try fetch messages if table exists (placeholder)
    // const { count: messagesCount } = await supabase.from('messages').select('*', { count: 'exact' }).or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
    const messagesCount = 0;

    // Fetch Logs if table exists
    // const { data: logs } = await supabase.from('activity_logs').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });

    // Mock Logs until implementation
    const logs = [
        { id: '1', action: 'KAYIT', detail: 'Sisteme kayıt oldu.', created_at: profile.created_at },
        { id: '2', action: 'GİRİŞ', detail: 'Başarılı giriş işlemi.', created_at: new Date().toISOString() },
    ];

    return (
        <div className="space-y-8">
            {/* --- HEADER --- */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-slate-950 shadow-xl shrink-0">
                        {(profile.full_name?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h1 className="text-3xl font-black text-white tracking-tight">{profile.full_name || 'İsimsiz'}</h1>
                            {profile.role === 'admin' && <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs font-bold border border-purple-500/20 flex items-center gap-1"><Shield className="w-3 h-3" /> ADMIN</span>}
                            {profile.role === 'moderator' && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/20 flex items-center gap-1"><Shield className="w-3 h-3" /> MODERATOR</span>}
                            {profile.is_banned && <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-xs font-bold border border-red-500/20">BANNED</span>}
                        </div>
                        <div className="flex items-center flex-wrap gap-4 text-slate-400 text-sm">
                            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded"><Mail className="w-3.5 h-3.5" /> {profile.email}</div>
                            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(profile.created_at).toLocaleDateString()}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.city || 'Konum Yok'}</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <a
                        href={`/profile/${profile.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border border-slate-700"
                    >
                        <ExternalLink className="w-4 h-4" /> Profili Gör
                    </a>
                    {/* Inject Client Component for Actions */}
                    <UserActions
                        user={profile}
                        currentUserRole={currentAdmin.role}
                    />
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Toplam İlan</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-500" /> {itemsCount || 0}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Mesajlar</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-500" /> {messagesCount}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">İhlaller</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" /> 0
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl opacity-50">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Güven Skoru</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-yellow-500" /> 100
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- LEFT COLUMN: LISTINGS --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-white flex items-center gap-2"><Package className="w-4 h-4 text-blue-500" /> İlan Geçmişi</h3>
                            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">{items?.length || 0}</span>
                        </div>
                        <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                            {items && items.length > 0 ? items.map((item: any) => (
                                <Link href={`/item/${item.id}`} target="_blank" key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center text-xs text-slate-600 overflow-hidden relative">
                                            {item.image_urls?.[0] ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.image_urls[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-5 h-5 opacity-20" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">{item.title}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                                <span>{item.price?.toLocaleString()} ₺</span>
                                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {item.status === 'sold' ? (
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded">SATILDI</span>
                                        ) : item.status === 'active' ? (
                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded">AKTİF</span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded uppercase">{item.status}</span>
                                        )}
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-12 text-center text-slate-500 text-sm">
                                    <Package className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    Bu kullanıcının henüz ilanı yok.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: LOGS --- */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-500" />
                            <h3 className="font-bold text-white">Sicil Kaydı</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-6 relative ml-2 before:absolute before:inset-y-0 before:left-1.5 before:w-0.5 before:bg-slate-800">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative pl-8">
                                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-700 z-10"></div>
                                        <div className="text-sm font-bold text-slate-300">{log.action}</div>
                                        <div className="text-xs text-slate-500 mb-1 font-mono">{new Date(log.created_at).toLocaleString()}</div>
                                        <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/30 p-2 rounded border border-slate-800/50">{log.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
