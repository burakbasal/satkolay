'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Users, Package, MessageSquare, Trash2, Ban, MoreHorizontal, Loader2, ExternalLink, AlertOctagon, Check, X, AlertTriangle, Eye, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { deleteItem, deleteUser, toggleAdmin, toggleBan, approveItem, rejectItem, updateRole } from './actions';

export default function AdminPage() {
    const supabase = createClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("moderation");
    const [currentUserRole, setCurrentUserRole] = useState('user');
    const [data, setData] = useState<{ users: any[], items: any[], messages: any[], pending: any[] }>({ users: [], items: [], messages: [], pending: [] });

    // Reddetme Diyaloğu State'leri
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // VERİLERİ ÇEK
    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/login');

            const { data: profile } = await supabase.from('profiles').select('role, is_admin').eq('id', user.id).single();
            if (!profile?.is_admin) return router.push('/');

            setCurrentUserRole(profile.role);

            const [usersRes, itemsRes, msgsRes] = await Promise.all([
                supabase.from('profiles').select('*, items(status)').order('created_at', { ascending: false }),
                supabase.from('items').select('*, profiles(full_name, email)').order('created_at', { ascending: false }),
                supabase.from('direct_messages').select('*, sender:profiles!sender_id(username, avatar_url)').order('created_at', { ascending: false }).limit(50)
            ]);

            const allItems = itemsRes.data || [];
            const pendingItems = allItems.filter((i: any) => i.status === 'pending');

            const usersWithRecord = usersRes.data?.map((u: any) => ({
                ...u,
                rejectedCount: u.items?.filter((i: any) => i.status === 'rejected').length || 0
            })) || [];

            setData({
                users: usersWithRecord,
                items: allItems,
                pending: pendingItems,
                messages: msgsRes.data || []
            });
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAction = async (action: Function, ...args: any[]) => {
        const promise = action(...args);
        toast.promise(promise, { loading: 'İşlem yapılıyor...', success: 'Başarılı!', error: 'Hata oluştu.' });
        await promise;
        window.location.reload();
    };

    // Reddetme İşlemi
    const handleRejectSubmit = async () => {
        if (!selectedItemId || !rejectReason) return toast.error("Lütfen bir sebep yazın.");
        setIsRejectOpen(false);
        await handleAction(rejectItem, selectedItemId, rejectReason);
        setRejectReason("");
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-[#001e93]" /></div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Yönetim Paneli</h1>
                    <p className="text-slate-500">Rolünüz: <span className="font-bold uppercase text-[#001e93]">{currentUserRole}</span></p>
                </div>
                <Link href="/"><Button variant="outline"><ExternalLink className="w-4 h-4 mr-2" /> Siteye Dön</Button></Link>
            </div>

            {/* KPI KARTLARI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Onay Bekleyen" value={data.pending.length} icon={AlertTriangle} color="yellow" active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} />
                <StatCard title="Kullanıcılar" value={data.users.length} icon={Users} color="blue" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <StatCard title="Tüm İlanlar" value={data.items.length} icon={Package} color="indigo" active={activeTab === 'items'} onClick={() => setActiveTab('items')} />
                <StatCard title="Mesajlar" value={data.messages.length} icon={MessageSquare} color="purple" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
            </div>

            {/* İÇERİK */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6 py-3 border-b bg-gray-50/50">
                        <TabsList className="bg-gray-200">
                            <TabsTrigger value="moderation" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Moderasyon ({data.pending.length})</TabsTrigger>
                            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
                            <TabsTrigger value="items">Tüm İlanlar</TabsTrigger>
                            <TabsTrigger value="messages">Mesajlar</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* 1. MODERASYON (SEBEPLİ RED) */}
                    <TabsContent value="moderation" className="m-0">
                        {data.pending.length === 0 ? (
                            <div className="p-20 text-center text-gray-400 flex flex-col items-center"><CheckCircle className="w-12 h-12 mb-2 text-green-500 opacity-50" /><p>Onay bekleyen ilan yok.</p></div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-yellow-50 border-b border-yellow-100 text-yellow-900"><tr><th className="p-4 pl-6">İlan</th><th className="p-4">Fiyat</th><th className="p-4">Satıcı</th><th className="p-4 text-right pr-6">Karar</th></tr></thead>
                                <tbody className="divide-y">
                                    {data.pending.map((item: any) => (
                                        // BURADAKİ TIKLAMA DETAY SAYFASINA GİDER
                                        <tr key={item.id} className="hover:bg-yellow-50/50 transition cursor-pointer" onClick={() => window.open(`/item/${item.id}`, '_blank')}>
                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative border"><Image src={item.image_urls?.[0] || '/placeholder.png'} alt="" fill className="object-cover" /></div>
                                                <div><div className="font-bold text-gray-900">{item.title}</div><div className="text-xs text-gray-500">{item.category}</div></div>
                                            </td>
                                            <td className="p-4 font-bold">{item.price} TL</td>
                                            <td className="p-4 text-gray-600" onClick={(e) => e.stopPropagation()}>
                                                {/* SATICIYA TIKLAYINCA FBI (ADMIN DETAY) SAYFASINA GİDER */}
                                                <Link href={`/admin/users/${item.seller_id}`} className="hover:underline font-medium flex items-center gap-1 text-blue-600">
                                                    {item.profiles?.full_name} <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </td>
                                            <td className="p-4 text-right pr-6 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(approveItem, item.id)}><Check className="w-4 h-4 mr-1" /> Onayla</Button>
                                                <Button size="sm" variant="destructive" onClick={() => { setSelectedItemId(item.id); setIsRejectOpen(true); }}><X className="w-4 h-4 mr-1" /> Reddet</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </TabsContent>

                    {/* 2. KULLANICILAR (FBI MODU LİNKİ DAHİL) */}
                    <TabsContent value="users" className="m-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b text-gray-500"><tr><th className="p-4 pl-6">Kullanıcı</th><th className="p-4">Rol</th><th className="p-4">Sicil</th><th className="p-4">Durum</th><th className="p-4 text-right pr-6">İşlem</th></tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.users.map((u) => (
                                        // SATIRA TIKLAYINCA FBI SAYFASINA GİDER
                                        <tr key={u.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => router.push(`/admin/users/${u.id}`)}>
                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                <Avatar className="w-9 h-9 border bg-white"><AvatarImage src={u.avatar_url} /><AvatarFallback>{u.username?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
                                                <div><div className="font-bold text-gray-900">{u.full_name}</div><div className="text-xs text-gray-500">{u.email}</div></div>
                                            </td>
                                            <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold text-xs uppercase">{u.role || 'User'}</span></td>
                                            <td className="p-4">{u.rejectedCount > 0 ? <span className="text-red-600 font-bold flex items-center gap-1"><AlertOctagon className="w-4 h-4" /> {u.rejectedCount}</span> : <span className="text-green-600 text-xs">Temiz</span>}</td>
                                            <td className="p-4">{u.is_banned ? <span className="text-red-600 font-bold">Banlı</span> : <span className="text-green-600 font-bold">Aktif</span>}</td>
                                            <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {/* ROL ATAMA (Sadece Owner görür) */}
                                                        {currentUserRole === 'owner' && (
                                                            <DropdownMenuSub>
                                                                <DropdownMenuSubTrigger><Briefcase className="w-4 h-4 mr-2" /> Rol Ata</DropdownMenuSubTrigger>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem onClick={() => handleAction(updateRole, u.id, 'staff')}>Çalışan</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleAction(updateRole, u.id, 'admin')}>Yönetici</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleAction(updateRole, u.id, 'user')}>Üye</DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuSub>
                                                        )}
                                                        <DropdownMenuItem onClick={() => handleAction(toggleBan, u.id, u.is_banned)}><Ban className="w-4 h-4 mr-2" /> {u.is_banned ? "Banı Aç" : "Banla"}</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { if (confirm('Silinsin mi?')) handleAction(deleteUser, u.id) }} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Sil</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    {/* 3. TÜM İLANLAR (SİLİNDİ DURUMU) */}
                    <TabsContent value="items" className="m-0">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b text-gray-500"><tr><th className="p-4 pl-6">İlan</th><th className="p-4">Durum</th><th className="p-4">Fiyat</th><th className="p-4 text-right pr-6">İşlem</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => window.open(`/item/${item.id}`, '_blank')}>
                                        <td className="p-4 pl-6 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded border overflow-hidden relative"><Image src={item.image_urls?.[0] || '/placeholder.png'} alt="" fill className="object-cover" /></div>
                                            <div><div className="font-bold text-gray-900 line-clamp-1">{item.title}</div><div className="text-xs text-gray-500">{item.profiles?.full_name}</div></div>
                                        </td>
                                        <td className="p-4">
                                            {item.status === 'active' ? <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">Yayında</span> :
                                                item.status === 'rejected' ? <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-1 rounded">Red</span> :
                                                    item.status === 'deleted' ? <span className="text-gray-500 font-bold text-xs bg-gray-200 px-2 py-1 rounded">Silindi</span> :
                                                        <span className="text-yellow-600 font-bold text-xs bg-yellow-100 px-2 py-1 rounded">Bekliyor</span>}
                                        </td>
                                        <td className="p-4 font-bold">{item.price} TL</td>
                                        <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                            <Button variant="secondary" size="sm" className="h-8 hover:bg-red-50 hover:text-red-600" onClick={() => { if (confirm('Arşivlensin mi?')) handleAction(deleteItem, item.id) }}><Trash2 className="w-4 h-4 mr-1" /> Sil</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TabsContent>

                    {/* 4. MESAJLAR (Aynen) */}
                    <TabsContent value="messages" className="m-0 bg-gray-50 p-6">
                        <div className="grid gap-3">
                            {data.messages.map((msg) => (
                                <div key={msg.id} className="bg-white p-4 rounded-xl border shadow-sm flex gap-4">
                                    <Avatar className="w-8 h-8 mt-1"><AvatarImage src={msg.sender?.avatar_url} /><AvatarFallback>U</AvatarFallback></Avatar>
                                    <div>
                                        <div className="flex items-center gap-2"><span className="font-bold text-sm">@{msg.sender?.username}</span><span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</span></div>
                                        <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* REDDETME DİYALOĞU */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>İlanı Reddet</DialogTitle><DialogDescription>Lütfen reddetme sebebini yazın. Bu mesaj kullanıcıya iletilecektir.</DialogDescription></DialogHeader>
                    <div className="py-4">
                        <Label className="mb-2 block">Sebep</Label>
                        <Textarea placeholder="Örn: Yasaklı ürün, hatalı fiyat, uygunsuz görsel..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="h-32" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>İptal</Button>
                        <Button variant="destructive" onClick={handleRejectSubmit}>İlanı Reddet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, onClick, active }: any) {
    return (
        <div onClick={onClick} className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all active:scale-95 ${active ? `bg-${color}-50 border-${color}-200 ring-1 ring-${color}-300` : 'bg-white hover:border-gray-300'}`}>
            <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-700`}><Icon className="w-6 h-6" /></div>
            <div><div className="text-2xl font-black text-gray-900">{value}</div><div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</div></div>
        </div>
    )
}