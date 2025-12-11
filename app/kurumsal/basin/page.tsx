import { StaticPageLayout } from '@/components/static-page-layout';
import { Download } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Basın Odası',
    description: 'SatKolay basın bültenleri ve medya kitleri.',
};

export default function PressPage() {
    return (
        <StaticPageLayout title="Basın Odası">
            <p className="mb-8">
                SatKolay ile ilgili en güncel haberlere, basın bültenlerine ve marka materyallerine buradan ulaşabilirsiniz.
            </p>

            <h3>Basın Bültenleri</h3>
            <div className="space-y-6 my-6">
                <div className="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50">
                    <span className="text-xs font-bold text-gray-500">10 Aralık 2025</span>
                    <h4 className="font-bold text-lg text-gray-900">SatKolay 81 İlde Hizmete Açıldı!</h4>
                    <p className="text-sm text-gray-600 mt-1">Türkiye'nin yeni ikinci el platformu artık tüm şehirlerde aktif.</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4 py-2 bg-white">
                    <span className="text-xs font-bold text-gray-500">1 Kasım 2025</span>
                    <h4 className="font-bold text-lg text-gray-900">Yapay Zeka Destekli İlan Kontrolü Yayında</h4>
                    <p className="text-sm text-gray-600 mt-1">Daha güvenli alışveriş için geliştirdiğimiz AI moderasyon sistemi devreye alındı.</p>
                </div>
            </div>

            <h3>Medya Kiti</h3>
            <p>
                Logolarımız, marka rehberimiz ve yüksek çözünürlüklü görsellerimiz için medya kitimizi indirebilirsiniz.
            </p>

            <div className="mt-6">
                <button className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors font-medium">
                    <Download className="w-5 h-5" />
                    Medya Kitini İndir (.zip)
                </button>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2">Basın İletişimi</h4>
                <p className="text-blue-800 text-sm">
                    Röportaj talepleri ve basın sorularınız için: <br />
                    <a href="mailto:basin@satkolay.com" className="underline font-bold">basin@satkolay.com</a>
                </p>
            </div>
        </StaticPageLayout>
    );
}
