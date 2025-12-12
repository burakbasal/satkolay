'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import Link from 'next/link';
import Image from 'next/image';
import UserActions from '@/components/admin/user-actions';
import { Loader2, ArrowLeft, MapPin, Calendar, Package } from 'lucide-react';

export default function UserSicilPage() {
    const params = useParams(); // Get params via Hook
    const id = params?.id as string; // Extract ID safely

    const [profile, setProfile] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        if (!id) return; // Don't fetch if ID is missing

        async function fetchData() {
            try {
                // 1. Fetch Profile
                const { data: userProfile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (profileError) throw profileError;

                // 2. Fetch Items
                const { data: userItems, error: itemsError } = await supabase
                    .from('items')
                    .select('*')
                    .eq('user_id', id);

                if (itemsError) throw itemsError;

                setProfile(userProfile);
                setItems(userItems || []);
            } catch (error) {
                console.error('Veri çekme hatası:', error);
                // Optional: toast.error('Kullanıcı verisi alınamadı');
            } finally {
                setLoading(false); // Stop loading no matter what
            }
        }

        fetchData();
    }, [id, supabase]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-slate-400 text-sm animate-pulse">Sicil Dosyası Hazırlanıyor...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-slate-950 gap-4">
                <h2 className="text-xl text-slate-300">Kullanıcı Bulunamadı</h2>
                <p className="text-slate-500">Aradığınız ID: {id}</p>
                <Link href="/admin/users" className="text-blue-400 hover:underline">Listeye Dön</Link>
            </div>
        );
    }

    // Safe Rendering Variables
    const initial = profile.email?.[0]?.toUpperCase() || '?';
    const role = profile.role || 'USER';
    const isBanned = profile.banned === true;

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-200 font-sans">
            {/* Top Nav */}
            <div className="mb-8">
                <Link href="/admin/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> <span>Kullanıcı Listesine Dön</span>
                </Link>
            </div>

            {/* Main Identity Card */}
            <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-8 overflow-hidden mb-8">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <h1 className="text-9xl font-black text-white tracking-tighter">SICIL</h1>
                </div>

                {/* Avatar Area */}
                <div className="relative z-10 shrink-0">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden shadow-lg">
                        {profile.avatar_url ? (
                            <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                        ) : (
                            <span className="text-5xl font-bold text-slate-600">{initial}</span>
                        )}
                    </div>
                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-slate-900 ${isBanned ? 'bg-red-500' : 'bg-green-500'}`}></div>
                </div>

                {/* Info Area */}
                <div className="flex-1 text-center md:text-left z-10 space-y-3">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">{profile.full_name || 'İsimsiz Kullanıcı'}</h1>
                        <p className="text-slate-400 font-mono text-sm mt-1">{profile.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <span className="text-xs text-slate-600 font-mono bg-slate-950 px-2 py-0.5 rounded select-all" title="Click to copy">{profile.id}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                        <span className="px-4 py-1.5 bg-blue-900/20 border border-blue-900 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                            {role}
                        </span>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${isBanned ? 'bg-red-900/20 border-red-900 text-red-400' : 'bg-green-900/20 border-green-900 text-green-400'}`}>
                            {isBanned ? 'YASAKLI' : 'AKTİF HESAP'}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="z-10">
                    <UserActions userId={id} currentRole={role} isBanned={isBanned} />
                </div>
            </div>

            {/* Grid Layout for Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Info */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Hesap Detayları</h3>
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><MapPin size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Konum</p>
                                    <p className="text-slate-200 font-medium">{profile.city || 'Belirtilmemiş'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><Calendar size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Kayıt Tarihi</p>
                                    <p className="text-slate-200 font-medium font-mono">{new Date(profile.created_at).toLocaleDateString('tr-TR')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><Package size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Toplam İlan</p>
                                    <p className="text-slate-200 font-medium">{items.length} Adet</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Listings */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Package className="text-blue-500" size={20} />
                                İlan Geçmişi
                            </h3>
                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">{items.length}</span>
                        </div>

                        <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
                            {items.length > 0 ? (
                                items.map((item: any) => (
                                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors group">
                                        <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700 shrink-0">
                                            {item.image_url ? (
                                                <Image src={item.image_url} alt="" fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-600"><Package size={20} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                            <p className="text-slate-400 text-sm font-mono">{item.price} TL</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                            <p className="text-slate-600 text-[10px] mt-1">{new Date(item.created_at).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <Package className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-500">Bu kullanıcıya ait ilan bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
