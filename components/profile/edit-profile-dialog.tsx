'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from '@/utils/supabase/client';
import { toast } from "sonner";
import { Settings, Loader2, Camera, User, ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import { Slider } from "@/components/ui/slider"; // Assuming you have a slider component or I will use standard input range if not

// --- CROPPER COMPONENT (DEPENDENCY FREE) ---
function ImageCropper({ src, onCrop, onCancel }: { src: string, onCrop: (blob: Blob) => void, onCancel: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => { imageRef.current = img; draw(); };
    }, [src]);

    useEffect(() => { draw(); }, [scale, offset]);

    const draw = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background (Dark)
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Image Transformed
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.save();
        ctx.translate(centerX + offset.x, centerY + offset.y);
        ctx.scale(scale, scale);
        // Draw centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleCrop = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        // Create a temporary canvas for the final cropped image (High Res)
        const outputSize = 300; // 300x300 Output
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = outputSize;
        outputCanvas.height = outputSize;
        const ctx = outputCanvas.getContext('2d');
        if (!ctx) return;

        // Calculate source rectangle
        // The visible area in the display canvas corresponds to the center of the image.
        // Reverse transform coordinates.
        // Simpler approach: Draw exactly what is seen on the 300x300 canvas

        // Since our display canvas is also 300x300 (or similar), we can basically repeat the draw command on the output canvas
        // BUT we must ensure high quality.

        // Let's rely on the visual canvas state for WYSIWYG
        const sourceCanvas = canvasRef.current;

        // Draw the same transformation onto the output canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outputSize, outputSize);

        const centerX = outputSize / 2;
        const centerY = outputSize / 2;

        ctx.save();
        ctx.translate(centerX + offset.x, centerY + offset.y);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        outputCanvas.toBlob((blob) => {
            if (blob) onCrop(blob);
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="flex flex-col gap-4 items-center animate-in fade-in zoom-in duration-200">
            <div className="relative w-[300px] h-[300px] bg-black rounded-lg overflow-hidden border-2 border-dashed border-gray-600 shadow-xl cursor-move group">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="w-full h-full"
                />
                <div className="absolute inset-0 border-2 border-[#ff3f55] opacity-50 pointer-events-none rounded-lg"></div>
                <div className="absolute bottom-2 right-2 text-xs text-white/50 bg-black/50 px-2 rounded pointer-events-none">Sürükle & Yakınlaştır</div>
            </div>

            <div className="w-full max-w-[300px] flex items-center gap-4">
                <ZoomOut className="w-4 h-4 text-gray-500" />
                <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff3f55]"
                />
                <ZoomIn className="w-4 h-4 text-gray-500" />
            </div>

            <div className="flex gap-2 w-full justify-center">
                <Button variant="outline" onClick={onCancel} className="gap-2"><X className="w-4 h-4" /> İptal</Button>
                <Button onClick={handleCrop} className="bg-[#ff3f55] hover:bg-[#e63548] text-white gap-2"><Check className="w-4 h-4" /> Onayla</Button>
            </div>
        </div>
    );
}

// --- MAIN DIALOG ---
export function EditProfileDialog({ profile }: { profile: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Crop State
    const [cropMode, setCropMode] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
    const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImageSrc(reader.result as string);
                setCropMode(true); // Switch to crop mode
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (blob: Blob) => {
        setAvatarBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setCropMode(false); // Back to form
    };

    const handleCropCancel = () => {
        setCropMode(false);
        setSelectedImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        let avatarUrl = profile.avatar_url;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { window.location.href = '/login'; return; }

        // 1. UPLOAD CROPPED IMAGE
        if (avatarBlob) {
            const fileName = `${user.id}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarBlob, { upsert: true, contentType: 'image/jpeg' });

            if (uploadError) {
                toast.error("Resim yüklenemedi: " + uploadError.message);
                setLoading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
            avatarUrl = publicUrl;
        }

        // 2. UPDATE PROFILE
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
            toast.error(error.message);
            setLoading(false);
        } else {
            toast.success("Profil güncellendi");
            setLoading(false);
            setOpen(false);

            const newUsername = formData.get('username') as string;
            if (newUsername !== profile.username) window.location.href = `/profile/${newUsername}`;
            else window.location.reload();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTimeout(() => { setCropMode(false); setAvatarBlob(null); setPreviewUrl(profile.avatar_url); }, 300);
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
                    <ImageCropper
                        src={selectedImageSrc}
                        onCrop={handleCropComplete}
                        onCancel={handleCropCancel}
                    />
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
