import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const userId = params.id;

    // 1. Fetch Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!profile) return notFound();

    // 2. Fetch Items
    const { data: items } = await supabase.from('items').select('*').eq('seller_id', userId).order('created_at', { ascending: false });

    return (
        <div className="p-8 space-y-8 text-slate-200">
            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-white overflow-hidden relative border-4 border-slate-800 shadow-xl">
                        {profile.avatar_url ? (
                            <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                        ) : (
                            (profile.email?.[0] || '?').toUpperCase()
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{profile.full_name || 'İsimsiz Kullanıcı'}</h1>
                        <p className="text-slate-400 font-mono text-sm">{profile.id}</p>
                        <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${profile.role === 'admin' ? 'bg-purple-900 text-purple-200' :
                                    profile.role === 'moderator' ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-300'
                                }`}>{profile.role || 'USER'}</span>
                            <span className="bg-emerald-900 text-emerald-200 text-xs px-2 py-1 rounded uppercase font-bold">{profile.city || 'Konum Yok'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* Actions - Future Client Component Injection */}
                    <button className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 px-4 py-2 rounded-lg font-medium transition-all">
                        {profile.banned ? 'Yasağı Kaldır' : 'Kullanıcıyı Yasakla'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-1">Toplam İlan</h3>
                    <p className="text-3xl font-black text-white">{items?.length || 0}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-1">Kayıt Tarihi</h3>
                    <p className="text-xl font-bold text-white">{new Date(profile.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
                {/* Extended Stats Placeholder */}
            </div>

            {/* Items Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">İlan Geçmişi</h2>
                    <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded">{items?.length || 0} İlan</span>
                </div>

                {(!items || items.length === 0) ? (
                    <div className="text-center py-10 text-slate-500 bg-slate-950/50 rounded-lg border border-slate-800 border-dashed">
                        Bu kullanıcının henüz ilanı yok.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-950/30 border border-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500 shrink-0 overflow-hidden relative">
                                        {item.image_urls?.[0] ? (
                                            <Image src={item.image_urls[0]} alt="" fill className="object-cover" />
                                        ) : 'IMG'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">{item.title}</div>
                                        <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-emerald-400 font-bold">{item.price?.toLocaleString()} ₺</div>
                                    <div className={`text-[10px] font-bold uppercase mt-1 ${item.status === 'active' ? 'text-emerald-500' :
                                            item.status === 'sold' ? 'text-slate-500' : 'text-yellow-500'
                                        }`}>{item.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
