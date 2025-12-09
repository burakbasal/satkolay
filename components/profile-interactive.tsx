'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserCheck, Share2, ShieldCheck, Medal, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// --- AVATAR LIGHTBOX ---
export function ProfileAvatar({ src, alt }: { src?: string, alt: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div onClick={() => setIsOpen(true)} className="relative w-32 h-32 cursor-pointer group">
                <Avatar className="w-full h-full border-4 border-white shadow-lg group-hover:opacity-90 transition">
                    <AvatarImage src={src} className="object-cover" />
                    <AvatarFallback className="text-4xl">{alt[0]}</AvatarFallback>
                </Avatar>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4 animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                >
                    <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition">
                        <X className="w-8 h-8" />
                    </button>

                    {/* PC Optimized Container */}
                    <div
                        className="relative w-full max-w-2xl aspect-square max-h-[85vh] flex items-center justify-center pointer-events-none"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the container area (optional but good UX)
                    >
                        <img
                            src={src}
                            alt={alt}
                            className="w-full h-full object-contain rounded-lg pointer-events-auto"
                        />
                    </div>
                </div>
            )}
        </>
    );
}

// --- TAKİP BUTONU ---
export function FollowButton({ targetId, currentUserId, isFollowingInit }: { targetId: string, currentUserId?: string, isFollowingInit: boolean }) {
    const [isFollowing, setIsFollowing] = useState(isFollowingInit);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleFollow = async () => {
        if (!currentUserId) return router.push('/login');
        setLoading(true);

        const newState = !isFollowing;
        setIsFollowing(newState); // Hızlı tepki

        if (newState) {
            await supabase.from('follows').insert({ follower_id: currentUserId, following_id: targetId });
            toast.success("Kullanıcı takip edildi!");
        } else {
            await supabase.from('follows').delete().eq('follower_id', currentUserId).eq('following_id', targetId);
            toast.info("Takipten çıkıldı.");
        }

        setLoading(false);
        router.refresh();
    };

    return (
        <Button
            onClick={handleFollow}
            disabled={loading}
            variant={isFollowing ? "outline" : "default"}
            className={isFollowing ? "border-gray-300 text-gray-700" : "bg-[#ff3f55] hover:bg-[#e63548] text-white"}
        >
            {isFollowing ? <><UserCheck className="w-4 h-4 mr-2" /> Takip Ediliyor</> : <><UserPlus className="w-4 h-4 mr-2" /> Takip Et</>}
        </Button>
    );
}

// --- PAYLAŞ BUTONU ---
export function ShareButton() {
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profil linki kopyalandı! 🔗");
    };
    return (
        <Button variant="ghost" size="icon" onClick={handleShare} className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-full">
            <Share2 className="w-5 h-5" />
        </Button>
    )
}

// --- GÜVEN ROZETLERİ (ÖNERİ) ---
export function TrustBadges({ rating, joinedYear }: { rating: number, joinedYear: number }) {
    const currentYear = new Date().getFullYear();
    return (
        <div className="flex items-center gap-2 mt-1">
            {rating >= 4.5 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold" title="Yüksek Puanlı Satıcı">
                    <ShieldCheck className="w-3 h-3" /> Güvenilir
                </span>
            )}
            {(currentYear - joinedYear) >= 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold" title="Eski Üye">
                    <Medal className="w-3 h-3" /> Kıdemli
                </span>
            )}
        </div>
    )
}
