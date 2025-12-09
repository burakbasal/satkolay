'use client';

import { useState, useRef, useCallback } from 'react';
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
import { Settings, Loader2, Camera, User, ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Slider } from "@/components/ui/slider";

// --- HELPER FUNCTION FOR CROPPING ---
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg', 0.95);
    });
}

// --- MAIN DIALOG ---
export function EditProfileDialog({ profile }: { profile: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Crop State
    const [cropMode, setCropMode] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    // Easy Crop State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImageSrc(reader.result as string);
                setCropMode(true);
                setZoom(1); // Reset zoom
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveCrop = async () => {
        if (!selectedImageSrc || !croppedAreaPixels) return;
        try {
            const blob = await getCroppedImg(selectedImageSrc, croppedAreaPixels);

            // Upload immediately or save blob to upload on form submit?
            // Prompt implied upload logic happens on form submit OR confirm crop then upload.
            // Following previous logic: Confirm Crop -> Set Blob -> Upload on "Save" (Form Submit).

            // Update Preview
            const blobUrl = URL.createObjectURL(blob);
            setPreviewUrl(blobUrl);

            // Should I store the blob in state to upload later? Yes.
            // But React state for Blob is fine.
            // Let's attach it to a ref or state.
            // Using a hidden way to pass it to submit handler or just modify the state structure.
            // I'll add a `avatarBlob` state.
            (window as any).avatarBlob = blob; // Quick hack or use state? Use state properly.

            setCropMode(false);
        } catch (e) {
            console.error(e);
            toast.error("Kırpma hatası");
        }
    };

    // Store blob in a ref to avoid re-renders or complex passing
    const blobRef = useRef<Blob | null>(null);

    // Re-implement handleSaveCrop to use ref
    const executeCrop = async () => {
        if (!selectedImageSrc || !croppedAreaPixels) return;
        try {
            const blob = await getCroppedImg(selectedImageSrc, croppedAreaPixels);
            blobRef.current = blob;
            setPreviewUrl(URL.createObjectURL(blob));
            setCropMode(false);
        } catch (e) {
            console.error(e);
            toast.error("Kırpma sırasında hata oluştu");
        }
    };

    const handleCropCancel = () => {
        setCropMode(false);
        setSelectedImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        let avatarUrl = profile.avatar_url;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { window.location.href = '/login'; return; }

        // 1. UPLOAD CROPPED IMAGE (If exists)
        if (blobRef.current) {
            const fileName = `${user.id}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, blobRef.current, { upsert: true, contentType: 'image/jpeg' });

            if (uploadError) {
                toast.error("Resim yüklenemedi: " + uploadError.message);
                setLoading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
            avatarUrl = publicUrl;
        }

        // 2. UPDATE PROFILE
        const username = formData.get('username') as string;
        const { error } = await supabase
            .from('profiles')
            .update({
                username: username,
                full_name: formData.get('full_name'),
                bio: formData.get('bio'),
                avatar_url: avatarUrl
            })
            .eq('id', user.id);

        if (error) {
            toast.error(error.message);
            setLoading(false);
        } else {
            toast.success("Profil güncellendi");
            setLoading(false);
            setOpen(false);

            if (username !== profile.username) window.location.href = `/profile/${username}`;
            else window.location.reload();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTimeout(() => {
                setCropMode(false);
                blobRef.current = null;
                setPreviewUrl(profile.avatar_url);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }, 300);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 border-gray-300 hover:bg-gray-50">
                    <Settings className="w-4 h-4" /> Profili Düzenle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{cropMode ? 'Fotoğrafı Kırp' : 'Profili Düzenle'}</DialogTitle>
                </DialogHeader>

                {cropMode && selectedImageSrc ? (
                    <div className="flex flex-col h-[400px]">
                        <div className="relative flex-1 bg-black rounded-lg overflow-hidden mb-4">
                            <Cropper
                                image={selectedImageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                objectFit="contain" // As requested
                            />
                        </div>

                        <div className="flex items-center gap-4 px-2 mb-4">
                            <ZoomOut className="w-4 h-4 text-gray-500" />
                            <Slider
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={(val) => setZoom(val[0])}
                                className="flex-1"
                            />
                            <ZoomIn className="w-4 h-4 text-gray-500" />
                        </div>

                        <div className="flex gap-2 w-full">
                            <Button variant="outline" onClick={handleCropCancel} className="flex-1">İptal</Button>
                            <Button onClick={executeCrop} className="flex-1 bg-[#ff3f55] hover:bg-[#e63548] text-white">Kaydet</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        {/* AVATAR UI */}
                        <div className="flex flex-col items-center gap-3 mb-2">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Avatar className="w-24 h-24 border-4 border-white shadow-md transition-all group-hover:opacity-90">
                                    <AvatarImage src={previewUrl || ''} className="object-cover" />
                                    <AvatarFallback><User className="w-8 h-8 text-gray-400" /></AvatarFallback>
                                </Avatar>
                                {/* HOVER EFFECT OVERLAY */}
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
                                    <Camera className="w-8 h-8 text-white drop-shadow-md" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Ad Soyad</Label>
                            <Input id="full_name" name="full_name" defaultValue={profile.full_name || ''} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Kullanıcı Adı</Label>
                            <Input id="username" name="username" defaultValue={profile.username || ''} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Biyografi</Label>
                            <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} placeholder="Kendinden bahset..." />
                        </div>
                        <Button type="submit" disabled={loading} className="bg-[#ff3f55] hover:bg-[#e63548] text-white font-bold h-11">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kaydet"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
