import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kullanım Koşulları',
    description: 'SatKolay Kullanım Koşulları ve Üyelik Sözleşmesi.',
};

export default function TermsPage() {
    return (
        <StaticPageLayout title="Kullanım Koşulları" updatedAt="11 Aralık 2025">
            <h3>1. Taraflar</h3>
            <p>
                İşbu Kullanım Koşulları, SatKolay ("Şirket") ile SatKolay platformuna ("Platform") üye olan kullanıcı ("Kullanıcı") arasında akdedilmiştir.
            </p>

            <h3>2. Sözleşmenin Konusu</h3>
            <p>
                İşbu sözleşmenin konusu, Kullanıcı'nın Platform'dan yararlanma şartlarının belirlenmesidir.
                Platform, ikinci el ürünlerin alım-satımına aracılık eden bir yer sağlayıcıdır.
            </p>

            <h3>3. Kullanıcının Hak ve Yükümlülükleri</h3>
            <ul>
                <li>Kullanıcı, üyelik oluştururken verdiği bilgilerin doğru ve güncel olduğunu beyan eder.</li>
                <li>Kullanıcı, Platform üzerinde hukuka ve ahlaka aykırı içerik paylaşamaz.</li>
                <li>Kullanıcı, satışa sunduğu ürünlerin mülkiyetine sahip olduğunu garanti eder.</li>
                <li>SatKolay, kullanıcılar arasındaki iletişimden veya alışverişten doğacak anlaşmazlıklardan sorumlu tutulamaz.</li>
            </ul>

            <h3>4. Yasaklı Ürünler</h3>
            <p>Aşağıdaki ürünlerin Platform üzerinde satışı yasaktır:</p>
            <ul>
                <li>Ateşli silahlar ve patlayıcı maddeler.</li>
                <li>Reçeteli ilaçlar ve tıbbi cihazlar.</li>
                <li>Taklit veya sahte ürünler.</li>
                <li>Telif hakkı ihlali içeren materyaller.</li>
            </ul>

            <h3>5. Hizmetin Durdurulması</h3>
            <p>
                SatKolay, şüpheli işlem tespit etmesi veya kuralların ihlali durumunda Kullanıcı'nın hesabını askıya alma veya silme hakkını saklı tutar.
            </p>

            <h3>6. Yürürlük</h3>
            <p>
                Kullanıcı, üyelik kaydı yaparak işbu sözleşmenin tüm maddelerini okuduğunu ve kabul ettiğini beyan eder.
            </p>
        </StaticPageLayout>
    );
}
