export default function HelpPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Yardım ve Destek Merkezi</h1>
            <p className="text-gray-600">Sıkça sorulan sorulara aşağıdan ulaşabilirsiniz. Cevabını bulamadığınız sorular için bizimle iletişime geçin.</p>

            <div className="space-y-4">
                {/* SORU 1 */}
                <details className="group border rounded-lg p-4 cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <summary className="font-semibold text-gray-800 list-none flex justify-between items-center select-none">
                        Nasıl ilan verebilirim?
                        <span className="transition-transform duration-300 group-open:rotate-180 text-gray-400">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t pt-4">
                        Ana sayfada veya uygulamanın alt kısmında bulunan "İlan Sat" veya "+" butonuna tıklayın. Ürün fotoğraflarını yükleyin, başlık, açıklama ve fiyatı girin. Kategori ve konum bilgilerini seçtikten sonra ilanınızı yayınlayabilirsiniz. İlanınız kısa bir onay sürecinden sonra yayına alınacaktır.
                    </p>
                </details>

                {/* SORU 2 */}
                <details className="group border rounded-lg p-4 cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <summary className="font-semibold text-gray-800 list-none flex justify-between items-center select-none">
                        Doping hizmeti nedir?
                        <span className="transition-transform duration-300 group-open:rotate-180 text-gray-400">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t pt-4">
                        Doping, ilanınızın diğer ilanlar arasında öne çıkmasını ve daha fazla alıcı tarafından görüntülenmesini sağlayan ücretli bir hizmettir. "Acil Satış", "Ana Sayfa Vitrini" ve "Kategori Vitrini" gibi farklı doping seçenekleri mevcuttur.
                    </p>
                </details>

                {/* SORU 3 */}
                <details className="group border rounded-lg p-4 cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <summary className="font-semibold text-gray-800 list-none flex justify-between items-center select-none">
                        Güvenli Ödeme Sistemi (Param Güvende) nasıl çalışır?
                        <span className="transition-transform duration-300 group-open:rotate-180 text-gray-400">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t pt-4">
                        Alıcı, ürünü satın aldığında ödeme tutarı SatKolay havuz hesabında bloke edilir. Satıcı ürünü kargolar, alıcı ürünü teslim alıp onayladığında tutar satıcının hesabına aktarılır. Eğer ürün sorunluysa alıcı iade talep edebilir ve para iadesi alır. Bu sistem hem alıcıyı hem de satıcıyı korur.
                    </p>
                </details>

                {/* SORU 4 */}
                <details className="group border rounded-lg p-4 cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <summary className="font-semibold text-gray-800 list-none flex justify-between items-center select-none">
                        Hangi ürünleri satabilirim?
                        <span className="transition-transform duration-300 group-open:rotate-180 text-gray-400">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t pt-4">
                        Kullanılmış veya etiketi üzerinde giyim, elektronik, ev eşyası, araç parçası, spor malzemeleri ve benzeri yasal olan her şeyi satabilirsiniz. Silah, tütün ürünleri, sahte ürünler ve yasal olmayan maddelerin satışı yasaktır.
                    </p>
                </details>

                {/* SORU 5 */}
                <details className="group border rounded-lg p-4 cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <summary className="font-semibold text-gray-800 list-none flex justify-between items-center select-none">
                        Hesabımı nasıl kapatabilirim?
                        <span className="transition-transform duration-300 group-open:rotate-180 text-gray-400">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t pt-4">
                        Ayarlar menüsünden "Hesabım" bölümüne giderek "Hesabı Sil" seçeneğini kullanabilirsiniz. Hesabınızı sildiğinizde tüm ilanlarınız ve verileriniz kalıcı olarak silinecektir.
                    </p>
                </details>
            </div>
        </div>
    );
}
