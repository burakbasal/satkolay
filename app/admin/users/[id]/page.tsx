'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Loader2, ArrowLeft, MessageSquare, Save, Shield, Clock, Archive,
    FileText, Activity, MapPin, Calendar, DollarSign, Trash2,
    Ban, CheckCircle, UserCog, History, Eye, ShieldAlert,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// --- TYPES ---
type Profile = {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    role: string;
    banned: boolean;
    city: string | null;
    admin_notes: string | null;
    created_at: string;
};

type Item = {
    id: number;
    title: string;
    price: number;
    image_url: string | null;
    status: string;
    created_at: string;
};

type Log = {
    id: number;
    action_type: string;
    details: any;
    created_at: string;
};

type Message = {
    id: number;
    content: string;
    sender_id: string;
    receiver_id: string;
    created_at: string;
};

export default function UserSicilPage() {
    const params = useParams();
    const id = params?.id as string;
    const supabase = createClient();
    const router = useRouter();

    // --- STATES ---
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);

    // UI States
    const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'messages' | 'logs'>('overview');
    const [adminNote, setAdminNote] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [selectedChatPartner, setSelectedChatPartner] = useState<string | null>(null);
    const [updatingRole, setUpdatingRole] = useState(false);

    // --- FETCHING ---
    useEffect(() => {
        if (!id) return;

        async function fetchAllData() {
            setLoading(true);

            // A. Profile (Critical)
            const pProfile = supabase.from('profiles').select('*').eq('id', id).single();

            // B. Items (Resilient) - using owner_id
            const pItems = supabase.from('items').select('*').eq('owner_id', id).order('created_at', { ascending: false });

            // C. Logs (Resilient)
            const pLogs = supabase.from('activity_logs').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(50);

            // D. Messages (Resilient)
            const pMessages = supabase.from('messages').select('*').or(`sender_id.eq.${id},receiver_id.eq.${id}`).order('created_at', { ascending: true });

            const [resProfile, resItems, resLogs, resMessages] = await Promise.allSettled([pProfile, pItems, pLogs, pMessages]);

            // Handle Profile
            if (resProfile.status === 'fulfilled' && resProfile.value.data) {
                setProfile(resProfile.value.data);
                setAdminNote(resProfile.value.data.admin_notes || '');
            } else {
                toast.error('Kullanıcı profili yüklenemedi.');
            }

            // Handle Others
            if (resItems.status === 'fulfilled' && resItems.value.data) setItems(resItems.value.data);
            if (resLogs.status === 'fulfilled' && resLogs.value.data) setLogs(resLogs.value.data);
            if (resMessages.status === 'fulfilled' && resMessages.value.data) setMessages(resMessages.value.data);

            setLoading(false);
        }

        fetchAllData();
    }, [id, supabase]);

    // --- ACTIONS ---

    const handleSaveNote = async () => {
        setSavingNote(true);
        const { error } = await supabase.from('profiles').update({ admin_notes: adminNote }).eq('id', id);
        if (error) toast.error('Hata: Not kaydedilemedi');
        else toast.success('Admin notu güncellendi');
        setSavingNote(false);
    };

    const handleToggleBan = async () => {
        if (!profile) return;
        const newState = !profile.banned;
        const { error } = await supabase.from('profiles').update({ banned: newState }).eq('id', id);

        if (error) {
            toast.error('Ban işlemi başarısız');
        } else {
            setProfile({ ...profile, banned: newState });
            toast.success(newState ? 'Kullanıcı yasaklandı' : 'Yasak kaldırıldı');
            // Create Log
            await supabase.from('activity_logs').insert({ user_id: id, action_type: newState ? 'ADMIN_BAN' : 'ADMIN_UNBAN', details: { admin: 'god_mode' } });
        }
    };

    const handleUpdateRole = async (newRole: string) => {
        if (!profile) return;
        setUpdatingRole(true);
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);

        if (error) {
            toast.error('Rol güncellenemedi');
        } else {
            setProfile({ ...profile, role: newRole });
            toast.success(`Kullanıcı rolü: ${newRole}`);
        }
        setUpdatingRole(false);
    };

    const handleDeleteItem = async (itemId: number) => {
        if (!confirm('Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?')) return;

        const { error } = await supabase.from('items').delete().eq('id', itemId);
        if (error) {
            toast.error('Silme başarısız');
        } else {
            setItems(prev => prev.filter(i => i.id !== itemId));
            toast.success('İlan silindi');
        }
    };

    // --- COMPUTED DATA ---

    const trustScore = useMemo(() => {
        if (!profile) return 0;
        const monthsOld = (new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 3600 * 24 * 30);
        const score = (items.length * 5) + (monthsOld * 2);
        return Math.min(Math.floor(score), 100);
    }, [profile, items]);

    const inventoryValue = useMemo(() => {
        return items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    }, [items]);

    const conversations = useMemo(() => {
        const groups: Record<string, Message[]> = {};
        messages.forEach(msg => {
            const partner = msg.sender_id === id ? msg.receiver_id : msg.sender_id;
            if (!groups[partner]) groups[partner] = [];
            groups[partner].push(msg);
        });
        return groups;
    }, [messages, id]);

    // --- RENDER ---

    if (loading) return (
        <div className="flex bg-slate-950 h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Dossier Loading...</p>
            </div>
        </div>
    );

    if (!profile) return (
        <div className="bg-slate-950 h-screen text-slate-400 flex items-center justify-center flex-col gap-4">
            <AlertTriangle size={64} className="text-yellow-600 mb-4" />
            <h1 className="text-2xl font-bold text-white">Profil Bulunamadı</h1>
            <p>İstenen ID veritabanında mevcut değil.</p>
            <Link href="/admin/users" className="text-blue-500 hover:underline">Listeye Dön</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">

            {/* 1. HEADER (IDENTITY) */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Top Row: Nav & Actions */}
                    <div className="flex justify-between items-start mb-6">
                        <Link href="/admin/users" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                            <ArrowLeft size={16} /> Listeye Dön
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-xs font-bold uppercase flex items-center gap-2 transition-colors">
                                    <UserCog size={14} className="text-blue-400" />
                                    {updatingRole ? '...' : profile.role}
                                </button>
                                {/* Role Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden hidden group-hover:block animate-in fade-in zoom-in-95 z-50">
                                    {['user', 'moderator', 'admin'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => handleUpdateRole(r)}
                                            className="w-full text-left px-4 py-2 text-xs hover:bg-slate-700 capitalize transition-colors"
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleToggleBan}
                                className={`px-3 py-1.5 rounded border text-xs font-bold uppercase flex items-center gap-2 transition-colors ${profile.banned
                                        ? 'bg-green-900/30 border-green-900 text-green-400 hover:bg-green-900/50'
                                        : 'bg-red-900/30 border-red-900 text-red-400 hover:bg-red-900/50'
                                    }`}
                            >
                                {profile.banned ? <CheckCircle size={14} /> : <Ban size={14} />}
                                {profile.banned ? 'Yasağı Kaldır' : 'Yasakla'}
                            </button>
                        </div>
                    </div>

                    {/* Identity Card */}
                    <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-800 overflow-hidden shrink-0">
                            {profile.avatar_url ? (
                                <Image src={profile.avatar_url} alt="" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-500">
                                    {profile.email?.[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                {profile.full_name || 'İsimsiz Kullanıcı'}
                                {profile.banned && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">BANNED</span>}
                            </h1>
                            <p className="text-slate-400 font-mono text-sm">{profile.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span
                                    onClick={() => { navigator.clipboard.writeText(id); toast.success('ID Kopyalandı'); }}
                                    className="bg-slate-950 text-slate-500 text-[10px] px-2 py-1 rounded border border-slate-800 cursor-pointer hover:text-white hover:border-slate-600 transition-colors font-mono"
                                    title="Click to copy"
                                >
                                    {id}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                    <MapPin size={12} /> {profile.city || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 mt-8 border-b border-slate-800/50 -mb-4 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Genel Bakış', icon: Activity },
                            { id: 'items', label: 'Envanter', count: items.length, icon: Archive },
                            { id: 'messages', label: 'Mesajlar', count: messages.length, icon: MessageSquare },
                            { id: 'logs', label: 'Ayak İzi', icon: History },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-4 px-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'text-blue-500 border-blue-500'
                                        : 'text-slate-400 border-transparent hover:text-white hover:border-slate-700'
                                    }`}
                            >
                                <tab.icon size={16} /> {/* @ts-ignore */}
                                {tab.label} {tab.count !== undefined && <span className="bg-slate-800 px-1.5 py-0.5 rounded-full text-[10px]">{tab.count}</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Left Col: Stats */}
                        <div className="space-y-6">
                            {/* Trust Score */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                    <Shield size={64} />
                                </div>
                                <h3 className="text-slate-500 text-xs font-bold uppercase mb-2">Güven Skoru</h3>
                                <div className="flex items-end gap-2">
                                    <span className={`text-4xl font-black ${trustScore >= 80 ? 'text-green-500' : trustScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>{trustScore}</span>
                                    <span className="text-slate-600 mb-1 font-mono text-sm">/100</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${trustScore >= 80 ? 'bg-green-500' : trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${trustScore}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Financial */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                    <DollarSign size={64} />
                                </div>
                                <h3 className="text-slate-500 text-xs font-bold uppercase mb-2">Envanter Değeri</h3>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-white">{inventoryValue.toLocaleString('tr-TR')}</span>
                                    <span className="text-slate-600 mb-1 font-mono text-sm">TL</span>
                                </div>
                            </div>

                            {/* System Info */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                                <h3 className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-widest border-b border-slate-800 pb-2">Sistem Bilgileri</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2"><Calendar size={14} /> Kayıt</span>
                                    <span className="font-mono text-white">{new Date(profile.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2"><Clock size={14} /> Son Aktivite</span>
                                    <span className="font-mono text-white">{logs[0] ? new Date(logs[0].created_at).toLocaleDateString() : '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2"><Activity size={14} /> Toplam Log</span>
                                    <span className="font-mono text-white">{logs.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Admin Note */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-white flex items-center gap-2"><FileText className="text-blue-500" size={18} /> Admin Defteri</h3>
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={savingNote}
                                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
                                    >
                                        {savingNote ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        {savingNote ? 'Kaydediliyor...' : 'Notu Kaydet'}
                                    </button>
                                </div>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Kullanıcı hakkında notlar..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: INVENTORY */}
                {activeTab === 'items' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in zoom-in-95 duration-300">
                        {items.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                <Archive size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Envanter kaydı bulunamadı.</p>
                            </div>
                        ) : items.map((item) => (
                            <div key={item.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all relative">
                                <div className="aspect-square bg-slate-800 relative">
                                    {item.image_url ? (
                                        <Image src={item.image_url} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600"><Archive size={24} /></div>
                                    )}
                                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                        <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur uppercase">
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-white text-sm truncate" title={item.title}>{item.title}</h4>
                                    <p className="text-blue-400 font-mono text-xs">{item.price} TL</p>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="mt-3 w-full py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/30 rounded text-xs flex items-center justify-center gap-2 transition"
                                    >
                                        <Trash2 size={12} /> Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB: MESSAGES */}
                {activeTab === 'messages' && (
                    <div className="h-[600px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex animate-in fade-in slide-in-from-bottom-2">
                        {/* Sidebar */}
                        <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
                            <div className="p-4 border-b border-slate-800">
                                <h3 className="text-xs font-bold uppercase text-slate-500">Konuşmalar ({Object.keys(conversations).length})</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {Object.keys(conversations).map(partnerId => (
                                    <div
                                        key={partnerId}
                                        onClick={() => setSelectedChatPartner(partnerId)}
                                        className={`p-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800 transition ${selectedChatPartner === partnerId ? 'bg-slate-800 border-l-2 border-l-blue-500' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                {partnerId.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate font-mono">{partnerId.substring(0, 8)}...</p>
                                                <p className="text-xs text-slate-500 truncate">{conversations[partnerId].length} mesaj</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(conversations).length === 0 && (
                                    <div className="p-8 text-center text-slate-500 text-xs">Mesaj verisi yok.</div>
                                )}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-slate-950 relative flex flex-col">
                            {selectedChatPartner ? (
                                <>
                                    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <ShieldAlert size={16} className="text-red-500" />
                                            <span className="font-mono text-sm">ID: {selectedChatPartner}</span>
                                        </h3>
                                        <span className="text-[10px] bg-red-900/20 text-red-500 px-2 py-1 rounded border border-red-900/50">ADMIN SPY MODE</span>
                                    </div>
                                    <div className="flex items-start justify-center p-2 bg-yellow-900/10 border-b border-yellow-900/20 text-yellow-500 text-xs text-center">
                                        <AlertTriangle size={12} className="mr-2" />
                                        Özel Hayatın Gizliliği: Sadece şüpheli durumlarda inceleme yapınız.
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {conversations[selectedChatPartner].map((msg) => {
                                            const isMe = msg.sender_id === id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                                                        }`}>
                                                        <p>{msg.content}</p>
                                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                                    <MessageSquare size={48} className="mb-4 opacity-20" />
                                    <p>İncelemek için bir konuşma seçin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: LOGS */}
                {activeTab === 'logs' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="font-bold text-white text-lg mb-8 flex items-center gap-2">
                            <Activity className="text-blue-500" /> Dijital Ayak İzi (Son 50 İşlem)
                        </h3>
                        {logs.length === 0 ? (
                            <p className="text-slate-500 italic">Kayıtlı log bulunamadı.</p>
                        ) : (
                            <div className="relative border-l-2 border-slate-800 ml-3 space-y-8 pl-8">
                                {logs.map((log, i) => (
                                    <div key={log.id} className="relative group">
                                        <span className="absolute -left-[43px] top-1.5 w-6 h-6 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center z-10 group-hover:bg-blue-600 transition-colors shadow">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </span>
                                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg hover:border-slate-600 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-blue-400 text-sm font-mono tracking-wide">{log.action_type}</span>
                                                <span className="text-xs text-slate-500 font-mono">{new Date(log.created_at).toLocaleString('tr-TR')}</span>
                                            </div>
                                            {log.details && (
                                                <pre className="bg-black/30 p-2 rounded text-[10px] text-slate-400 font-mono overflow-x-auto border border-slate-900/50">
                                                    {JSON.stringify(log.details, null, 2)}
                                                </pre>
                                            )}
                                        </div>
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
