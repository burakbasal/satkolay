'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy, Shield, User } from 'lucide-react';

interface UserListRowProps {
    user: {
        id: string;
        email: string;
        full_name?: string;
        role?: string;
        created_at: string;
    };
}

export function UserListRow({ user }: UserListRowProps) {
    const router = useRouter();

    const handleRowClick = () => {
        router.push(`/admin/users/${user.id}`);
    };

    const handleCopyId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(user.id);
        toast.success('Kullanıcı ID kopyalandı');
    };

    return (
        <tr
            onClick={handleRowClick}
            className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold shrink-0">
                        {(user.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="text-white font-medium group-hover:text-blue-400 transition-colors truncate">
                            {user.full_name || 'İsimsiz'}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        user.role === 'moderator' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-slate-700/50 text-slate-400 border border-slate-700'
                    }`}>
                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                    {user.role === 'moderator' && <Shield className="w-3 h-3" />}
                    {(!user.role || user.role === 'user') && <User className="w-3 h-3" />}
                    {(user.role || 'USER').toUpperCase()}
                </span>
            </td>
            <td className="px-6 py-4 text-slate-400">
                {new Date(user.created_at).toLocaleDateString('tr-TR')}
            </td>
            <td className="px-6 py-4">
                {/* Placeholder for status checks if columns strictly exist, otherwise assuming active */}
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold border border-emerald-400/20">Aktif</span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={handleCopyId}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-white transition-colors"
                        title="ID Kopyala"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button className="text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
                        Detay
                    </button>
                </div>
            </td>
        </tr>
    );
}
