'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShieldAlert, UserCog, CheckCircle } from 'lucide-react';

interface UserActionsProps {
    userId: string;
    currentRole: string;
    isBanned: boolean;
}

export default function UserActions({ userId, currentRole, isBanned }: UserActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleBanToggle = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({ banned: !isBanned }) // Ensure your DB has 'banned' column, or use status
            .eq('id', userId);

        if (error) {
            toast.error('İşlem başarısız: ' + error.message);
        } else {
            toast.success(isBanned ? 'Yasak kaldırıldı' : 'Kullanıcı yasaklandı');
            router.refresh();
        }
        setLoading(false);
    };

    const handleRoleChange = async (newRole: string) => {
        // Implement simple prompt or dropdown logic here if needed, 
        // for now let's cycle user <-> moderator for demo or just show badge
        toast.info('Rol değiştirme özelliği yakında aktif.');
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleBanToggle}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isBanned
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
            >
                {isBanned ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                {loading ? 'İşleniyor...' : (isBanned ? 'Yasağı Kaldır' : 'Yasakla')}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors">
                <UserCog size={18} />
                Rolü Düzenle
            </button>
        </div>
    );
}
