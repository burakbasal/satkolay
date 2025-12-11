import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'İkinci el dünyasından haberler, trendler ve ipuçları.',
};

export default function BlogPage() {
    return (
        <StaticPageLayout title="SatKolay Blog">
            <p className="lead text-lg mb-10 text-gray-600">
                İkinci el dünyasını keşfedin. Tasarruf ipuçları, dekorasyon fikirleri ve teknoloji trendleri burada.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Blog Post 1 */}
                <div className="border rounded-xl overflows-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 w-full relative">
                        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center text-blue-300 font-bold text-4xl">1</div>
                    </div>
                    <div className="p-6">
                        <span className="text-xs font-bold text-blue-600 uppercase">Trendler</span>
                        <h3 className="font-bold text-xl mt-2 mb-2 group-hover:text-blue-600">2025'in En Çok Aranan İkinci El Ürünleri</h3>
                        <p className="text-sm text-gray-500 line-clamp-3">
                            Yeni yılda tüketicilerin yöneldiği sürdürülebilir moda ve teknoloji ürünlerini inceledik. İşte listenin başındaki o ürünler...
                        </p>
                        <Link href="#" className="block mt-4 text-sm font-bold underline">Devamını Oku</Link>
                    </div>
                </div>

                {/* Blog Post 2 */}
                <div className="border rounded-xl overflows-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 w-full relative">
                        <div className="absolute inset-0 bg-green-100 flex items-center justify-center text-green-300 font-bold text-4xl">2</div>
                    </div>
                    <div className="p-6">
                        <span className="text-xs font-bold text-green-600 uppercase">Rehber</span>
                        <h3 className="font-bold text-xl mt-2 mb-2 group-hover:text-blue-600">Eşyalarınızı Fotoğraflamanın Püf Noktaları</h3>
                        <p className="text-sm text-gray-500 line-clamp-3">
                            İlanlarınızın daha hızlı satılmasını istiyorsanız doğru ışık ve açı kullanımı şart. Profesyonel ipuçlarıyla satışlarınızı katlayın.
                        </p>
                        <Link href="#" className="block mt-4 text-sm font-bold underline">Devamını Oku</Link>
                    </div>
                </div>

                {/* Blog Post 3 */}
                <div className="border rounded-xl overflows-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 w-full relative">
                        <div className="absolute inset-0 bg-purple-100 flex items-center justify-center text-purple-300 font-bold text-4xl">3</div>
                    </div>
                    <div className="p-6">
                        <span className="text-xs font-bold text-purple-600 uppercase">Yaşam</span>
                        <h3 className="font-bold text-xl mt-2 mb-2 group-hover:text-blue-600">Minimalist Yaşam: Fazlalıklardan Kurtulun</h3>
                        <p className="text-sm text-gray-500 line-clamp-3">
                            Sadece ihtiyacınız olanla yaşamanın hafifliğini keşfedin. Kullanmadığınız eşyaları satarak hem evinizi hem zihninizi boşaltın.
                        </p>
                        <Link href="#" className="block mt-4 text-sm font-bold underline">Devamını Oku</Link>
                    </div>
                </div>
            </div>
        </StaticPageLayout>
    );
}
