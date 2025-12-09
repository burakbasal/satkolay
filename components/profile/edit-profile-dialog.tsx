'use client';

import { useState } from 'react';
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
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";
import { Settings, Loader2 } from 'lucide-react';

export function EditProfileDialog({ profile }: { profile: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const fullName = formData.get('full_name') as string;
        const bio = formData.get('bio') as string;

        // AUTH KONTROLÜ
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = '/login';
            return;
        }

        // UPDATE
        const { error } = await supabase
            .from('profiles')
            .update({
                username: formData.get('username'),
                full_name: formData.get('full_name'),
                bio: formData.get('bio'),
                updated_at: new Date().toISOString()
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
            // Kullanıcı adı değiştiyse yeni linke, değişmediyse sayfayı yenile
            if (username !== profile.username) {
                window.location.href = `/profile/${username}`;
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
