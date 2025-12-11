import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Kariyer',
    description: 'SatKolay kariyer fırsatları.',
};

export default function CareerPage() {
    return (
        <StaticPageLayout title="Kariyer Fırsatları">
            <p className="lead text-xl text-gray-600 mb-8">
                Geleceği birlikte inşa etmeye ne dersin? SatKolay ekibine katıl ve ikinci el devriminin bir parçası ol.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-10 text-center my-12">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Şu anda açık pozisyonumuz bulunmamaktadır.</h3>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                    Ancak yetenekli takım arkadaşlarıyla tanışmaya her zaman açığız. Genel başvurularınız için CV'nizi aşağıdaki adrese iletebilirsiniz.
                    Yeni bir pozisyon açıldığında ilk sizinle iletişime geçeceğiz.
                </p>

                <a href="mailto:ik@satkolay.com" className="inline-block bg-[#001e93] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    ik@satkolay.com
                </a>
            </div>

            <h3>Neden SatKolay?</h3>
            <p className="mb-6 text-gray-600">
                Hızlı büyüyen, dinamik ve yenilikçi bir teknoloji şirketiyiz. Çalışanlarımızın mutluluğu ve gelişimi bizim için önceliklidir.
            </p>
            <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-center gap-2">✅ Yenilikçi Çalışma Ortamı</li>
                <li className="flex items-center gap-2">✅ Sürekli Eğitim ve Gelişim</li>
                <li className="flex items-center gap-2">✅ Rekabetçi Yan Haklar</li>
                <li className="flex items-center gap-2">✅ Güçlü Takım Ruhu</li>
            </ul>
        </StaticPageLayout>
    );
}
