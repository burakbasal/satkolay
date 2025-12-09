import { Input } from "@/components/ui/input"
import { Search, ChevronDown, HelpCircle, FileText, Shield, AlertCircle } from "lucide-react"

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Search */}
            <div className="bg-gradient-to-r from-[#ff3f55] to-[#ff6b7d] py-20 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                        Size nasıl yardımcı olabiliriz?
                    </h1>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <Input
                            className="h-16 pl-14 rounded-full text-lg shadow-xl border-none bg-white placeholder:text-gray-400"
                            placeholder="Bir soru sorun (örn: İlan verme, Ödeme)..."
                        />
                    </div>
                </div>
            </div>

            {/* Quick Categories */}
            <div className="container mx-auto px-4 -mt-10 mb-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { icon: FileText, label: "İlan İşlemleri" },
                        { icon: Shield, label: "Güvenlik" },
                        { icon: HelpCircle, label: "Hesap" },
                        { icon: AlertCircle, label: "Şikayet" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center cursor-pointer border border-gray-100">
                            <item.icon className="w-8 h-8 mx-auto mb-3 text-[#ff3f55]" />
                            <div className="font-bold text-gray-700">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sıkça Sorulan Sorular</h2>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                                <span className="font-bold text-gray-900 text-lg">Nasıl ilan veririm?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed">
                                İlan vermek çok kolay! Sağ üst köşedeki <strong>"Sat"</strong> butonuna tıklayın.
                                Ürün fotoğraflarını yükleyin, açıklayıcı bir başlık ve detaylı bir açıklama girin.
                                Fiyatı belirleyip uygun kategoriyi seçtikten sonra ilanınız editör onayına gönderilir.
                            </div>
                        </details>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                                <span className="font-bold text-gray-900 text-lg">Ödeme güvenli mi?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed">
                                Kesinlikle. SatKolay <strong>Güvenli Ödeme Sistemi</strong> ile paranız güvence altındadır.
                                Siz ürünü teslim alıp onaylayana kadar ödeme satıcıya aktarılmaz. Sorun durumunda paranız iade edilir.
                            </div>
                        </details>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                                <span className="font-bold text-gray-900 text-lg">İlanım neden onaylanmadı?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed">
                                İlanlar topluluk kurallarımıza uymadığı durumlarda reddedilebilir.
                                Yasaklı ürünler, yanıltıcı fiyat, telif hakkı ihlali veya uygunsuz görsel kullanımı
                                en sık karşılaşılan red sebepleridir.
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    )
}
