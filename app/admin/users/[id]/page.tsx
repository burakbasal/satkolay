'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Package, MessageSquare, Ban, CheckCircle, AlertOctagon, UserCog, PlusCircle, Trash2, Star, Clock, Activity, ArrowLeft, ExternalLink, Mail, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { toggleBan } from '../../actions';

export default function AdminUserDetail() {
    const supabase = createClient();
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("activity"); // Varsayılan: İşlem Geçmişi

    const [profile, setProfile] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);

    // VERİLERİ ÇEK
    useEffect(() => {
        const fetchData = async () => {
            // 1. Admin Kontrolü
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/login');

            const { data: adminCheck } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
            if (!adminCheck?.is_admin) return router.push('/');

            // 2. Hedef Kullanıcı Verileri
            const [profRes, itemsRes, msgsRes, logsRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', userId).single(),
                supabase.from('items').select('*').eq('seller_id', userId).order('created_at', { ascending: false }),
                supabase.from('direct_messages').select('*, sender:profiles!sender_id(username), conversation:conversations(user1_id, user2_id)').or(`sender_id.eq.${userId}`).order('created_at', { ascending: false }).limit(50),
                supabase.from('activity_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false })
            ]);

            if (profRes.error || !profRes.data) {
                toast.error("Kullanıcı bulunamadı.");
                return router.push('/admin');
            }

            setProfile(profRes.data);
            setItems(itemsRes.data || []);
            setMessages(msgsRes.data || []);
            setLogs(logsRes.data || []);
            setLoading(false);
        };
        fetchData();
    }, [userId]);

    const handleBan = async () => {
        await toggleBan(profile.id, profile.is_banned);
        window.location.reload();
        toast.success("Kullanıcı durumu güncellendi.");
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-100"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff3f55]"></div></div>;

    // Log İkonu Seçici
    const getLogIcon = (type: string) => {
        switch (type) {
            case 'new_item': return <PlusCircle className="w-5 h-5 text-green-600" />;
            case 'update_profile': return <UserCog className="w-5 h-5 text-blue-600" />;
            case 'register': return <Star className="w-5 h-5 text-yellow-600" />;
            case 'delete_item': return <Trash2 className="w-5 h-5 text-red-600" />;
            case 'reject_item': return <AlertOctagon className="w-5 h-5 text-orange-600" />;
            default: return <Activity className="w-5 h-5 text-purple-600" />;
        }
    };

    const rejectedCount = items.filter((i: any) => i.status === 'rejected').length;

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            {/* HEADER */}
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Kullanıcı Dosyası</h1>
                    <p className="text-slate-500 text-sm">ID: {profile.id}</p>
                </div>
            </div>

            {/* KİMLİK KARTI */}
            <div className="bg-white p-8 rounded-2xl border shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 border-4 border-gray-50 shadow-inner">
                        <AvatarImage src={profile.avatar_url} className="object-cover" />
                        <AvatarFallback className="text-2xl bg-slate-100 text-slate-400">{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-1">{profile.full_name}</h2>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <span>@{profile.username}</span> • <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {profile.email}</span>
                        </div>
                        <div className="flex gap-3 mt-1">
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide">{profile.role}</span>
                            {profile.is_banned
                                ? <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1"><Ban className="w-3 h-3" /> YASAKLI</span>
                                : <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide flex items-center gap-1"><CheckCircle className="w-3 h-3" /> AKTİF</span>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => window.open(`/profile/${profile.username}`, '_blank')}><ExternalLink className="w-4 h-4 mr-2" /> Vitrini Gör</Button>
                    <Button variant={profile.is_banned ? "default" : "destructive"} onClick={handleBan}>
                        {profile.is_banned ? "Yasağı Kaldır" : "Kullanıcıyı Yasakla"}
                    </Button>
                </div>
            </div>

            {/* İSTATİSTİKLER (TIKLANABİLİR) */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatBox
                    label="İşlem Geçmişi"
                    value={logs.length}
                    icon={History}
                    active={activeTab === 'activity'}
                    onClick={() => setActiveTab('activity')}
                />
                <StatBox
                    label="Toplam İlan"
                    value={items.length}
                    icon={Package}
                    active={activeTab === 'items'}
                    onClick={() => setActiveTab('items')}
                />
                <StatBox
                    label="Sabıka (Red)"
                    value={rejectedCount}
                    icon={AlertOctagon}
                    color="text-red-600"
                    active={activeTab === 'items'} // İlanlara gider ama rengi farklı
                    onClick={() => setActiveTab('items')}
                />
                <StatBox
                    label="Mesajlar"
                    value={messages.length}
                    icon={MessageSquare}
                    active={activeTab === 'messages'}
                    onClick={() => setActiveTab('messages')}
                />
            </div>

            {/* DETAYLAR (TABS) */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden min-h-[500px]">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6 py-3 border-b bg-gray-50">
                        <TabsList className="bg-white border">
                            <TabsTrigger value="activity">İşlem Geçmişi</TabsTrigger>
                            <TabsTrigger value="items">İlanlar</TabsTrigger>
                            <TabsTrigger value="messages">Mesajlar</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* 1. İŞLEM GEÇMİŞİ (LOGLAR) */}
                    <TabsContent value="activity" className="m-0 p-8">
                        {logs.length > 0 ? (
                            <div className="space-y-0 relative border-l-2 border-gray-100 ml-3">
                                {logs.map((log) => (
                                    <div key={log.id} className="mb-8 ml-6 relative">
                                        <div className="absolute -left-[31px] top-1 bg-white p-1 rounded-full border border-gray-200">
                                            {getLogIcon(log.action_type)}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <p className="text-gray-800 font-medium">{log.details}</p>
                                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-10 border-2 border-dashed rounded-xl">
                                <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>Bu kullanıcının henüz kayıtlı bir işlemi yok.</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* 2. İLANLAR */}
                    <TabsContent value="items" className="m-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b"><tr><th className="p-4 pl-6">İlan</th><th className="p-4">Durum</th><th className="p-4">Fiyat</th><th className="p-4">Tarih</th></tr></thead>
                            <tbody className="divide-y">
                                {items.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.open(`/item/${item.id}`, '_blank')}>
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <div className="w-10 h-10 relative bg-gray-100 rounded border overflow-hidden">
                                                <Image src={item.image_urls?.[0] || '/placeholder.png'} alt="" fill className="object-cover" />
                                            </div>
                                            <span className="font-medium">{item.title}</span>
                                        </td>
                                        <td className="p-4">
                                            {item.status === 'active' ? <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">Yayında</span> :
                                                item.status === 'rejected' ? <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">Red: {item.rejection_reason}</span> :
                                                    item.status === 'deleted' ? <span className="text-gray-500 font-bold text-xs bg-gray-100 px-2 py-1 rounded">Silindi</span> :
                                                        <span className="text-yellow-600 font-bold text-xs bg-yellow-50 px-2 py-1 rounded">Bekliyor</span>}
                                        </td>
                                        <td className="p-4 font-bold">{item.price} TL</td>
                                        <td className="p-4 text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TabsContent>

                    {/* 3. MESAJLAR */}
                    <TabsContent value="messages" className="m-0 bg-gray-50 p-6">
                        <div className="space-y-2">
                            {messages.map((m: any) => (
                                <div key={m.id} className={`p-3 rounded border text-sm ${m.sender_id === userId ? 'bg-blue-50 border-blue-200 ml-auto max-w-[80%]' : 'bg-white border-gray-200 mr-auto max-w-[80%]'}`}>
                                    <div className="font-bold text-xs mb-1 text-gray-700">{m.sender_id === userId ? 'Bu Kullanıcı' : m.sender?.username}</div>
                                    {m.content}
                                    <div className="text-xs text-gray-400 mt-1 text-right">{new Date(m.created_at).toLocaleString()}</div>
                                </div>
                            ))}
                            {messages.length === 0 && <div className="text-center text-gray-400 py-10">Mesaj kaydı bulunamadı.</div>}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// TIKLANABİLİR KART BİLEŞENİ
function StatBox({ label, value, icon: Icon, color, onClick, active }: any) {
    return (
        <div
            onClick={onClick}
            className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all active:scale-95 ${active ? `ring-2 ring-black border-transparent bg-gray-50` : 'hover:border-gray-300'}`}
        >
            <div className={`p-3 rounded-full bg-gray-100 ${color || 'text-gray-500'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className={`text-2xl font-black ${color || 'text-gray-900'}`}>{value || 0}</div>
                <div className="text-xs font-bold text-gray-400 uppercase">{label}</div>
            </div>
        </div>
    )
}
