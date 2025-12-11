import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import { Camera, Edit, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Nasıl Satılır?',
    description: 'SatKolay ile ürün satmak çok kolay. Adım adım satış rehberi.',
};

export default function HowToSellPage() {
    return (
        <StaticPageLayout title="Nasıl Satılır?">
            <p className="lead text-lg mb-8">
                Evinizdeki fazlalıklardan kurtulmak ve kazanç sağlamak hiç bu kadar kolay olmamıştı. İşte 3 adımda satış rehberi:
            </p>

            <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Camera className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">1. Fotoğraf Çek</h3>
                        <p>
                            Ürününüzün net, aydınlık ve farklı açılardan fotoğraflarını çekin. İyi bir fotoğraf, satış hızını %50 artırır.
                            Arka planın sade olmasına ve ürünün detaylarının (varsa kusurlarının da) görünmesine dikkat edin.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Edit className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">2. İlanı Oluştur</h3>
                        <p>
                            "SAT" butonuna tıklayarak fotoğrafları yükleyin. İlgi çekici bir başlık ve detaylı bir açıklama yazın.
                            Mantıklı bir fiyat belirleyin. Benzer ürünlerin fiyatlarına bakarak rekabetçi olabilirsiniz.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">3. Anlaş ve Sat</h3>
                        <p>
                            Alıcılarla SatKolay mesajlaşma sistemi üzerinden iletişime geçin. Güvenli bir buluşma noktası belirleyin veya
                            kargo ile gönderim yapın. Ödemeyi güvenli bir şekilde aldığınızdan emin olun.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">İpucu: Hızlı Satış İçin</h4>
                <p className="text-sm">
                    İlanınızı sosyal medyada paylaşarak daha fazla kişiye ulaşabilirsiniz. Ayrıca alıcılardan gelen mesajlara
                    hızlı yanıt vermek güvenilirliğinizi artırır.
                </p>
            </div>
        </StaticPageLayout>
    );
}
