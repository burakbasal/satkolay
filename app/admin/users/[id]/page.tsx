import { createClient } from '@/utils/supabase/server';
import { checkAdminAccess } from '@/utils/admin-auth';
import { notFound } from 'next/navigation';
import { UserActions } from '@/components/admin/user-actions';
import { Shield, Package, MessageSquare, AlertCircle, ExternalLink, Calendar, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
    const { profile: currentAdmin } = await checkAdminAccess();
    const supabase = await createClient();

    // 1. Fetch User Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single();
    if (!profile) return notFound();

    // 2. Fetch Stats (Parallel)
    const [
        { count: itemsCount, data: items },
        { count: messagesCount }, // Placeholder for now
        // { count: logsCount },
    ] = await Promise.all([
        supabase.from('items').select('*', { count: 'exact' }).eq('seller_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('messages').select('*', { count: 'exact' }).or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`), // Assuming messages table
        // supabase.from('activity_logs').select('*', { count: 'exact' }).eq('user_id', profile.id), 
    ]);

    // Mock logs for UI since table might not exist
    const logs = [
        { id: 1, action: 'LOGIN', detail: 'Başarılı giriş yapıldı.', created_at: new Date().toISOString() },
        { id: 2, action: 'ITEM_CREATE', detail: 'Yeni ilan oluşturuldu.', created_at: new Date(Date.now() - 86400000).toISOString() },
    ];

    return (
        <div className="space-y-8">

            {/* HEADER CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-slate-950 shadow-xl">
                        {profile.full_name?.[0] || '?'}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-white tracking-tight">{profile.full_name || 'İsimsiz'}</h1>
                            {profile.role === 'admin' && <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs font-bold border border-purple-500/20">ADMIN</span>}
                            {profile.role === 'moderator' && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/20">MODERATOR</span>}
                            {profile.is_banned && <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-xs font-bold border border-red-500/20">BANNED</span>}
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-sm">
                            <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile.email}</div>
                            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(profile.created_at).toLocaleDateString()}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.city || 'Konum Yok'}</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={`/profile/${profile.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" /> Profil
                    </a>
                    <UserActions
                        userId={profile.id}
                        currentRole={profile.role}
                        isBanned={profile.is_banned || false}
                        currentUserRole={currentAdmin.role}
                    />
                </div>
            </div>

            {/* STATS GRID */}
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
                        <MessageSquare className="w-5 h-5 text-green-500" /> {messagesCount || 0}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Reddedilenler</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" /> 0
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Güven Skoru</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-yellow-500" /> 100
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: TABS CONTAINER */}
                <div className="lg:col-span-2 space-y-6">

                    {/* TABS NAVIGATION (Visual) */}
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-1">
                        <button className="text-blue-400 font-bold border-b-2 border-blue-400 pb-2 text-sm px-1">Genel Bakış & İlanlar</button>
                        <button className="text-slate-400 font-medium hover:text-slate-200 pb-2 text-sm px-1">Mesajlar (Yakında)</button>
                        <button className="text-slate-400 font-medium hover:text-slate-200 pb-2 text-sm px-1">Sistem Logları</button>
                    </div>

                    {/* Items Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-white">Kullanıcının İlanları</h3>
                            <span className="text-xs text-slate-500">{items?.length || 0} adet</span>
                        </div>
                        <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
                            {items && items.length > 0 ? items.map((item: any) => (
                                <Link href={`/item/${item.id}`} target="_blank" key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        {item.image_urls?.[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image_urls[0]} alt="" className="w-12 h-12 rounded bg-slate-950 object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded bg-slate-950 flex items-center justify-center text-xs text-slate-500">Img</div>
                                        )}
                                        <div>
                                            <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.title}</div>
                                            <div className="text-xs text-green-400">{item.price} ₺</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {item.status === 'sold' ? (
                                            <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">SATILDI</span>
                                        ) : item.status === 'active' ? (
                                            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">AKTİF</span>
                                        ) : (
                                            <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded uppercase">{item.status}</span>
                                        )}
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-8 text-center text-slate-500 text-sm">İlan bulunamadı.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: QUICK LOGS */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <h3 className="font-bold text-white">Sicil / Loglar</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-800">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-950"></div>
                                        <div className="text-sm font-bold text-slate-300">{log.action}</div>
                                        <div className="text-xs text-slate-500 mb-1">{new Date(log.created_at).toLocaleString()}</div>
                                        <p className="text-xs text-slate-400">{log.detail}</p>
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
