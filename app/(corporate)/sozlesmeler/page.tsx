export default function ContractsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Kullanıcı Sözleşmesi ve Hukuki Metinler</h1>

            <div className="bg-gray-50 p-6 rounded-lg border text-sm text-gray-700 h-[600px] overflow-y-auto custom-scrollbar">
                <h2 className="text-lg font-bold text-black mb-4">1. TARAFLAR</h2>
                <p className="mb-4">
                    İşbu Sözleşme; "SatKolay Bilişim Teknolojileri A.Ş." (bundan böyle "SatKolay" olarak anılacaktır) ile Web Sitesi'ne üye olan kullanıcı ("Üye") arasında akdedilmiştir.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">2. TANIMLAR</h2>
                <p className="mb-4">
                    <strong>Site:</strong> SatKolay tarafından belirlenen çerçeve içerisinde çeşitli hizmetlerin ve içeriklerin sunulduğu çevrimiçi ortamı ifade eder.<br />
                    <strong>Üye:</strong> Site'ye üye olan ve Site dahilinde sunulan hizmetlerden işbu sözleşmede belirtilen koşullar dahilinde yararlanan gerçek veya tüzel kişiyi ifade eder.<br />
                    <strong>Hizmet:</strong> Üyelerin işbu Sözleşme içerisinde tanımlı olan iş ve işlemlerini gerçekleştirmelerini sağlamak amacıyla SatKolay tarafından ortaya konulan uygulamaları ifade eder.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">3. SÖZLEŞMENİN KONUSU VE KAPSAMI</h2>
                <p className="mb-4">
                    İşbu Sözleşme'nin konusu, Site'de sunulan hizmetlerin, bu hizmetlerden yararlanma şartlarının ve tarafların hak ve yükümlülüklerinin tespitidir. Site, ikinci el ürünlerin, alıcılar ve satıcılar arasında alım satımına aracılık eden bir platformdur.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">4. ÜYELİK ŞARTLARI</h2>
                <p className="mb-4">
                    4.1. Üyelik, Site'nin ilgili bölümünden, Üye olmak isteyen kişi tarafından Site'ye üye olmak için gerekli kimlik bilgilerinin gönderilmesi suretiyle kayıt işleminin yaptırılması ile tamamlanır.<br />
                    4.2. Üye, Site'ye üye olurken verdiği kişisel ve diğer sair bilgilerin kanunlar önünde doğru olduğunu, SatKolay'ın bu bilgilerin gerçeğe aykırılığı nedeniyle uğrayacağı tüm zararları aynen ve derhal tazmin edeceğini beyan ve taahhüt eder.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">5. GÜVENLİ ÖDEME VE İLADE SÜREÇLERİ</h2>
                <p className="mb-4">
                    5.1. SatKolay, alıcı ve satıcı arasındaki ödeme güvenliğini sağlamak amacıyla "Güvenli Ödeme Sistemi" sunmaktadır. Bu sistemde, alıcı ödemeyi SatKolay havuz hesabına yapar, ürün teslim alınıp onaylanana kadar tutar satıcıya aktarılmaz.<br />
                    5.2. Alıcı, ürünü teslim aldıktan sonra 24 saat içinde onay veya iade talebi oluşturmalıdır. Aksi takdirde işlem otomatik olarak onaylanmış sayılır.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">6. GİZLİLİK</h2>
                <p className="mb-4">
                    SatKolay, Üye'nin kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuata uygun olarak işlemekte ve korumaktadır. Detaylı bilgi için Gizlilik Politikası sayfası ziyaret edilmelidir.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">7. FİKRİ MÜLKİYET HAKLARI</h2>
                <p className="mb-4">
                    Site'nin tüm elemanları (tasarım, metin, imge, html kodu ve diğer kodlar da dahil fakat bunlarla sınırlı olmamak kaydıyla) SatKolay telif haklarına tabidir.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">8. SÖZLEŞMENİN FESHİ</h2>
                <p className="mb-4">
                    İşbu sözleşme Üye'nin üyeliğini iptal etmesi veya SatKolay tarafından üyeliğinin iptal edilmesine kadar yürürlükte kalacaktır.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">9. YETKİLİ MAHKEME</h2>
                <p className="mb-4">
                    İşbu Sözleşme'nin uygulanmasından doğabilecek uyuşmazlıkların çözümünde İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
                </p>

                <h2 className="text-lg font-bold text-black mb-4">10. YÜRÜRLÜK</h2>
                <p className="mb-4">
                    Üye'nin, üyelik kaydı yapması, işbu Sözleşme'de yer alan tüm maddeleri okuduğu ve kabul ettiği anlamına gelir. İşbu Sözleşme üyenin üye olması anında akdedilmiş ve karşılıklı olarak yürürlülüğe girmiştir.
                </p>
            </div>

            <p className="text-xs text-gray-500">Son Güncelleme: 11 Aralık 2025</p>
        </div>
    );
}
