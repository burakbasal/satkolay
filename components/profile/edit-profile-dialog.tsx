'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";
import { Settings, Loader2, Camera, User } from 'lucide-react';

export function EditProfileDialog({ profile }: { profile: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        let avatarUrl = profile.avatar_url;

        // AUTH KONTROLÜ
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = '/login';
            return;
        }

        // 1. AVATAR YÜKLEME (Varsa)
        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile, { upsert: true });

            if (uploadError) {
                toast.error("Resim yüklenemedi: " + uploadError.message);
                setLoading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            avatarUrl = publicUrl;
        }

        // 2. UPDATE
        const { error } = await supabase
            .from('profiles')
            .update({
                username: formData.get('username'),
                full_name: formData.get('full_name'),
                bio: formData.get('bio'),
                avatar_url: avatarUrl
            })
            .eq('id', user.id);

        if (error) {
            toast.error("Hata: " + error.message);
            setLoading(false);
        } else {
            toast.success("Profil güncellendi");
            setLoading(false);
            setOpen(false);

            // KRİTİK: YÖNLENDİRME
            const newUsername = formData.get('username') as string;
            if (newUsername !== profile.username) {
                window.location.href = `/profile/${newUsername}`;
            } else {
                window.location.reload();
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 border-gray-300 hover:bg-gray-50">
                    <Settings className="w-4 h-4" /> Profili Düzenle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Profili Düzenle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    {/* AVATAR UPLOAD */}
                    <div className="flex flex-col items-center gap-3 mb-2">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Avatar className="w-20 h-20 border-2 border-gray-100">
                                <AvatarImage src={previewUrl || ''} className="object-cover" />
                                <AvatarFallback><User className="w-8 h-8 text-gray-400" /></AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
                            Fotoğrafı Değiştir
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="full_name">Ad Soyad</Label>
                        <Input id="full_name" name="full_name" defaultValue={profile.full_name || ''} required />
                    </div>
                    {/* USERNAME INPUT (ZORUNLU) */}
                    <div className="grid gap-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <Input id="username" name="username" defaultValue={profile.username || ''} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Biyografi</Label>
                        <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} placeholder="Kendinden bahset..." />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-[#ff3f55] hover:bg-[#e63548] text-white font-bold">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kaydet"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
