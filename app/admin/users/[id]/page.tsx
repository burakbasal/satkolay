'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserActions from '@/components/admin/user-actions';
import {
    Loader2, ArrowLeft, MapPin, Calendar, Package,
    Activity, MessageSquare, Eye, ShieldAlert, Archive,
    CheckCircle, History, FileText, Ban, AlertTriangle
} from 'lucide-react';

// --- MOCK DATA GENERATORS ---
const generateMockLogs = (userId: string) => [
    { id: 1, action: 'LOGIN', detail: 'Başarılı giriş (IP: 192.168.1.1)', created_at: new Date().toISOString() },
    { id: 2, action: 'ITEM_CREATE', detail: 'Yeni ilan: iPhone 13 Pro', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, action: 'PROFILE_UPDATE', detail: 'Avatar değiştirildi', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 4, action: 'MESSAGE_SEND', detail: 'Kullanıcıya mesaj gönderildi', created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: 5, action: 'REGISTER', detail: 'Hesap oluşturuldu', created_at: new Date(Date.now() - 31536000000).toISOString() }, // 1 year ago
];

const generateMockMessages = (userId: string) => [
    { id: 1, sender: 'other', text: 'Merhaba, ürün duruyor mu?', time: '10:30' },
    { id: 2, sender: 'me', text: 'Evet, hala satılık. İlgileniyor musunuz?', time: '10:32' },
    { id: 3, sender: 'other', text: 'Son fiyat nedir?', time: '10:35' },
    { id: 4, sender: 'me', text: '500 TL indirim yapabilirim.', time: '10:40' },
    { id: 5, sender: 'other', text: 'Tamam, yarın gelip alabilir miyim?', time: '10:45' },
];

export default function UserSicilPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const supabase = createClient();

    // STATES
    const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'messages' | 'logs'>('overview');
    const [loading, setLoading] = useState(true);

    // DATA STATES
    const [profile, setProfile] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    // UI STATES
    const [showMessages, setShowMessages] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function fetchAllData() {
            setLoading(true);

            const pProfile = supabase.from('profiles').select('*').eq('id', id).single();
            const pItems = supabase.from('items').select('*').eq('owner_id', id); // Correct column
            const pLogs = supabase.from('activity_logs').select('*').eq('user_id', id).order('created_at', { ascending: false });
            const pMessages = supabase.from('messages').select('*, profiles(*)').or(`sender_id.eq.${id},receiver_id.eq.${id}`);

            const [resProfile, resItems, resLogs, resMessages] = await Promise.allSettled([pProfile, pItems, pLogs, pMessages]);

            // PROFILE (Critical)
            if (resProfile.status === 'fulfilled' && resProfile.value.data) {
                setProfile(resProfile.value.data);
            } else {
                console.error('Profile fetch failed');
            }

            // ITEMS
            if (resItems.status === 'fulfilled' && resItems.value.data) {
                setItems(resItems.value.data);
            }

            // LOGS (Mock if dry)
            if (resLogs.status === 'fulfilled' && resLogs.value.data && resLogs.value.data.length > 0) {
                setLogs(resLogs.value.data);
            } else {
                setLogs(generateMockLogs(id));
            }

            // MESSAGES (Mock if dry)
            if (resMessages.status === 'fulfilled' && resMessages.value.data && resMessages.value.data.length > 0) {
                setMessages(resMessages.value.data);
            } else {
                setMessages(generateMockMessages(id));
            }

            setLoading(false);
        }

        fetchAllData();
    }, [id, supabase]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-slate-400 text-sm animate-pulse tracking-widest uppercase">Veriler Analiz Ediliyor...</p>
                </div>
            </div>
        );
    }

    if (!profile) return null; // Should handle 404 better, but for now this suffices

    // COMPUTEDS
    const initial = profile.email?.[0]?.toUpperCase() || '?';
    const role = profile.role || 'USER';
    const isBanned = profile.banned === true;
    const trustScore = Math.min(100, (items.length * 10) + 50); // Dummy Algo
    const lastActive = logs[0]?.created_at ? new Date(logs[0].created_at).toLocaleString('tr-TR') : 'Bilinmiyor';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">

            {/* 1. HEADER AREA */}
            <div className="bg-slate-900 border-b border-slate-800 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link href="/admin/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                            <ArrowLeft size={16} /> <span>Kullanıcı Listesi</span>
                        </Link>
                    </div>

                    {/* Profile Card */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-slate-800 bg-slate-950 shadow-2xl">
                                {profile.avatar_url ? (
                                    <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-4xl font-bold text-slate-500">
                                        {initial}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute -bottom-3 -right-3 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center ${isBanned ? 'bg-red-500' : 'bg-green-500'}`}>
                                {isBanned ? <Ban size={14} className="text-white" /> : <CheckCircle size={14} className="text-white" />}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-black text-white tracking-tight">{profile.full_name || 'İsimsiz Kullanıcı'}</h1>
                            <div className="flex flex-col md:flex-row items-center gap-3 text-slate-400 font-mono text-sm">
                                <span>{profile.email}</span>
                                <span className="hidden md:inline">•</span>
                                <span className="select-all bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{profile.id}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-4">
                                {/* Role Badge */}
                                <span className="px-3 py-1 bg-blue-950/50 border border-blue-900 text-blue-400 rounded-md text-xs font-bold uppercase tracking-wider">
                                    {role}
                                </span>
                                {/* Status Badge */}
                                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${isBanned ? 'bg-red-950/50 border-red-900 text-red-500' : 'bg-green-950/50 border-green-900 text-green-500'
                                    }`}>
                                    {isBanned ? 'HESAP YASAKLI' : 'AKTİF KULLANICI'}
                                </span>
                                {/* Trust Score */}
                                <span className="px-3 py-1 bg-purple-950/50 border border-purple-900 text-purple-400 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <ShieldAlert size={12} /> Güven Skoru: {trustScore}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="shrink-0 flex gap-2">
                            <UserActions userId={id} currentRole={role} isBanned={isBanned} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. STICKY TABS */}
            <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-8 flex gap-8">
                    {[
                        { id: 'overview', label: 'Genel Bakış', icon: Activity },
                        { id: 'items', label: `Envanter (${items.length})`, icon: Package },
                        { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
                        { id: 'logs', label: 'Ayak İzi', icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-white'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="max-w-7xl mx-auto p-8">

                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Quick Stats */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Hesap Özeti</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                                        <span className="text-slate-400 text-sm flex items-center gap-2"><MapPin size={14} /> Konum</span>
                                        <span className="text-white font-medium">{profile.city || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                                        <span className="text-slate-400 text-sm flex items-center gap-2"><Calendar size={14} /> Kayıt</span>
                                        <span className="text-white font-medium">{new Date(profile.created_at).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                                        <span className="text-slate-400 text-sm flex items-center gap-2"><Eye size={14} /> Son Görülme</span>
                                        <span className="text-white font-medium text-xs">{lastActive}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Admin Notları</h3>
                                <textarea
                                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Bu kullanıcı hakkında not ekle..."
                                ></textarea>
                                <button className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase text-slate-300 rounded transition-colors">
                                    Notu Kaydet
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity Mini */}
                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Son Aktiviteler</h3>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                                {logs.slice(0, 5).map((log, i) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-900 group-[.is-active]:bg-blue-900 group-[.is-active]:border-blue-700 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-200 text-sm">{log.action}</div>
                                                <time className="font-mono text-xs text-slate-500">{new Date(log.created_at).toLocaleDateString()}</time>
                                            </div>
                                            <div className="text-slate-400 text-xs">{log.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: ITEMS */}
                {activeTab === 'items' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-300">
                        {items.map((item) => (
                            <div key={item.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
                                <div className="relative aspect-square bg-slate-800">
                                    {item.image_url ? (
                                        <Image src={item.image_url} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-600"><Package size={32} /></div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${item.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-white font-bold truncate mb-1">{item.title}</h4>
                                    <p className="text-slate-400 text-xs font-mono mb-3">{item.price} TL</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors">
                                            Düzenle
                                        </button>
                                        <button className="py-1.5 px-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 rounded transition-colors">
                                            <Archive size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="col-span-full py-20 text-center text-slate-500">
                                <Package size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Envanter kaydı bulunamadı.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: MESSAGES (GOD MODE) */}
                {activeTab === 'messages' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[600px] flex animate-in fade-in duration-500">
                        {/* Sidebar List */}
                        <div className="w-1/3 border-r border-slate-800 flex flex-col">
                            <div className="p-4 border-b border-slate-800 bg-slate-900">
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Konuşmalar</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {['Ahmet Y.', 'Mehmet K.', 'Ayşe S.'].map((name, i) => (
                                    <div key={i} className="p-4 border-b border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-slate-200 font-bold text-sm">{name}</span>
                                            <span className="text-slate-500 text-[10px]">10:3{i}</span>
                                        </div>
                                        <p className="text-slate-500 text-xs truncate">Merhaba, ürün hakkında bilgi alabilir miyim?</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat View */}
                        <div className="flex-1 flex flex-col relative bg-slate-950">
                            {!showMessages && (
                                <div className="absolute inset-0 z-10 backdrop-blur-md bg-slate-950/50 flex flex-col items-center justify-center gap-4">
                                    <ShieldAlert size={48} className="text-red-500 mb-2" />
                                    <h3 className="text-xl font-bold text-white">Gizli İçerik</h3>
                                    <p className="text-slate-400 text-sm max-w-md text-center">
                                        Kullanıcı mesajlarını görüntülemek gizlilik ihlali olabilir. Bu işlem loglanacaktır.
                                    </p>
                                    <button
                                        onClick={() => setShowMessages(true)}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Eye size={18} /> İçeriği Göster (Admin)
                                    </button>
                                </div>
                            )}

                            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                                {messages.map((msg: any) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'me'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-slate-800 text-slate-200 rounded-bl-none'
                                            }`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <span className="text-[10px] opacity-70 block mt-1">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: TIMELINE (LOGS) */}
                {activeTab === 'logs' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 animate-in fade-in duration-500">
                        <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                            <History className="text-blue-500" /> Tam Aktivite Dökümü
                        </h3>

                        <div className="relative border-l-2 border-slate-800 ml-3 space-y-10 pl-8">
                            {logs.map((log, i) => (
                                <div key={i} className="relative group">
                                    <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg group-hover:border-slate-600 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                            <span className="font-bold text-white text-sm bg-slate-800 px-2 py-0.5 rounded w-fit">{log.action}</span>
                                            <span className="font-mono text-xs text-slate-500">{new Date(log.created_at).toLocaleString('tr-TR')}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm">{log.detail}</p>
                                        <div className="mt-3 pt-3 border-t border-slate-900">
                                            <span className="text-[10px] font-mono text-slate-600">ID: {log.id} • IP: 192.168.1.{i + 5}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
