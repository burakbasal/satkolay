'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

export default function UserRow({ user }: { user: any }) {
    const router = useRouter();

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(user.id);
        toast.success('ID Kopyalandı');
    };

    const handleRowClick = () => {
        router.push(`/admin/users/${user.id}`);
    }

    return (
        <tr
            onClick={handleRowClick}
            className="hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800 last:border-0 group"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                        {user.id.substring(0, 8)}...
                    </span>
                    <button
                        onClick={handleCopy}
                        className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Kopyala"
                    >
                        <Copy size={12} />
                    </button>
                </div>
            </td>
            <td className="px-6 py-4 font-medium text-white">
                <div className="flex flex-col">
                    <span>{user.full_name || 'İsimsiz'}</span>
                    <span className="text-xs text-slate-500 font-normal">{user.email}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-900 text-purple-200' :
                        user.role === 'moderator' ? 'bg-blue-900 text-blue-200' :
                            'bg-slate-800 text-slate-400'
                    }`}>
                    {user.role || 'USER'}
                </span>
            </td>
            <td className="px-6 py-4 text-xs text-slate-400">
                {new Date(user.created_at).toLocaleDateString('tr-TR')}
            </td>
            <td className="px-6 py-4 text-right text-xs text-blue-400 group-hover:text-blue-300 transition-colors">
                Detayları Gör &rarr;
            </td>
        </tr>
    );
}
