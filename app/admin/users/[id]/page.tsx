import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function UserSicilPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // Fetch Profile & Items
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single();
    const { data: items } = await supabase.from('items').select('*').eq('user_id', params.id);

    if (!profile) return notFound();

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-200">
            {/* Header Bar */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/admin/users" className="flex items-center text-slate-400 hover:text-white transition-colors">
                    &larr; Kullanıcı Listesine Dön
                </Link>
                <h1 className="text-xl font-bold text-slate-100">Kullanıcı Sicil Dosyası</h1>
            </div>

            {/* User Identity Card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <h1 className="text-9xl font-black text-white">USER</h1>
                </div>

                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-700 bg-slate-800 flex items-center justify-center shrink-0">
                    {profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <span className="text-4xl font-bold">{profile.email?.[0]?.toUpperCase()}</span>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <h2 className="text-3xl font-bold text-white mb-1">{profile.full_name || 'İsimsiz Kullanıcı'}</h2>
                    <p className="text-slate-400 font-mono mb-4">{profile.email}</p>
                    <p className="text-xs text-slate-600 font-mono select-all">ID: {profile.id}</p>

                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${profile.role === 'admin' ? 'bg-red-950 border-red-800 text-red-400' :
                                'bg-blue-950 border-blue-800 text-blue-400'
                            }`}>
                            {profile.role || 'USER'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                            {profile.city || 'Konum Belirtilmedi'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats & Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm uppercase font-bold mb-4">İstatistikler</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Toplam İlan</span>
                            <span className="font-bold text-white">{items?.length || 0}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span>Kayıt Tarihi</span>
                            <span className="font-mono text-sm">{new Date(profile.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm uppercase font-bold mb-4">İlan Geçmişi</h3>
                    {items && items.length > 0 ? (
                        <div className="space-y-3">
                            {items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors group">
                                    <div className="w-12 h-12 bg-slate-800 rounded overflow-hidden relative">
                                        {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                        <p className="text-slate-500 text-xs">{item.price} TL</p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded uppercase ${item.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'
                                        }`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">Henüz ilan kaydı yok.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
