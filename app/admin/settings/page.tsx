'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Save, Power, UserPlus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Actually, let's use a custom toggle UI to be safe from dependency issues, or try to import Switch if available.
// I'll check existence of switch later, but for now I'll build a custom toggle to ensure it runs without errors.

export default function AdminSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default Settings
    const [settings, setSettings] = useState({
        is_maintenance_mode: false,
        is_registration_open: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            // Fetch ID=1
            const { data, error } = await supabase
                .from('platform_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (data) {
                setSettings({
                    is_maintenance_mode: data.is_maintenance_mode,
                    is_registration_open: data.is_registration_open
                });
            } else if (error) {
                console.error("Settings Fetch Error:", error);
                // Optional: Auto-create if not exists?
                // For now just toast error.
                if (error.code !== 'PGRST116') toast.error("Ayarlar yüklenemedi.");
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleToggle = async (key: 'is_maintenance_mode' | 'is_registration_open') => {
        const newValue = !settings[key];
        // Optimistic UI
        setSettings(prev => ({ ...prev, [key]: newValue }));

        // Save
        const { error } = await supabase
            .from('platform_settings')
            .update({ [key]: newValue })
            .eq('id', 1);

        if (error) {
            // Revert
            setSettings(prev => ({ ...prev, [key]: !newValue }));
            toast.error("Ayar güncellenemedi!");
            console.error(error);
        } else {
            toast.success("Ayarlar güncellendi.");
        }
    };

    if (loading) return <div className="p-8 text-white"><Loader2 className="animate-spin" /> Yükleniyor...</div>;

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <Power className="text-blue-500" /> Sistem Ayarları
                </h2>
                <p className="text-slate-400">Platformun genel erişim ve kayıt ayarlarını buradan yönetebilirsiniz.</p>
            </div>

            <div className="grid gap-6">

                {/* MAINTENANCE MODE */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-colors">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white text-lg">Bakım Modu (Maintenance Mode)</h3>
                            {settings.is_maintenance_mode && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black tracking-wider uppercase">AKTİF</span>}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Aktif edildiğinde, <strong>yöneticiler hariç</strong> tüm kullanıcılar siteye erişemez ve "Bakımdayız" sayfasına yönlendirilir.
                            Veritabanı işlemleri veya riskli güncellemeler sırasında kullanın.
                        </p>
                    </div>
                    <div className="relative">
                        <Switch
                            checked={settings.is_maintenance_mode}
                            onCheckedChange={() => handleToggle('is_maintenance_mode')}
                            className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-slate-700 h-8 w-14"
                        />
                    </div>
                </div>

                {/* REGISTRATION */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-colors">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white text-lg">Kullanıcı Kayıtları</h3>
                            <UserPlus className="w-5 h-5 text-slate-500" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Yeni kullanıcı kayıtlarını durdurun. Giriş yapmış mevcut kullanıcılar etkilenmez.
                            Spam saldırısı durumunda kapatılabilir.
                        </p>
                    </div>
                    <div className="relative">
                        <Switch
                            checked={settings.is_registration_open}
                            onCheckedChange={() => handleToggle('is_registration_open')}
                            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-700 h-8 w-14"
                        />
                    </div>
                </div>

            </div>

            <div className="p-4 bg-orange-900/10 border border-orange-900/20 rounded-xl flex gap-3 text-orange-400 text-sm">
                <AlertTriangle className="shrink-0" />
                <p>Not: Bakım modu değişikliği tüm kullanıcılarda anında etkili olur. Kendi oturumunuzun açık olduğundan emin olun.</p>
            </div>
        </div>
    );
}

// Simple Switch Component defined inline if shadcn is missing or complex to import
function Switch({ checked, onCheckedChange, className }: { checked: boolean, onCheckedChange: () => void, className?: string }) {
    return (
        <button
            onClick={onCheckedChange}
            className={`
                relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500
                ${className}
            `}
        >
            <span
                className={`
                    ${checked ? 'translate-x-7' : 'translate-x-1'}
                    inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                `}
            />
        </button>
    );
}
