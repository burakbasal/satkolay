import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import { Tag } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Kampanyalar',
    description: 'SatKolay güncel kampanya ve fırsatlar.',
};

export default function CampaignsPage() {
    return (
        <StaticPageLayout title="Fırsatlar ve Kampanyalar">
            <p className="lead text-lg mb-10 text-gray-600">
                Alırken de satarken de kazanmak için güncel kampanyalarımızı takip edin.
            </p>

            <div className="space-y-6">
                {/* Campaign 1 */}
                <div className="border-2 border-dashed border-blue-200 bg-blue-50 p-6 rounded-xl flex items-center gap-6">
                    <div className="bg-white p-4 rounded-full shadow-sm text-blue-600 hidden md:block">
                        <Tag className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">YENİ ÜYE ÖZEL</div>
                        <h3 className="font-bold text-xl text-gray-900">İlk İlanını Ver, Vitrin Fırsatı Yakala!</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            SatKolay'a yeni üye olan herkese ilk ilanında 3 gün boyunca "Vitrin" dopingi hediye.
                        </p>
                    </div>
                    <div className="ml-auto hidden md:block">
                        <a href="/sell" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">İlan Ver</a>
                    </div>
                </div>

                {/* Campaign 2 */}
                <div className="border border-gray-200 bg-white p-6 rounded-xl flex items-center gap-6 opacity-75">
                    <div className="bg-gray-100 p-4 rounded-full shadow-sm text-gray-400 hidden md:block">
                        <Tag className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="inline-block bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">SÜRESİ DOLDU</div>
                        <h3 className="font-bold text-xl text-gray-900">Öğrenci İndirimi</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            .edu uzantılı e-posta adresi ile kayıt olan öğrencilere %50 komisyon indirimi.
                        </p>
                    </div>
                </div>
            </div>
        </StaticPageLayout>
    );
}
