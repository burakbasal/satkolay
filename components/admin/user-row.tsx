'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy, ShieldAlert, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

export default function UserRow({ user }: { user: any }) {
    const router = useRouter();
    // State for potential optimistic updates if we add real actions later
    const [isBanned, setIsBanned] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(user.id);
        toast.success('ID Kopyalandı');
    };

    const handleQuickBan = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Simulate Ban Action
        setIsBanned(!isBanned);
        toast.message('Kullanıcı durumu güncellendi (Demo)');
    };

    const handleDetails = (e: React.MouseEvent) => {
        e.stopPropagation(); // Explicitly stop propagation for the button too, redundantly safe
        router.push(`/admin/users/${user.id}`);
    };

    return (
        <tr
            onClick={() => router.push(`/admin/users/${user.id}`)}
            className="hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800 last:border-0 group"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                        {user.id.substring(0, 8)}...
                    </span>
                    <button
                        onClick={handleCopy}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-all p-1 hover:bg-slate-700 rounded"
                        title="ID Kopyala"
                    >
                        <Copy size={12} />
                    </button>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {(user.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{user.full_name || 'İsimsiz'}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        user.role === 'moderator' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-slate-700/50 text-slate-400 border-slate-700'
                    }`}>
                    {user.role || 'USER'}
                </span>
            </td>
            <td className="px-6 py-4 text-slate-400 text-xs font-mono">
                {new Date(user.created_at).toLocaleDateString('tr-TR')}
            </td>

            {/* ACTIONS COLUMN */}
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={handleQuickBan}
                        className="p-1.5 bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded transition border border-slate-700 hover:border-red-500/30"
                        title="Yasakla / İşlem Yap"
                    >
                        <ShieldAlert size={14} />
                    </button>
                    <button
                        onClick={handleDetails}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 px-2 py-1 hover:bg-blue-500/10 rounded transition"
                    >
                        Detay &rarr;
                    </button>
                </div>
            </td>
        </tr>
    );
}
