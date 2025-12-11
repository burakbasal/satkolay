import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Satış İpuçları',
    description: 'Daha hızlı ve karlı satış yapmak için SatKolay ipuçları.',
};

export default function TipsPage() {
    return (
        <StaticPageLayout title="Profesyonel Satış İpuçları">
            <p className="lead text-lg mb-8">
                Ürününüzü dakikalar içinde satmak ister misiniz? İşte deneyimli satıcıların sırları.
            </p>

            <h3>1. Fiyatlandırma Stratejisi</h3>
            <p>
                Ürününüzün piyasa değerini araştırın. Benzer ilanlara bakın ve rekabetçi bir fiyat belirleyin.
                "Pazarlık payı vardır" ibaresini kullanmak alıcıların ilgisini çekebilir. Psikolojik fiyatlandırma (örneğin 500 TL yerine 490 TL) da işe yarar.
            </p>

            <h3>2. Açıklama Kısmı</h3>
            <p>
                Başlık sadece ürün adı olmamalı, detay içermelidir (Örn: "iPhone 11" yerine "Temiz iPhone 11 64GB - Kutusuz").
                Açıklamada ürünün durumunu, ne kadar süre kullanıldığını, herhangi bir kusuru olup olmadığını dürüstçe belirtin.
            </p>

            <h3>3. Görsel Kalitesi</h3>
            <ul>
                <li>Gündüz ışığında çekim yapın.</li>
                <li>Arka planın karmaşık olmamasına dikkat edin.</li>
                <li>Ürünün her açıdan (ön, arka, yan, etiket, detay) fotoğrafını ekleyin.</li>
                <li>Eğer kıyafet satıyorsanız ütülü olmasına özen gösterin.</li>
            </ul>

            <h3>4. İletişim Dili</h3>
            <p>
                Alıcılara karşı nazik ve saygılı olun. Mesajlara hızlı yanıt vermek satış ihtimalini artırır.
                Sorulan sorulara net ve açıklayıcı cevaplar verin.
            </p>

            <h3>5. Profil Güveni</h3>
            <p>
                Profil fotoğrafı eklemek ve telefon doğrulamasını yapmak alıcıların size olan güvenini artırır.
                Diğer satışlarınızdan aldığınız olumlu yorumlar da referans olacaktır.
            </p>
        </StaticPageLayout>
    );
}
