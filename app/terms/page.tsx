export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="mb-12 border-b pb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kullanıcı Sözleşmesi</h1>
                <p className="text-gray-500">Son Güncelleme: 02 Aralık 2025</p>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
                <h3>1. Taraflar</h3>
                <p>
                    İşbu Kullanıcı Sözleşmesi ("Sözleşme"), SatKolay Teknoloji A.Ş. ("SatKolay") ile
                    www.satkolay.com adresindeki platforma üye olan kullanıcı ("Kullanıcı") arasında akdedilmiştir.
                </p>

                <h3>2. Sözleşmenin Konusu</h3>
                <p>
                    İşbu Sözleşme'nin konusu, Kullanıcı'nın SatKolay platformundan faydalanma şartlarının ve
                    tarafların hak ve yükümlülüklerinin belirlenmesidir.
                </p>

                <h3>3. Üyelik Şartları</h3>
                <p>
                    Kullanıcı, üyelik formunda beyan ettiği bilgilerin doğru ve güncel olduğunu kabul eder.
                    SatKolay, bu bilgilerin doğruluğunu araştırmakla yükümlü değildir ancak yanlış beyanlardan
                    kaynaklanabilecek zararlardan Kullanıcı sorumludur.
                </p>

                <h3>4. Hak ve Yükümlülükler</h3>
                <ul>
                    <li><strong>4.1.</strong> Kullanıcı, platformu hukuka ve ahlaka aykırı amaçlarla kullanamaz.</li>
                    <li><strong>4.2.</strong> SatKolay, platformun sürekliliğini sağlamak için gerekli teknik önlemleri alır ancak kesintisiz hizmet garantisi vermez.</li>
                    <li><strong>4.3.</strong> Kullanıcı, gerçekleştirdiği satış işlemlerinden doğan vergisel yükümlülüklerden bizzat sorumludur.</li>
                </ul>

                <h3>5. Güvenli Ödeme Sistemi</h3>
                <p>
                    SatKolay, alıcı ve satıcı arasındaki para transferini güvence altına almak için "Güvenli Ödeme Sistemi" kullanır.
                    Alıcı ürünü teslim alıp onaylayana kadar ödeme SatKolay havuz hesabında tutulur.
                </p>

                <h3>6. Fikri Mülkiyet Hakları</h3>
                <p>
                    Platformun tasarımı, yazılımı, veritabanı ve tüm içeriği SatKolay'ın mülkiyetindedir.
                    İzinsiz kopyalanması veya kullanılması yasaktır.
                </p>

                <h3>7. Sözleşmenin Feshi</h3>
                <p>
                    SatKolay, Kullanıcı'nın işbu Sözleşme'ye aykırı hareket etmesi durumunda üyeliği tek taraflı olarak feshetme hakkına sahiptir.
                </p>

                <h3>8. Uyuşmazlıkların Çözümü</h3>
                <p>
                    İşbu Sözleşme'den doğabilecek uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
                </p>
            </div>
        </div>
    )
}
