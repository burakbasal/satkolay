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
    AlertTriangle, Power, Edit3, X, Mail, Package
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
    bio: string | null;
    phone: string | null;
    admin_notes: string | null;
    is_maintenance_mode: boolean;
    created_at: string;
    updated_at: string;
};

type Item = {
    id: number;
    title: string;
    price: number;
    image_url: string | null;
    status: 'active' | 'sold' | 'inactive' | 'deleted';
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

import { getStorageUrl } from '@/utils/supabase/url-helper';

// ... imports remain the same

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
    const [activeTab, setActiveTab] = useState<'identity' | 'portfolio' | 'spy' | 'logs' | 'notes'>('identity');
    const [selectedChatPartner, setSelectedChatPartner] = useState<string | null>(null);

    // Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Profile>>({});
    const [savingEdit, setSavingEdit] = useState(false);
    const [savingNote, setSavingNote] = useState(false);
    const [adminNote, setAdminNote] = useState('');

    // --- FETCHING ---
    useEffect(() => {
        if (!id) return;

        async function fetchAllData() {
            setLoading(true);

            // A. Profile
            const pProfile = supabase.from('profiles').select('*').eq('id', id).single();

            // B. Items (Resilient Wrapper: Try owner_id, fallback to user_id)
            const fetchItems = async () => {
                const { data, error } = await supabase.from('items').select('*').eq('owner_id', id).order('created_at', { ascending: false });
                if (!error && data) return data;

                console.warn('Items fetch with owner_id failed, trying user_id...');
                const { data: d2, error: e2 } = await supabase.from('items').select('*').eq('user_id', id).order('created_at', { ascending: false });
                if (!e2 && d2) return d2;

                return []; // Fail safe: return empty array
            };

            // C. Logs
            const pLogs = supabase.from('activity_logs').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(100);

            // D. Messages (God Mode)
            const pMessages = supabase
                .from('direct_messages')
                .select('*')
                .or(`sender_id.eq.${id},receiver_id.eq.${id}`)
                .order('created_at', { ascending: true });

            const [resProfile, resItems, resLogs, resMessages] = await Promise.allSettled([
                pProfile,
                fetchItems(),
                pLogs,
                pMessages
            ]);

            // Handle Profile
            if (resProfile.status === 'fulfilled' && resProfile.value.data) {
                setProfile(resProfile.value.data);
                setEditForm(resProfile.value.data);
                setAdminNote(resProfile.value.data.admin_notes || '');
            } else {
                toast.error('Kullanıcı profili yüklenemedi.');
            }

            // Handle Items (Wrapper returns data directly)
            if (resItems.status === 'fulfilled') {
                setItems(resItems.value);
            }

            // Handle Logs (Supabase returns { data, error })
            if (resLogs.status === 'fulfilled' && resLogs.value.data) {
                setLogs(resLogs.value.data);
            }

            // Handle Messages (Supabase returns { data, error })
            if (resMessages.status === 'fulfilled') {
                if (resMessages.value.data) {
                    setMessages(resMessages.value.data);
                } else if (resMessages.value.error) {
                    console.error('Messages Fetch Error:', resMessages.value.error);
                }
            }

            setLoading(false);
        }

        fetchAllData();
    }, [id, supabase]);

    // --- ACTIONS ---

    const handleUpdateProfile = async () => {
        setSavingEdit(true);
        const { error } = await supabase.from('profiles').update({
            full_name: editForm.full_name,
            city: editForm.city,
            // bio: editForm.bio, // Uncomment if bio exists in schema
            // phone: editForm.phone // Uncomment if phone exists
        }).eq('id', id);

        if (error) {
            toast.error('Profil güncellenemedi: ' + error.message);
        } else {
            setProfile({ ...profile!, ...editForm } as Profile);
            setIsEditing(false);
            toast.success('Profil bilgileri güncellendi');
            // Log action
            await supabase.from('activity_logs').insert({ user_id: id, action_type: 'ADMIN_UPDATE_PROFILE', details: { changes: editForm } });
        }
        setSavingEdit(false);
    };

    const handleSaveNote = async () => {
        setSavingNote(true);
        const { error } = await supabase.from('profiles').update({ admin_notes: adminNote }).eq('id', id);
        if (error) toast.error('Not kaydedilemedi');
        else toast.success('Admin notu kaydedildi');
        setSavingNote(false);
    };

    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
        if (error) toast.error('Rol değiştirilemedi');
        else {
            setProfile({ ...profile!, role: newRole });
            toast.success(`Rol güncellendi: ${newRole.toUpperCase()}`);
        }
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
        }
    };

    const handleResetPassword = async () => {
        if (!profile?.email) return;
        const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
        if (error) toast.error('E-posta gönderilemedi: ' + error.message);
        else toast.success('Şifre sıfırlama bağlantısı gönderildi.');
    };

    const handleDeactivateAllItems = async () => {
        if (!confirm('DİKKAT! Bu kullanıcının TÜM aktif ilanlarını pasife almak istediğinize emin misiniz?')) return;
        const { error } = await supabase.from('items').update({ status: 'inactive' }).eq('owner_id', id).eq('status', 'active');

        if (error) toast.error('İşlem başarısız');
        else {
            toast.success('Tüm ilanlar pasife alındı');
            // Refresh local state roughly
            setItems(prev => prev.map(i => i.status === 'active' ? { ...i, status: 'inactive' } : i));
        }
    };

    // --- COMPUTED ---
    const inventoryValue = useMemo(() => items.filter(i => i.status === 'active').reduce((sum, i) => sum + (Number(i.price) || 0), 0), [items]);
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
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Sistem Yükleniyor...</p>
            </div>
        </div>
    );

    if (!profile) return (
        <div className="bg-slate-950 h-screen text-slate-400 flex items-center justify-center flex-col gap-4">
            <AlertTriangle size={64} className="text-yellow-600 mb-4" />
            <h1 className="text-2xl font-bold text-white">Profil Verisi Yok</h1>
            <p>Bu ID ile eşleşen bir kullanıcı bulunamadı.</p>
            <Link href="/admin/users" className="text-blue-500 hover:underline">Listeye Dön</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">

            {/* HEADER */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/users" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-bold text-white leading-none">{profile.full_name || 'İsimsiz'}</h1>
                                <span className="text-xs text-slate-500 font-mono tracking-wide">{id}</span>
                            </div>
                        </div>

                        {/* Global Actions */}
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${profile.role === 'admin' ? 'bg-red-900/20 text-red-500 border-red-900' :
                                profile.role === 'moderator' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900' :
                                    'bg-blue-900/20 text-blue-500 border-blue-900'
                                }`}>
                                {profile.role}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${profile.banned ? 'bg-red-900/20 text-red-500 border-red-900' : 'bg-green-900/20 text-green-500 border-green-900'
                                }`}>
                                {profile.banned ? 'BANNED' : 'ACTIVE'}
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-2">
                        {[
                            { id: 'identity', label: 'Kimlik & Düzenle', icon: UserCog },
                            { id: 'portfolio', label: 'İlan Portföyü', icon: Archive },
                            { id: 'spy', label: 'İstihbarat', icon: Eye },
                            { id: 'logs', label: 'Adli Kayıtlar', icon: History },
                            { id: 'notes', label: 'Özel Notlar', icon: FileText },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
                                    ? 'border-blue-500 text-white bg-slate-800/50 rounded-t-lg'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                    }`}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* TAB A: IDENTITY & EDIT */}
                {activeTab === 'identity' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        {/* View/Edit Form */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white text-lg">Kullanıcı Profil Bilgileri</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-xs font-bold uppercase flex items-center gap-2 transition"
                                >
                                    {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                                    {isEditing ? 'İptal' : 'Düzenle'}
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden shrink-0">
                                        {profile.avatar_url ? (
                                            <Image src={profile.avatar_url} alt="" fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-500 text-2xl font-bold">{profile.email?.[0]}</div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="flex-1">
                                            <label className="block text-xs text-slate-500 mb-1">Avatar URL</label>
                                            <input
                                                type="text"
                                                value={editForm.avatar_url || ''}
                                                onChange={e => setEditForm({ ...editForm, avatar_url: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Ad Soyad</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.full_name || ''}
                                                onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                                            />
                                        ) : (
                                            <p className="text-white font-medium border-b border-slate-800 pb-2">{profile.full_name || '-'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Şehir</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.city || ''}
                                                onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                                            />
                                        ) : (
                                            <p className="text-white font-medium border-b border-slate-800 pb-2">{profile.city || '-'}</p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">E-Posta (Salt Okunur)</label>
                                        <p className="text-slate-400 font-mono text-sm border-b border-slate-800 pb-2">{profile.email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Kayıt Tarihi</label>
                                        <p className="text-slate-400 font-mono text-sm">{new Date(profile.created_at).toLocaleString('tr-TR')}</p>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={savingEdit}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition"
                                        >
                                            {savingEdit ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            Değişiklikleri Kaydet
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                                    <ShieldAlert className="text-red-500" size={20} /> Kritik İşlemler
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div>
                                            <p className="text-slate-200 font-bold text-sm">Kullanıcı Rolü</p>
                                            <p className="text-slate-500 text-xs">Hesap yetki seviyesini belirler.</p>
                                        </div>
                                        <select
                                            value={profile.role}
                                            onChange={handleRoleChange}
                                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded px-3 py-1.5 outline-none focus:border-blue-500"
                                        >
                                            <option value="user">USER</option>
                                            <option value="moderator">MODERATOR</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div>
                                            <p className="text-slate-200 font-bold text-sm">Hesap Durumu</p>
                                            <p className="text-slate-500 text-xs">Yasaklı kullanıcılar giriş yapamaz.</p>
                                        </div>
                                        <button
                                            onClick={handleToggleBan}
                                            className={`w-32 py-1.5 rounded text-xs font-bold uppercase transition ${profile.banned
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                                }`}
                                        >
                                            {profile.banned ? 'Yasağı Kaldır' : 'Yasakla'}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div>
                                            <p className="text-slate-200 font-bold text-sm">Şifre Sıfırla</p>
                                            <p className="text-slate-500 text-xs">E-posta adresine kurtarma linki gönderir.</p>
                                        </div>
                                        <button
                                            onClick={handleResetPassword}
                                            className="w-32 py-1.5 bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 rounded text-xs font-bold uppercase transition"
                                        >
                                            <Mail size={12} className="inline mr-1" /> Gönder
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div>
                                            <p className="text-slate-200 font-bold text-sm">Bakım Modu</p>
                                            <p className="text-slate-500 text-xs">Kullanıcıyı bakım moduna alır.</p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (!profile) return;
                                                const newState = !profile.is_maintenance_mode;
                                                const { error } = await supabase.from('profiles').update({ is_maintenance_mode: newState }).eq('id', id);
                                                if (error) toast.error('İşlem başarısız');
                                                else {
                                                    setProfile({ ...profile, is_maintenance_mode: newState });
                                                    toast.success(newState ? 'Bakım modu açıldı' : 'Bakım modu kapatıldı');
                                                }
                                            }}
                                            className={`w-32 py-1.5 rounded text-xs font-bold uppercase transition ${profile.is_maintenance_mode
                                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                }`}
                                        >
                                            {profile.is_maintenance_mode ? 'Kapat' : 'Aç'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB B: PORTFOLIO (LISTINGS) */}
                {activeTab === 'portfolio' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                                <p className="text-slate-500 text-xs font-bold uppercase">Toplam İlan</p>
                                <p className="text-2xl font-black text-white">{items.length}</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                                <p className="text-slate-500 text-xs font-bold uppercase">Aktif İlan</p>
                                <p className="text-2xl font-black text-green-500">{items.filter(i => i.status === 'active').length}</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                                <p className="text-slate-500 text-xs font-bold uppercase">Portföy Değeri</p>
                                <p className="text-2xl font-black text-blue-500">{inventoryValue.toLocaleString('tr-TR')} ₺</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-center">
                                <button
                                    onClick={handleDeactivateAllItems}
                                    className="w-full h-full bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 text-red-500 font-bold text-xs uppercase rounded-lg flex flex-col items-center justify-center gap-1 transition"
                                >
                                    <Power size={20} />
                                    Tüm İlanları Durdur
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-6">İlan Listesi</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {items.length === 0 ? (
                                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
                                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-medium">Bu kullanıcıya ait ilan yok.</p>
                                        <p className="text-xs text-slate-600 font-mono mt-2">Aranan ID: {id}</p>
                                    </div>
                                ) : items.map(item => (
                                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden group">
                                        <div className="aspect-square relative bg-slate-900">
                                            {item.image_url ? (
                                                <Image
                                                    src={getStorageUrl(item.image_url) || '/placeholder.png'}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover opacity-80 group-hover:opacity-100 transition"
                                                    onError={(e) => {
                                                        e.currentTarget.srcset = '';
                                                        e.currentTarget.src = 'https://placehold.co/400x400/1e293b/475569?text=Resim+Yok';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-700"><Archive size={24} /></div>
                                            )}
                                            <div className="absolute top-1 right-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.status === 'active' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
                                                    }`}>{item.status}</span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-white text-xs font-bold truncate" title={item.title}>{item.title}</p>
                                            <p className="text-blue-400 text-xs font-mono">{item.price} ₺</p>
                                            <div className="flex gap-1 mt-2">
                                                <button className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded">Düzenle</button>
                                                <button className="px-2 py-1 bg-red-900/30 text-red-500 hover:bg-red-900/50 rounded" title="Sil"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB C: MESSAGE SPY */}
                {activeTab === 'spy' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px] animate-in fade-in duration-300">
                        <div className="border-r border-slate-800 bg-slate-900/50 flex flex-col">
                            <div className="p-4 border-b border-slate-800">
                                <h3 className="text-xs font-bold uppercase text-slate-400">Aktif Sohbetler</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {Object.keys(conversations).length === 0 && (
                                    <div className="p-8 text-center text-slate-500 text-xs">
                                        Mesaj kaydı bulunamadı.
                                    </div>
                                )}
                                {Object.keys(conversations).map(partnerId => (
                                    <div
                                        key={partnerId}
                                        onClick={() => setSelectedChatPartner(partnerId)}
                                        className={`p-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800 transition ${selectedChatPartner === partnerId ? 'bg-slate-800 border-l-2 border-l-blue-500' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">{partnerId.substring(0, 2)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate font-mono">
                                                    {partnerId === id ? 'Bu Kullanıcı' : 'Karşı Taraf'}
                                                    <span className="text-xs text-slate-600 font-mono ml-2">({partnerId.substring(0, 6)})</span>
                                                </p>
                                                <p className="text-xs text-slate-500">{conversations[partnerId].length} mesaj</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-slate-950 flex flex-col">
                            {selectedChatPartner ? (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                                        <span className="font-mono text-xs text-slate-400">Chat ID: {selectedChatPartner}</span>
                                        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">ADMIN VIEW</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {conversations[selectedChatPartner].map(msg => (
                                            <div key={msg.id} className={`flex ${msg.sender_id === id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender_id === id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                                    <p>{msg.content}</p>
                                                    <span className="text-[10px] opacity-50 block mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-slate-600">
                                    <Eye size={48} className="mb-4 opacity-20" />
                                    <p>Sohbet seçiniz.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB D: LOGS */}
                {activeTab === 'logs' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-in fade-in duration-300">
                        <h3 className="font-bold text-white mb-6">Sistem Kayıtları (Activity Logs)</h3>
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-sm">
                                    <div className="shrink-0 text-slate-500 w-32 border-r border-slate-800 pr-4">
                                        {new Date(log.created_at).toLocaleString('tr-TR')}
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-blue-400 font-bold mr-2">{log.action_type}</span>
                                        <span className="text-slate-400">{JSON.stringify(log.details)}</span>
                                    </div>
                                </div>
                            ))}
                            {logs.length === 0 && <p className="text-slate-500">Log kaydı bulunamadı.</p>}
                        </div>
                    </div>
                )}

                {/* TAB E: NOTES */}
                {activeTab === 'notes' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[600px] flex flex-col animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">Özel Yönetici Notları</h3>
                            <button
                                onClick={handleSaveNote}
                                disabled={savingNote}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"
                            >
                                {savingNote ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Kaydet
                            </button>
                        </div>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-6 text-slate-300 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Bu kullanıcı ile ilgili önemli notlarınızı buraya yazın..."
                        />
                    </div>
                )}

            </div>
        </div>
    );
}
