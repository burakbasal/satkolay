'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';

interface Follower {
    username: string;
    avatar_url?: string;
    full_name?: string;
}

interface FollowModalProps {
    type: 'followers' | 'following';
    count: number;
    data: Follower[];
}

export function FollowModal({ type, count, data }: FollowModalProps) {
    const title = type === 'followers' ? 'Takipçiler' : 'Takip Edilenler';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[80px] cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="block font-bold text-lg text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">{type === 'followers' ? 'Takipçi' : 'Takip'}</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
                    {data && data.length > 0 ? (
                        data.map((user, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm text-gray-900">{user.full_name || user.username}</span>
                                        <span className="text-xs text-gray-500">@{user.username}</span>
                                    </div>
                                </Link>
                                <Link href={`/profile/${user.username}`}>
                                    <Button size="sm" variant="outline" className="h-8 text-xs">Profil</Button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 gap-2">
                            <User className="w-8 h-8 opacity-20" />
                            <p className="text-sm">Henüz kimse yok.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
