import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Kariyer',
    description: 'SatKolay kariyer fırsatları ve açık pozisyonlar.',
};

export default function CareerPage() {
    return (
        <StaticPageLayout title="Kariyer Fırsatları">
            <p className="lead text-xl text-gray-600 mb-8">
                Geleceği birlikte inşa etmeye ne dersin? SatKolay ekibine katıl ve ikinci el devriminin bir parçası ol.
            </p>

            <h3>Biz Kimiz?</h3>
            <p>
                Hızlı büyüyen, dinamik ve yenilikçi bir teknoloji şirketiyiz. Ofisimizde hiyerarşiden çok fikirlere değer veririz.
                Sürekli öğrenen, hata yapmaktan korkmayan ve çözüm odaklı bir ekibiz.
            </p>

            <h3>Açık Pozisyonlar</h3>
            <div className="grid gap-4 my-8">
                {/* Job Card 1 */}
                <div className="border rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600">Senior Frontend Developer</h4>
                            <p className="text-sm text-gray-500 mt-1">Yazılım Ekibi • Uzaktan / Hibrit</p>
                        </div>
                        <Briefcase className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                </div>

                {/* Job Card 2 */}
                <div className="border rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600">Product Manager</h4>
                            <p className="text-sm text-gray-500 mt-1">Ürün Yönetimi • İstanbul</p>
                        </div>
                        <Briefcase className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                </div>

                {/* Job Card 3 */}
                <div className="border rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600">Müşteri Destek Uzmanı</h4>
                            <p className="text-sm text-gray-500 mt-1">Operasyon • Diyarbakır</p>
                        </div>
                        <Briefcase className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                </div>
            </div>

            <h3>Neden SatKolay?</h3>
            <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-center gap-2">✅ Özel Sağlık Sigortası</li>
                <li className="flex items-center gap-2">✅ Eğitim Bütçesi</li>
                <li className="flex items-center gap-2">✅ Esnek Çalışma Saatleri</li>
                <li className="flex items-center gap-2">✅ Yemek & Yol Yardımı</li>
            </ul>

            <div className="mt-10 text-center">
                <p className="text-gray-600 mb-4">Kendine uygun bir pozisyon bulamadın mı?</p>
                <a href="mailto:kariyer@satkolay.com" className="inline-block bg-[#001e93] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-colors">
                    Genel Başvuru Yap
                </a>
            </div>
        </StaticPageLayout>
    );
}
