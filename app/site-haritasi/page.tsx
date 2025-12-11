import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Site Haritası',
    description: 'SatKolay tüm sayfalar listesi.',
};

export default function SitemapPage() {
    return (
        <StaticPageLayout title="Site Haritası">
            <div className="grid md:grid-cols-3 gap-12">

                <div>
                    <h3 className="font-bold text-lg border-b pb-2 mb-4">Kurumsal</h3>
                    <ul className="space-y-2 text-blue-600">
                        <li><Link href="/kurumsal/hakkimizda" className="hover:underline">Hakkımızda</Link></li>
                        <li><Link href="/kurumsal/basin" className="hover:underline">Basın Odası</Link></li>
                        <li><Link href="/kurumsal/kariyer" className="hover:underline">Kariyer</Link></li>
                        <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg border-b pb-2 mb-4">Yasal & Destek</h3>
                    <ul className="space-y-2 text-blue-600">
                        <li><Link href="/yasal/kullanim-kosullari" className="hover:underline">Kullanım Koşulları</Link></li>
                        <li><Link href="/yasal/gizlilik" className="hover:underline">Gizlilik Politikası</Link></li>
                        <li><Link href="/destek/sss" className="hover:underline">Sıkça Sorulan Sorular</Link></li>
                        <li><Link href="/iletisim" className="hover:underline">İletişim</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg border-b pb-2 mb-4">Rehberler</h3>
                    <ul className="space-y-2 text-blue-600">
                        <li><Link href="/rehber/nasil-satilir" className="hover:underline">Nasıl Satılır?</Link></li>
                        <li><Link href="/rehber/nasil-alinir" className="hover:underline">Nasıl Alınır?</Link></li>
                        <li><Link href="/rehber/guvenlik" className="hover:underline">Güvenli Alışveriş</Link></li>
                        <li><Link href="/rehber/ipuclari" className="hover:underline">Satış İpuçları</Link></li>
                    </ul>
                </div>

            </div>
        </StaticPageLayout>
    );
}
