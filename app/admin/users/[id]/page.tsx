'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserActions from '@/components/admin/user-actions';
import { Loader2, ArrowLeft, MessageSquare, Save, Shield, Clock, Archive, FileText, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function UserSicilPage() {
    const params = useParams();
    const id = params?.id as string;
    const supabase = createClient();
    const router = useRouter();

    // Data States
    const [profile, setProfile] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);

    // UI States
    const [loading, setLoading] = useState(true);
    const [adminNote, setAdminNote] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'messages' | 'logs'>('overview');
    const [selectedChatPartner, setSelectedChatPartner] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            setLoading(true);

            // 1. Profile
            const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (p) {
                setProfile(p);
                setAdminNote(p.admin_notes || '');
            }

            // 2. Items
            const { data: i } = await supabase.from('items').select('*').eq('owner_id', id).order('created_at', { ascending: false });
            setItems(i || []);

            // 3. Real Logs (No Fakes)
            const { data: l } = await supabase.from('activity_logs').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(20);
            setLogs(l || []);

            // 4. Real Messages (Complex Query)
            const { data: m } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${id},receiver_id.eq.${id}`)
                .order('created_at', { ascending: true });
            setMessages(m || []);

            setLoading(false);
        }

        fetchData();
    }, [id, supabase]);

    // --- Logic: Group Messages by Conversation ---
    const conversations = useMemo(() => {
        const groups: Record<string, any[]> = {};
        messages.forEach(msg => {
            const partnerId = msg.sender_id === id ? msg.receiver_id : msg.sender_id;
            if (!groups[partnerId]) groups[partnerId] = [];
            groups[partnerId].push(msg);
        });
        return groups;
    }, [messages, id]);

    // --- Logic: Save Admin Note ---
    const handleSaveNote = async () => {
        setSavingNote(true);
        const { error } = await supabase
            .from('profiles')
            .update({ admin_notes: adminNote })
            .eq('id', id);

        if (error) toast.error('Not kaydedilemedi');
        else toast.success('Admin notu güncellendi');
        setSavingNote(false);
    };

    // --- Logic: Trust Score ---
    const trustScore = useMemo(() => {
        if (!profile) return 0;
        const itemPoints = items.length * 5;
        const daysOld = (new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 3600 * 24);
        const agePoints = Math.floor(daysOld / 30) * 2; // 2 points per month
        return Math.min(itemPoints + agePoints + 10, 100); // Base 10, Max 100
    }, [profile, items]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    if (!profile) return <div className="p-10 text-slate-400">Kullanıcı bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">
            {/* 1. TOP HEADER & NAVIGATION */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/users" className="p-2 hover:bg-slate-800 rounded-full transition"><ArrowLeft size={20} /></Link>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                                {profile.email[0].toUpperCase()}
                            </div>
                            <h1 className="font-bold text-white">{profile.full_name || 'İsimsiz'}</h1>
                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${profile.banned ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                                {profile.banned ? 'Yasaklı' : 'Aktif'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {['overview', 'items', 'messages', 'logs'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tab === 'overview' ? 'Genel Bakış' :
                                    tab === 'items' ? `Envanter (${items.length})` :
                                        tab === 'messages' ? `Mesajlar` : 'Ayak İzi'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* TAB: GENEL BAKIŞ */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Identity & Score */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">Güven Skoru</p>
                                        <h2 className={`text-5xl font-black ${trustScore > 70 ? 'text-green-500' : trustScore > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {trustScore}
                                        </h2>
                                    </div>
                                    <Shield size={48} className="text-slate-800" />
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Rol</span>
                                        <span className="text-white uppercase font-bold">{profile.role}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Konum</span>
                                        <span className="text-white">{profile.city || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Üyelik</span>
                                        <span className="text-white font-mono">{new Date(profile.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <UserActions userId={id} currentRole={profile.role} isBanned={profile.banned} />
                                </div>
                            </div>
                        </div>

                        {/* Middle: Admin Notes (FUNCTIONAL) */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Özel Admin Notu</h3>
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={savingNote}
                                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center gap-1 transition"
                                    >
                                        {savingNote ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Kaydet
                                    </button>
                                </div>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Bu kullanıcı hakkında adminlere özel notlar girin (Örn: Şüpheli davranış, VIP müşteri vb.)"
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-blue-500 resize-none text-sm font-mono"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: ITEMS */}
                {activeTab === 'items' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.length === 0 ? <p className="text-slate-500">İlan yok.</p> : items.map(item => (
                            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
                                <div className="h-40 bg-slate-800 relative">
                                    {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] rounded uppercase font-bold backdrop-blur-sm">
                                        {item.status}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-white truncate">{item.title}</h4>
                                    <p className="text-blue-400 font-mono text-sm">{item.price} TL</p>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                                        <button className="text-xs text-red-400 hover:text-red-300">İlanı Kaldır</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB: MESSAGES (REAL CHAT) */}
                {activeTab === 'messages' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
                        {/* Conversations List */}
                        <div className="border-r border-slate-800 overflow-y-auto">
                            {Object.keys(conversations).length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">Mesaj geçmişi yok.</div>
                            ) : (
                                Object.keys(conversations).map(partnerId => (
                                    <div
                                        key={partnerId}
                                        onClick={() => setSelectedChatPartner(partnerId)}
                                        className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition ${selectedChatPartner === partnerId ? 'bg-slate-800' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                                <MessageSquare size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate">Kullanıcı: {partnerId.substring(0, 6)}...</p>
                                                <p className="text-xs text-slate-500 truncate">{conversations[partnerId].length} mesaj</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Chat Content */}
                        <div className="md:col-span-2 bg-slate-950 flex flex-col">
                            {selectedChatPartner ? (
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {conversations[selectedChatPartner].map((msg: any) => {
                                        const isMe = msg.sender_id === id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-3 rounded-xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                                                    <p>{msg.content}</p>
                                                    <span className="text-[10px] opacity-50 block mt-1 text-right">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                                    Görüntülemek için bir sohbet seçin.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: LOGS (REAL) */}
                {activeTab === 'logs' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Activity size={20} /> Dijital Ayak İzi</h3>
                        {logs.length === 0 ? (
                            <p className="text-slate-500 italic">Kayıtlı aktivite bulunamadı.</p>
                        ) : (
                            <div className="relative border-l border-slate-800 ml-3 space-y-6">
                                {logs.map((log) => (
                                    <div key={log.id} className="pl-6 relative">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border border-slate-900"></div>
                                        <p className="text-sm text-white font-medium">{log.action_type}</p>
                                        <p className="text-xs text-slate-500 font-mono mt-1">
                                            {new Date(log.created_at).toLocaleString('tr-TR')}
                                        </p>
                                        {log.details && (
                                            <pre className="mt-2 bg-slate-950 p-2 rounded text-[10px] text-slate-400 overflow-x-auto">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
