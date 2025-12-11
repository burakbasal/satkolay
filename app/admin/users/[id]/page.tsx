import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const userId = params.id;

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    const { data: items } = await supabase.from('items').select('*').eq('seller_id', userId);

    if (!profile) return notFound();

    return (
        <div className="p-8 space-y-8 text-slate-200">
            {/* Header & Actions */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-3xl font-bold text-white relative overflow-hidden">
                        {profile.avatar_url ? (
                            <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                        ) : (
                            (profile.email?.[0] || '?').toUpperCase()
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{profile.full_name || 'İsimsiz'}</h1>
                        <p className="text-slate-400 font-mono text-sm">{profile.id}</p>
                        <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${profile.role === 'admin' ? 'bg-red-900 text-red-200' :
                                    profile.role === 'moderator' ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-300'
                                }`}>{profile.role || 'USER'}</span>
                            <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${profile.is_banned ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                                }`}>
                                {profile.is_banned ? 'Yasaklı' : 'Aktif'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/users" className="bg-slate-800 px-4 py-2 rounded text-sm hover:bg-slate-700 font-medium transition-colors">
                        &larr; Geri Dön
                    </Link>
                    {/* Add functional buttons here later */}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 text-xs uppercase font-bold">Toplam İlan</h3>
                    <p className="text-2xl font-bold text-white mt-1">{items?.length || 0}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 text-xs uppercase font-bold">Şehir</h3>
                    <p className="text-lg font-medium text-white mt-1">{profile.city || 'Belirtilmedi'}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 text-xs uppercase font-bold">Kayıt Tarihi</h3>
                    <p className="text-sm font-medium text-white mt-2">{new Date(profile.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
            </div>

            {/* Item List */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 className="font-bold text-white mb-4">Kullanıcının İlanları</h3>
                <div className="space-y-2">
                    {items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between p-3 bg-slate-950/50 rounded border border-slate-800/50">
                            <span className="text-slate-300">{item.title}</span>
                            <span className="text-sm font-bold text-emerald-400">{item.price} TL</span>
                        </div>
                    ))}
                    {items?.length === 0 && <p className="text-slate-500">İlan bulunamadı.</p>}
                </div>
            </div>

        </div>
    );
}
