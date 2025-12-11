'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

export default function UserRow({ user }: { user: any }) {
    const router = useRouter();

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        navigator.clipboard.writeText(user.id);
        toast.success('Kullanıcı ID kopyalandı');
    };

    const handleRowClick = () => {
        router.push(`/admin/users/${user.id}`);
    };

    return (
        <tr
            onClick={handleRowClick}
            className="hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800 last:border-0"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 group">
                    <span className="font-mono text-xs text-slate-500">{user.id.substring(0, 8)}...</span>
                    <button
                        onClick={handleCopy}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                        title="ID Kopyala"
                    >
                        <Copy size={12} />
                    </button>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
                        {(user.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{user.full_name || 'İsimsiz'}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        user.role === 'moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                    }`}>
                    {user.role || 'USER'}
                </span>
            </td>
            <td className="px-6 py-4 text-slate-400 text-sm">
                {new Date(user.created_at).toLocaleDateString('tr-TR')}
            </td>
            <td className="px-6 py-4 text-right">
                <span className="text-xs text-slate-500">Detay &rarr;</span>
            </td>
        </tr>
    );
}
