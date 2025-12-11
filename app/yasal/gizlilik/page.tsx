import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gizlilik Politikası',
    description: 'SatKolay Gizlilik Politikası ve Kişisel Verilerin Korunması hakkında bilgilendirme.',
};

export default function PrivacyPage() {
    return (
        <StaticPageLayout title="Gizlilik Politikası" updatedAt="11 Aralık 2025">
            <h3>1. Giriş</h3>
            <p>
                SatKolay olarak, kullanıcılarımızın gizliliğine ve kişisel verilerinin güvenliğine büyük önem veriyoruz.
                Bu Gizlilik Politikası, SatKolay platformunu ("Platform") kullanırken topladığımız, kullandığımız ve paylaştığımız bilgiler hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
            </p>

            <h3>2. Toplanan Bilgiler</h3>
            <p>
                Hizmetlerimizi sağlamak ve geliştirmek için aşağıdaki türde bilgileri toplayabiliriz:
            </p>
            <ul>
                <li><strong>Hesap Bilgileri:</strong> Adınız, e-posta adresiniz, telefon numaranız ve profil fotoğrafınız.</li>
                <li><strong>İlan Bilgileri:</strong> Satışa sunduğunuz ürünlerin fotoğrafları, açıklamaları, fiyatı ve konum bilgisi.</li>
                <li><strong>Kullanım Verileri:</strong> Platformu kullanım şekliniz, arama geçmişiniz ve etkileşimleriniz.</li>
                <li><strong>Cihaz Bilgileri:</strong> IP adresiniz, tarayıcı türünüz ve cihaz kimlik bilgileriniz.</li>
            </ul>

            <h3>3. Bilgilerin Kullanımı</h3>
            <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
            <ul>
                <li>Hizmetlerimizi sunmak, sürdürmek ve iyileştirmek.</li>
                <li>Hesabınızı yönetmek ve güvenliğini sağlamak.</li>
                <li>Sizinle iletişime geçmek (örneğin, güncellemeler veya güvenlik uyarıları hakkında).</li>
                <li>Dolandırıcılığı önlemek ve Platform kurallarını uygulamak.</li>
                <li>Yasal yükümlülüklerimizi yerine getirmek.</li>
            </ul>

            <h3>4. Bilgilerin Paylaşımı</h3>
            <p>
                Kişisel bilgilerinizi üçüncü taraflara satmayız. Ancak, aşağıdaki durumlarda bilgilerinizi paylaşabiliriz:
            </p>
            <ul>
                <li><strong>Yasal Zorunluluklar:</strong> Mahkeme emri veya yasal bir talep durumunda.</li>
                <li><strong>Hizmet Sağlayıcılar:</strong> Ödeme işleme veya veri analizi gibi hizmetleri sağlayan güvenilir iş ortaklarımızla.</li>
            </ul>

            <h3>5. Güvenlik</h3>
            <p>
                Bilgilerinizi korumak için endüstri standardı güvenlik önlemleri alıyoruz. Ancak, internet üzerinden yapılan hiçbir iletimin %100 güvenli olmadığını hatırlatırız.
            </p>

            <h3>6. İletişim</h3>
            <p>
                Gizlilik Politikamızla ilgili sorularınız için bizimle <a href="/iletisim" className="text-blue-600 hover:underline">iletişim</a> sayfasından irtibata geçebilirsiniz.
            </p>
        </StaticPageLayout>
    );
}
