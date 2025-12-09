export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-12 border-b pb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gizlilik Politikası ve Kullanım Şartları</h1>
                <p className="text-gray-500">Son Güncelleme: 02 Aralık 2025</p>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
                <p className="lead">
                    SatKolay olarak verilerinizi koruyoruz. Bu metin, platformumuzu kullanırken haklarınızı ve sorumluluklarımızı açıklar.
                </p>

                <h3>1. Veri Sorumlusu ve Temsilci</h3>
                <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak
                    <strong> SatKolay Teknoloji A.Ş.</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                </p>

                <h3>2. Kişisel Verilerin İşlenme Amacı</h3>
                <p>
                    Toplanan kişisel verileriniz; platformumuzun sunduğu ürün ve hizmetlerden faydalanmanız,
                    işlem güvenliğinin sağlanması, dolandırıcılığın önlenmesi ve yasal yükümlülüklerin yerine getirilmesi
                    amaçlarıyla işlenmektedir.
                </p>

                <h3>3. Çerez (Cookie) Politikası</h3>
                <p>
                    Kullanıcı deneyimini iyileştirmek, site trafiğini analiz etmek ve kişiselleştirilmiş reklamlar sunmak
                    amacıyla çerezler kullanıyoruz. Tarayıcı ayarlarınızdan çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.
                </p>

                <h3>4. Kullanım Şartları</h3>
                <ul>
                    <li>Platformda satılan ürünlerin yasal sorumluluğu satıcıya aittir.</li>
                    <li>SatKolay, kullanıcılar arasındaki uyuşmazlıklarda arabulucu rolü üstlenmez ancak güvenli ödeme sistemi ile süreci yönetir.</li>
                    <li>Yasaklı ürünlerin satışı tespit edildiğinde ilgili ilanlar derhal yayından kaldırılır ve kullanıcı hesabı askıya alınabilir.</li>
                </ul>

                <h3>5. İletişim</h3>
                <p>
                    Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için
                    <a href="mailto:hukuk@satkolay.com" className="text-[#ff3f55] no-underline hover:underline font-bold"> hukuk@satkolay.com</a>
                    adresinden bize ulaşabilirsiniz.
                </p>
            </div>
        </div>
    )
}
