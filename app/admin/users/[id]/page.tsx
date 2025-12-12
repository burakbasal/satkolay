import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserActions from '@/components/admin/user-actions';

export const dynamic = 'force-dynamic';

export default async function UserSicilPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // 1. Fetch Data
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single();
    const { data: items } = await supabase.from('items').select('*').eq('user_id', params.id);

    if (!profile) return notFound();

    // 2. SANITIZE DATA (CRITICAL STEP)
    // Convert everything to string to prevent #419 error
    const userId = String(profile.id);
    const fullName = profile.full_name ? String(profile.full_name) : 'İsimsiz Kullanıcı';
    const email = profile.email ? String(profile.email) : 'E-posta yok';
    const role = profile.role ? String(profile.role).toUpperCase() : 'USER';
    const city = profile.city ? String(profile.city) : 'Konum Yok';
    const joinedAt = profile.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : '-';
    const avatarUrl = profile.avatar_url ? String(profile.avatar_url) : null;
    const initial = email[0] ? email[0].toUpperCase() : '?';
    const isBanned = profile.banned === true; // Strict boolean

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-200">
            <div className="flex items-center justify-between mb-6">
                <Link href="/admin/users" className="text-slate-400 hover:text-white transition-colors text-sm">
                    &larr; Listeye Dön
                </Link>
                <span className="text-slate-500 text-sm font-mono">{userId}</span>
            </div>

            {/* Profile Card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 shrink-0 flex items-center justify-center">
                    {avatarUrl ? (
                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-500">{initial}</span>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-bold text-white">{fullName}</h1>
                    <p className="text-slate-400 font-mono">{email}</p>
                    <div className="flex gap-2 pt-2">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-900 rounded-full text-xs font-bold">
                            {role}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isBanned ? 'bg-red-900/30 text-red-400 border-red-900' : 'bg-green-900/30 text-green-400 border-green-900'}`}>
                            {isBanned ? 'YASAKLI' : 'AKTİF'}
                        </span>
                    </div>
                </div>

                {/* Client Component for Interactions */}
                <UserActions userId={userId} currentRole={role} isBanned={isBanned} />
            </div>

            {/* Stats & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
                    <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-wider">Bilgiler</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Şehir</span>
                            <span className="text-white">{city}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Kayıt</span>
                            <span className="text-white font-mono">{joinedAt}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white">İlanlar ({items?.length || 0})</h3>
                    {items && items.length > 0 ? (
                        <div className="grid gap-3">
                            {items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                                    {/* Ensure item props are also strings */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium truncate">{item.title ? String(item.title) : 'Başlıksız'}</h4>
                                        <p className="text-slate-400 text-sm">{item.price ? String(item.price) : '0'} TL</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300 uppercase">
                                        {item.status ? String(item.status) : '-'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
                            İlan kaydı yok.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
