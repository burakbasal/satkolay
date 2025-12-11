import { checkAdminAccess } from '@/utils/admin-auth';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from 'lucide-react';

export default async function AdminSettingsPage() {
    await checkAdminAccess();

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Sistem Ayarları</h2>
                <p className="text-slate-400">Platform genelindeki ayarları buradan yönetin.</p>
            </div>

            <div className="grid gap-6">
                {/* Maintenance Mode */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Bakım Modu</h3>
                        <p className="text-sm text-slate-500">
                            Aktif edildiğinde site sadece Adminlere görünür olur, diğer kullanıcılar "Bakımdayız" sayfasını görür.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="maintenance" className="text-slate-400">Pasif</Label>
                        <Switch id="maintenance" />
                        <Label htmlFor="maintenance" className="text-slate-400">Aktif</Label>
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
                    <div className="flex items-center gap-2">
                        <Switch id="registration" defaultChecked />
                        <Label htmlFor="registration" className="text-white">Kayıtlar Açık</Label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                        <Save className="w-4 h-4 mr-2" />
                        Ayarları Kaydet
                    </Button>
                </div>
            </div>
        </div>
    );
}
