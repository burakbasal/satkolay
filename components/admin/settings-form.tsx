'use client';

import { useState } from 'react';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from 'lucide-react';
import { updateSystemSettings } from '@/app/admin/actions';
import { toast } from 'sonner';

interface SettingsFormProps {
    initialSettings: {
        maintenance_mode: boolean;
        registration_closed: boolean;
    };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);

    const handleToggle = (key: 'maintenance_mode' | 'registration_closed', checked: boolean) => {
        setSettings(prev => ({ ...prev, [key]: checked }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Parallel update
            await Promise.all([
                updateSystemSettings('maintenance_mode', settings.maintenance_mode),
                updateSystemSettings('registration_closed', settings.registration_closed)
            ]);
            toast.success('Ayarlar başarıyla kaydedildi.');
        } catch (error) {
            toast.error('Ayarlar kaydedilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-6">
            {/* Maintenance Mode */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white">Bakım Modu</h3>
                    <p className="text-sm text-slate-500">
                        Aktif edildiğinde site sadece Adminlere görünür olur, diğer kullanıcılar "Bakımdayız" sayfasını görür.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-sm ${!settings.maintenance_mode ? 'text-white' : 'text-slate-500'}`}>Pasif</span>
                    <Switch
                        checked={settings.maintenance_mode}
                        onCheckedChange={(c) => handleToggle('maintenance_mode', c)}
                    />
                    <span className={`text-sm ${settings.maintenance_mode ? 'text-white' : 'text-slate-500'}`}>Aktif</span>
                </div>
            </div>

            {/* Registration */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white">Yeni Üye Kaydı</h3>
                    <p className="text-sm text-slate-500">
                        Yeni kullanıcı kayıtlarını geçici olarak durdurabilirsiniz.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-sm ${!settings.registration_closed ? 'text-white' : 'text-slate-500'}`}>Açık</span>
                    <Switch
                        checked={settings.registration_closed}
                        onCheckedChange={(c) => handleToggle('registration_closed', c)}
                    />
                    <span className={`text-sm ${settings.registration_closed ? 'text-white' : 'text-slate-500'}`}>Kapalı</span>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Ayarları Kaydet
                </Button>
            </div>
        </div>
    );
}
