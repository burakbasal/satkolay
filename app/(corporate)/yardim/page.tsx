import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Yardım ve Destek Merkezi</h1>
            <p className="text-gray-600">Sıkça sorulan sorulara aşağıdan ulaşabilirsiniz. Cevabını bulamadığınız sorular için bizimle iletişime geçin.</p>

            <Accordion type="single" collapsible className="w-full">

                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-medium text-gray-800">Nasıl ilan verebilirim?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Ana sayfada veya uygulamanın alt kısmında bulunan "İlan Sat" veya "+" butonuna tıklayın. Ürün fotoğraflarını yükleyin, başlık, açıklama ve fiyatı girin. Kategori ve konum bilgilerini seçtikten sonra ilanınızı yayınlayabilirsiniz. İlanınız kısa bir onay sürecinden sonra yayına alınacaktır.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-medium text-gray-800">Doping hizmeti nedir?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Doping, ilanınızın diğer ilanlar arasında öne çıkmasını ve daha fazla alıcı tarafından görüntülenmesini sağlayan ücretli bir hizmettir. "Acil Satış", "Ana Sayfa Vitrini" ve "Kategori Vitrini" gibi farklı doping seçenekleri mevcuttur.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-medium text-gray-800">Güvenli Ödeme Sistemi (Param Güvende) nasıl çalışır?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Alıcı, ürünü satın aldığında ödeme tutarı SatKolay havuz hesabında bloke edilir. Satıcı ürünü kargolar, alıcı ürünü teslim alıp onayladığında tutar satıcının hesabına aktarılır. Eğer ürün sorunluysa alıcı iade talep edebilir ve para iadesi alır. Bu sistem hem alıcıyı hem de satıcıyı korur.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg font-medium text-gray-800">Hangi ürünleri satabilirim?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Kullanılmış veya etiketi üzerinde giyim, elektronik, ev eşyası, araç parçası, spor malzemeleri ve benzeri yasal olan her şeyi satabilirsiniz. Silah, tütün ürünleri, sahte ürünler ve yasal olmayan maddelerin satışı yasaktır.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg font-medium text-gray-800">Hesabımı nasıl kapatabilirim?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Ayarlar menüsünden "Hesabım" bölümüne giderek "Hesabı Sil" seçeneğini kullanabilirsiniz. Hesabınızı sildiğinizde tüm ilanlarınız ve verileriniz kalıcı olarak silinecektir.
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
}
