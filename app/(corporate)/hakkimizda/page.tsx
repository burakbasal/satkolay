export default function AboutPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Hakkımızda</h1>

            <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="font-semibold text-lg text-gray-800">
                    SatKolay: Türkiye'nin En Hızlı Büyüyen İkinci El Pazaryeri
                </p>
                <p>
                    SatKolay, 2025 yılında İstanbul merkezli olarak kurulmuş, kullanıcıların kullanmadıkları eşyaları güvenli ve hızlı bir şekilde nakite çevirmelerini sağlayan, alıcıları ise aradıkları ürünlerle en uygun fiyatlarla buluşturan yeni nesil bir e-ticaret platformudur. Vizyonumuz, sürdürülebilirlik ilkesiyle hareket ederek eşyaların yaşam döngüsünü uzatmak ve Türkiye'nin en sevilen, en güvenilen ikinci el pazaryeri olmaktır.
                </p>
                <p>
                    Kurulduğumuz günden bu yana teknolojiyi insan odaklı çözümlerle birleştiriyoruz. "Elden al, kartla öde" gibi yenilikçi modellerimiz ve "Güvenli Ödeme Sistemi"miz sayesinde, ikinci el alışverişteki güvensizlik sorununu ortadan kaldırıyoruz. Binlerce kategoride, milyonlarca ürünle her gün büyüyen ailemiz, sadece bir alışveriş platformu değil, aynı zamanda kocaman bir paylaşım ekonomisi topluluğudur.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Misyonumuz</h2>
                <p>
                    Kullanıcılarımıza en pratik, en güvenli ve en karlı ikinci el alışveriş deneyimini sunmak. Ekonomiye katkı sağlarken, tüketim alışkanlıklarını daha bilinçli ve sürdürülebilir bir yöne evriltmek.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Değerlerimiz</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Güven:</strong> Her işlemde şeffaflık ve güvenlik önceliğimizdir. Ödemeler ve teslimatlar SatKolay güvencesindedir.</li>
                    <li><strong>Hız:</strong> İlan vermek saniyeler, aradığını bulmak dakikalar sürer. Zamanın değerini biliyoruz.</li>
                    <li><strong>Topluluk:</strong> Biz sadece alıcı ve satıcıları değil, komşuları ve ortak ilgi alanlarına sahip insanları bir araya getiriyoruz.</li>
                    <li><strong>İnovasyon:</strong> Sürekli gelişen teknolojimizle, mobil öncelikli ve kullanıcı dostu bir deneyim sunuyoruz.</li>
                </ul>

                <p className="mt-8 italic text-gray-500">
                    SatKolay Ailesi olarak, her gün daha iyisi için çalışıyoruz. Bize güvendiğiniz için teşekkür ederiz.
                </p>
            </div>
        </div>
    );
}
