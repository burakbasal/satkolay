import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
    title: 'Sıkça Sorulan Sorular',
    description: 'SatKolay hakkında en çok merak edilenler.',
};

export default function FAQPage() {
    return (
        <StaticPageLayout title="Sıkça Sorulan Sorular">
            <p className="mb-8 text-gray-600">
                Aklınıza takılan soruların cevaplarını burada derledik. Bulamadığınız sorular için bizimle iletişime geçebilirsiniz.
            </p>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>SatKolay'da ilan vermek ücretli mi?</AccordionTrigger>
                    <AccordionContent>
                        Hayır, SatKolay'da standart ilan vermek tamamen ücretsizdir. Belli limitler dahilinde dilediğiniz kadar ücretsiz ilan verebilirsiniz.
                        Öne çıkarma ve vitrin özellikleri ise ücretli opsiyonlardır.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Güvenli ödeme sistemi (Param Güvende) var mı?</AccordionTrigger>
                    <AccordionContent>
                        Şu anda platformumuzda elden teslim ve nakit/havale yöntemi esastır. Gelecekte entegre güvenli ödeme sistemini devreye almayı planlıyoruz.
                        Bu süre zarfında ödemelerinizi ürünü teslim alırken yapmanızı öneririz.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>İlanım neden onaylanmadı?</AccordionTrigger>
                    <AccordionContent>
                        İlanınız "Yasaklı Ürünler" listesinde olabilir, açıklama yetersiz olabilir veya fotoğraflar uygunsuz olabilir.
                        İlan kurallarımızı inceleyip tekrar deneyebilirsiniz.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Şifremi unuttum, ne yapmalıyım?</AccordionTrigger>
                    <AccordionContent>
                        Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinize sıfırlama linki gönderebilirsiniz.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Satılan ürünü nasıl kaldırırım?</AccordionTrigger>
                    <AccordionContent>
                        Profilim > İlanlarım menüsüne gidin. İlgili ilanın yanındaki seçeneklerden "Satıldı Olarak İşaretle" veya "İlanı Sil" seçeneğini kullanabilirsiniz.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </StaticPageLayout>
    );
}
