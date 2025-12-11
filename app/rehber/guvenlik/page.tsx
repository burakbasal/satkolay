import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import { AlertTriangle, Lock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Güvenli Alışveriş',
    description: 'SatKolay dolandırıcılık önleme ve güvenlik ipuçları.',
};

export default function SecurityPage() {
    return (
        <StaticPageLayout title="Güvenli Alışveriş Rehberi">
            <p className="lead text-xl text-gray-600 mb-8">
                Güvenliğiniz bizim için her şeyden önemli. İnternet alışverişlerinde mağdur olmamak için bu temel kuralları mutlaka okuyun.
            </p>

            <div className="space-y-8">
                <div className="flex gap-4 p-4 border border-red-200 bg-red-50 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-900 mb-1">Kapora Dolandırıcılığına Dikkat!</h3>
                        <p className="text-red-800 text-sm">
                            "Çok talep var, ürünü ayırtmak için kapora atın" diyen satıcılara asla para göndermeyin.
                            Ürünü görmeden yapılan ödemeler en yaygın dolandırıcılık yöntemidir.
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="w-6 h-6 text-blue-600" />
                        Hesap Güvenliği
                    </h3>
                    <ul>
                        <li>Şifrenizi kimseyle paylaşmayın. SatKolay çalışanları sizden asla şifrenizi istemez.</li>
                        <li>Size SMS veya E-posta ile gelen şüpheli linklere tıklamayın.</li>
                        <li>İşlemlerinizi sadece SatKolay uygulaması veya satkolay.com üzerinden yapın.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        Buluşma Noktaları
                    </h3>
                    <p className="mb-4">
                        Tanımadığınız kişilerle buluşurken mutlaka güvenli bölgeleri tercih edin:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm font-medium text-gray-700">
                        <li className="bg-gray-100 p-2 rounded">🏢 Alışveriş Merkezleri</li>
                        <li className="bg-gray-100 p-2 rounded">☕ Kafeler ve Restoranlar</li>
                        <li className="bg-gray-100 p-2 rounded">🚉 Metro/Otobüs Durakları</li>
                        <li className="bg-gray-100 p-2 rounded">👮 Karakol Önleri</li>
                    </ul>
                </div>
            </div>

            <div className="mt-12 border-t pt-8">
                <h4 className="font-bold text-gray-900">Şüpheli Bir Durum Mu Var?</h4>
                <p className="text-gray-600 mb-4">Bir ilanın sahte olduğunu veya bir kullanıcının kötü niyetli olduğunu düşünüyorsanız hemen bize bildirin.</p>
                <a href="/iletisim" className="text-blue-600 hover:underline font-bold">Şikayet Bildir &rarr;</a>
            </div>
        </StaticPageLayout>
    );
}
