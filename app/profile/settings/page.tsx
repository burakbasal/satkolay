'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User, MapPin, Lock, Bell, Mail, ShieldAlert, LogOut, Trash2,
    ChevronRight, Camera, Save, Loader2, Plus, Home, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { addAddress, deleteAddress } from './actions';
import { TURKEY_CITIES } from '@/constants/cities';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // --- PROFİL STATE ---
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // --- ADRES STATE ---
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");

    // --- BİLDİRİM STATE ---
    const [notifSettings, setNotifSettings] = useState({
        email: true,
        push: true,
        priceDrop: true,
        messages: true
    });

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/login');
            setUser(user);

            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profile) {
                setFullName(profile.full_name || '');
                setUsername(profile.username || '');
                setBio(profile.bio || '');
                setAvatarUrl(profile.avatar_url || '');
            }

            // Adresleri Çek
            supabase.from('user_addresses').select('*').order('created_at', { ascending: false })
                .then(({ data }) => setAddresses(data || []));
        };
        init();
    }, []);

    // --- FONKSİYONLAR ---
    const handleSaveProfile = async () => {
        setLoading(true);

        const updates = {
            id: user.id, // Güvenlik için ID'yi de ekle
            full_name: fullName,
            username: username, // Yeni kullanıcı adı
            bio: bio,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            toast.error("Hata: " + error.message);
            setLoading(false);
        } else {
            toast.success("Profil güncellendi ✅");

            // Eğer kullanıcı adı değiştiyse yeni URL'ye yönlendir
            // Eski username'i user metadata'dan veya ilk yüklemeden biliyoruz ama 
            // basitçe: işlem başarılıysa yeni username sayfasına git.
            window.location.href = `/profile/${username}`;
            // Not: Refresh yerine redirect, çünkü URL değişmiş olabilir.
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        const filePath = `${user.id}/avatar_${Date.now()}`;
        const { error } = await supabase.storage.from('avatars').upload(filePath, file);
        if (!error) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
            toast.success("Fotoğraf yüklendi, kaydetmeyi unutma!");
        }
    };

    const handlePasswordReset = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: `${window.location.origin}/profile/settings` });
        if (error) toast.error(error.message);
        else toast.success("Şifre sıfırlama e-postası gönderildi.");
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Adresi silmek istiyor musunuz?")) return;
        await deleteAddress(id);
        setAddresses(prev => prev.filter(a => a.id !== id)); // UI'dan sil
        toast.success("Adres silindi.");
    };

    const menuItems = [
        { id: 'profile', label: 'Profil Ayarları', icon: User },
        { id: 'address', label: 'Adreslerim', icon: MapPin },
        { id: 'privacy', label: 'Gizlilik & Güvenlik', icon: Lock },
        { id: 'notifications', label: 'Bildirimler', icon: Bell },
        { id: 'security', label: 'Güvenlik İpuçları', icon: ShieldAlert },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl min-h-screen font-sans">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Hesap Ayarları</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* SOL MENÜ */}
                <aside className="w-full md:w-1/4 space-y-1 shrink-0">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition ${activeTab === item.id ? 'bg-red-50 text-[#ff3f55]' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </div>
                            {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                        </button>
                    ))}

                    <div className="pt-6 mt-6 border-t border-gray-100 space-y-1">
                        <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition">
                            <LogOut className="w-5 h-5" /> Çıkış Yap
                        </button>
                        <button onClick={() => alert("Hesap silme talebiniz alındı.")} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-5 h-5" /> Hesabımı Sil
                        </button>
                    </div>
                </aside>

                {/* SAĞ İÇERİK */}
                <main className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm min-h-[500px]">

                    {/* 1. PROFİL AYARLARI */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center gap-6">
                                <div className="relative group cursor-pointer">
                                    <Avatar className="w-24 h-24 border-4 border-gray-50 shadow-sm">
                                        <AvatarImage src={avatarUrl} className="object-cover" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition text-white cursor-pointer">
                                        <Camera className="w-8 h-8" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                    </label>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Profil Fotoğrafı</h3>
                                    <p className="text-sm text-gray-500">Net bir yüz fotoğrafı güven verir.</p>
                                </div>
                            </div>

                            <div className="grid gap-5 max-w-lg">
                                <div><Label>Ad Soyad</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1.5" /></div>
                                <div><Label>Kullanıcı Adı</Label><Input value={username} onChange={e => setUsername(e.target.value)} className="mt-1.5" /></div>
                                <div><Label>Biyografi</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1.5 h-24 resize-none" placeholder="Kendinden bahset..." /></div>
                            </div>

                            <Button onClick={handleSaveProfile} disabled={loading} className="bg-[#ff3f55] hover:bg-[#e63548] text-white">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <><Save className="w-4 h-4 mr-2" /> Kaydet</>}
                            </Button>
                        </div>
                    )}

                    {/* 2. ADRESLER (GERÇEK) */}
                    {activeTab === 'address' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">Kayıtlı Adreslerim</h3>

                                {/* YENİ ADRES EKLEME MODALI */}
                                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="text-[#ff3f55] border-[#ff3f55] hover:bg-red-50">
                                            <Plus className="w-4 h-4 mr-2" /> Yeni Ekle
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Yeni Adres Ekle</DialogTitle>
                                            <DialogDescription className="hidden">Yeni adres ekleme formu</DialogDescription>
                                        </DialogHeader>
                                        <form action={async (formData) => {
                                            const res = await addAddress(formData);
                                            if (res?.error) toast.error(res.error);
                                            else {
                                                toast.success("Adres eklendi ✅");
                                                setIsAddOpen(false);
                                                // Listeyi yenile
                                                const { data } = await supabase.from('user_addresses').select('*').order('created_at', { ascending: false });
                                                setAddresses(data || []);
                                            }
                                        }} className="space-y-4 pt-4">
                                            <div><Label>Adres Başlığı</Label><Input name="title" placeholder="Örn: Ev, İşyeri" required /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>İl</Label>
                                                    <Select name="city" onValueChange={setSelectedCity}>
                                                        <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                                        <SelectContent className="max-h-[200px]">{TURKEY_CITIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>İlçe</Label>
                                                    <Select name="district" disabled={!selectedCity}>
                                                        <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                                        <SelectContent className="max-h-[200px]">
                                                            {selectedCity && TURKEY_CITIES.find(c => c.name === selectedCity)?.districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div><Label>Açık Adres</Label><Textarea name="open_address" placeholder="Mahalle, Sokak, Kapı No..." required /></div>
                                            <Button type="submit" className="w-full bg-[#ff3f55]">Kaydet</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* ADRES LİSTESİ */}
                            {addresses.length > 0 ? (
                                <div className="grid gap-4">
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="p-4 border rounded-xl flex items-start gap-4 hover:border-[#ff3f55] transition bg-gray-50 group">
                                            <div className="p-2 bg-white rounded-full border"><Home className="w-5 h-5 text-gray-600" /></div>
                                            <div className="flex-1">
                                                <div className="font-bold text-sm">{addr.title}</div>
                                                <div className="text-sm text-gray-600 mt-1">{addr.city} / {addr.district}</div>
                                                <div className="text-xs text-gray-500 mt-1">{addr.open_address}</div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Henüz adres eklemediniz.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. GİZLİLİK & GÜVENLİK */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg border-b pb-2">Şifre Değiştir</h3>
                                <div className="grid gap-4 max-w-md">
                                    <div><Label>E-posta Adresin</Label><Input value={user?.email} disabled className="bg-gray-100 mt-1" /></div>
                                    <Button onClick={handlePasswordReset} variant="outline">Şifre Sıfırlama Linki Gönder</Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg border-b pb-2">Veri Gizliliği</h3>
                                <div className="flex items-center justify-between p-4 border rounded-xl">
                                    <div>
                                        <div className="font-medium">Profilimi Arama Motorlarına Gizle</div>
                                        <div className="text-xs text-gray-500">Profiliniz Google aramalarında çıkmaz.</div>
                                    </div>
                                    <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. BİLDİRİMLER */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h3 className="font-bold text-lg mb-4">Bildirim Tercihleri</h3>
                            {Object.entries({
                                email: "E-posta Bildirimleri",
                                push: "Anlık Bildirimler (Push)",
                                priceDrop: "Fiyat Düşüş Alarmları",
                                messages: "Yeni Mesaj Uyarıları"
                            }).map(([key, label]) => (
                                <div key={key} className="flex items-center justify-between py-3 border-b last:border-0">
                                    <span className="text-sm font-medium text-gray-700">{label}</span>
                                    <button
                                        onClick={() => setNotifSettings(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                                        className={`h-6 w-11 rounded-full relative transition-colors ${notifSettings[key as keyof typeof notifSettings] ? 'bg-[#ff3f55]' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all ${notifSettings[key as keyof typeof notifSettings] ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 5. GÜVENLİK İPUÇLARI */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 items-start">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-yellow-800 text-sm">Dolandırıcılara Dikkat!</h4>
                                    <p className="text-xs text-yellow-700 mt-1">SatKolay asla sizden kredi kartı şifrenizi veya SMS kodunuzu istemez.</p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {["Ödemeyi sadece uygulama üzerinden yapın.", "Kargo takip numarasını mutlaka kaydedin.", "Şüpheli kullanıcıları hemen şikayet edin.", "Buluşma noktası olarak kalabalık yerleri seçin."].map((tip, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-600">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
