'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFollowers, getFollowing } from '@/app/profile/actions';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface FollowModalProps {
    userId: string;
    type: 'followers' | 'following';
    count: number;
    children: React.ReactNode; // Tıklanacak sayı/metin
}

export function FollowModal({ userId, type, count, children }: FollowModalProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        if (data.length > 0) return; // Zaten yüklendiyse tekrar çekme
        setLoading(true);
        const res = type === 'followers' ? await getFollowers(userId) : await getFollowing(userId);
        setData(res);
        setLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild onClick={loadData}>
                <button className="hover:opacity-70 transition text-center cursor-pointer">
                    {children}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-center border-b pb-4">
                        {type === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}
                    </DialogTitle>
                    <DialogDescription className="hidden">Takipçi listesi</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-2">
                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-red-500" /></div>
                    ) : data.length === 0 ? (
                        <div className="text-center text-gray-500 p-4">Liste boş.</div>
                    ) : (
                        <div className="space-y-4">
                            {data.map((u, i) => (
                                <Link key={i} href={`/profile/${u.username}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                    <Avatar>
                                        <AvatarImage src={u.avatar_url} />
                                        <AvatarFallback>{u.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="font-bold text-sm truncate">{u.username}</div>
                                        <div className="text-xs text-gray-500 truncate">{u.full_name}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
