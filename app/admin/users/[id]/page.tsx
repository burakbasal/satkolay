'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserActions from '@/components/admin/user-actions';
import { Loader2 } from 'lucide-react';

export default function UserSicilPage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const { data: userProfile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error || !userProfile) {
                // Handle not found
                return;
            }

            const { data: userItems } = await supabase
                .from('items')
                .select('*')
                .eq('user_id', params.id);

            setProfile(userProfile);
            setItems(userItems || []);
            setLoading(false);
        }

        fetchData();
    }, [params.id, supabase]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 text-center text-slate-400">
                Kullanıcı bulunamadı.{' '}
                <Link href="/admin/users" className="underline hover:text-white">Geri Dön</Link>
            </div>
        );
    }

    // Safe Rendering Variables
    const initial = profile.email?.[0]?.toUpperCase() || '?';
    const role = profile.role || 'USER';
    const isBanned = profile.banned === true;

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/admin/users" className="text-slate-400 hover:text-white transition-colors text-sm">
                    &larr; Listeye Dön
                </Link>
                <span className="text-slate-500 text-sm font-mono">{profile.id}</span>
            </div>

            {/* Identity Card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 shrink-0 flex items-center justify-center">
                    {profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-500">{initial}</span>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white">{profile.full_name || 'İsimsiz'}</h1>
                    <p className="text-slate-400 font-mono">{profile.email}</p>
                    <div className="flex justify-center md:justify-start gap-2 mt-3">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-900 rounded-full text-xs font-bold uppercase">
                            {role}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${isBanned ? 'bg-red-900/30 text-red-400 border-red-900' : 'bg-green-900/30 text-green-400 border-green-900'}`}>
                            {isBanned ? 'YASAKLI' : 'AKTİF'}
                        </span>
                    </div>
                </div>

                {/* Actions Component */}
                <UserActions userId={profile.id} currentRole={role} isBanned={isBanned} />
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-500 text-xs font-bold uppercase mb-4">Bilgiler</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Şehir</span>
                            <span className="text-white">{profile.city || '-'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-400">Kayıt</span>
                            <span className="text-white font-mono">
                                {new Date(profile.created_at).toLocaleDateString('tr-TR')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-white">İlanlar ({items.length})</h3>
                    {items.length > 0 ? (
                        items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded overflow-hidden relative">
                                        {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{item.title}</h4>
                                        <p className="text-slate-400 text-xs">{item.price} TL</p>
                                    </div>
                                </div>
                                <span className="text-xs uppercase bg-slate-800 px-2 py-1 rounded text-slate-300">
                                    {item.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">İlan kaydı yok.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
