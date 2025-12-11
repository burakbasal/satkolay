import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hakkımızda',
    description: 'SatKolay hakkında, misyonumuz ve vizyonumuz.',
};

export default function AboutPage() {
    return (
        <StaticPageLayout title="Hakkımızda">
            <p className="lead text-xl text-gray-600 font-medium mb-8">
                SatKolay, Türkiye'nin en hızlı büyüyen ve en güvenilir ikinci el pazar yeri olma hedefiyle yola çıktı.
            </p>

            <h3>Hikayemiz</h3>
            <p>
                2024 yılında kurulan SatKolay, kullanılmayan eşyaların ekonomiye kazandırılması ve sürdürülebilir bir tüketim alışkanlığının yaygınlaştırılması amacıyla doğdu.
                "Eskiyi sat, yeniyi al" mantığının ötesine geçerek, topluluk odaklı güvenli bir ticaret ortamı yaratmayı hedefliyoruz.
            </p>

            <h3>Misyonumuz</h3>
            <p>
                İkinci el alışverişi herkes için erişilebilir, hızlı ve güvenli hale getirmek. Teknolojinin gücünü kullanarak, alıcı ve satıcıları en doğru şekilde bir araya getirmek ve karbon ayak izini azaltmaya katkıda bulunmak.
            </p>

            <h3>Değerlerimiz</h3>
            <ul>
                <li><strong>Güven:</strong> Şeffaf ve dürüst bir platform sunmak önceliğimizdir.</li>
                <li><strong>Hız:</strong> İlan vermeyi ve ürün bulmayı saniyeler seviyesine indirmek.</li>
                <li><strong>Topluluk:</strong> Yerel ticareti destekleyerek komşuluk ve dayanışma kültürünü güçlendirmek.</li>
                <li><strong>Sürdürülebilirlik:</strong> Daha az atık, daha çok değer.</li>
            </ul>

            <h3>Neden SatKolay?</h3>
            <p>
                Gelişmiş yapay zeka destekli filtreleme sistemimiz, güvenli mesajlaşma altyapımız ve kullanıcı dostu arayüzümüz ile ikinci el alışveriş deneyimini yeniden tanımlıyoruz.
                Diyarbakır merkezli başladığımız bu yolculukta, kısa sürede tüm Türkiye'nin tercihi haline gelmeyi hedefliyoruz.
            </p>
        </StaticPageLayout>
    );
}
