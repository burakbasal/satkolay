import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import { Search, MessageCircle, Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Nasıl Alınır?',
    description: 'SatKolay ile güvenli alışveriş rehberi.',
};

export default function HowToBuyPage() {
    return (
        <StaticPageLayout title="Nasıl Alınır?">
            <p className="lead text-lg mb-8">
                Aradığınız o özel parçayı veya uygun fiyatlı ürünü bulmak SatKolay'da çok basit. Güvenli bir alışveriş için izlemeniz gereken adımlar:
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Step 1 */}
                <div className="bg-white border rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                        <Search className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Keşfet ve Ara</h3>
                    <p className="text-sm text-gray-600">
                        Kategoriler arasında gezinin veya akıllı arama çubuğunu kullanın. Filtreleme seçenekleri ile aradığınızı tam olarak bulun.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white border rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Satıcıyla Konuş</h3>
                    <p className="text-sm text-gray-600">
                        Ürün hakkında detaylı bilgi almak için satıcıya mesaj atın. Daha fazla fotoğraf veya pazarlık teklifi isteyebilirsiniz.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white border rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Güvenle Teslim Al</h3>
                    <p className="text-sm text-gray-600">
                        Ürünü görerek ve deneyerek teslim alın. Ortak bir buluşma noktası veya güvenli ödeme yöntemlerini tercih edin.
                    </p>
                </div>
            </div>

            <h3>Önemli Uyarılar</h3>
            <ul>
                <li>Satıcıya kapora veya ön ödeme göndermekten kaçının.</li>
                <li>Buluşma noktası olarak kalabalık ve halka açık yerleri (AVM, kafe, meydan) tercih edin.</li>
                <li>Ürünü etraflıca incelemeden ödeme yapmayın. Elektronik ürünleri mutlaka çalıştırıp test edin.</li>
            </ul>
        </StaticPageLayout>
    );
}
