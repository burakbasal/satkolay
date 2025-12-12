import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserActions from '@/components/admin/user-actions';

export const dynamic = 'force-dynamic';

export default async function UserSicilPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // 1. Safe Data Fetching
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single();
    const { data: items } = await supabase.from('items').select('*').eq('user_id', params.id);

    if (!profile) return notFound();

    // 2. Safe Variable Preparation (Prevent React #419)
    const displayName = profile.full_name || 'İsimsiz Kullanıcı';
    const displayEmail = profile.email || 'E-posta yok';
    const displayRole = profile.role || 'user';
    const displayCity = profile.city || 'Konum Belirtilmedi';
    const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : '-';
    const isBanned = profile.banned === true; // Boolean check

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/admin/users" className="text-slate-400 hover:text-white transition-colors text-sm">
                    &larr; Listeye Dön
                </Link>
                <span className="text-slate-500 text-sm font-mono">{params.id}</span>
            </div>

            {/* Profile Card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 shrink-0">
                    {profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">
                            {displayEmail[0]?.toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-bold text-white">{displayName}</h1>
                    <p className="text-slate-400 font-mono">{displayEmail}</p>
                    <div className="flex gap-2 pt-2">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-900 rounded-full text-xs font-bold uppercase">
                            {displayRole}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${isBanned ? 'bg-red-900/30 text-red-400 border-red-900' : 'bg-green-900/30 text-green-400 border-green-900'}`}>
                            {isBanned ? 'YASAKLI' : 'AKTİF'}
                        </span>
                    </div>
                </div>

                {/* INTERACTIVE ACTIONS */}
                <UserActions userId={params.id} currentRole={displayRole} isBanned={isBanned} />
            </div>

            {/* Stats & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar Stats */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
                    <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-wider">Kullanıcı Bilgileri</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Konum</span>
                            <span className="text-white">{displayCity}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Kayıt Tarihi</span>
                            <span className="text-white font-mono">{joinDate}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Toplam İlan</span>
                            <span className="text-white font-bold">{items?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content (Items) */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white">İlan Geçmişi</h3>
                    {items && items.length > 0 ? (
                        <div className="grid gap-3">
                            {items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-colors">
                                    <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden relative shrink-0">
                                        {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium truncate">{item.title}</h4>
                                        <p className="text-slate-400 text-sm">{item.price} TL</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300 uppercase">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
                            İlan kaydı bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
