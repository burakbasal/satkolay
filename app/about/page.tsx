import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-16">
                <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-200 border-none px-4 py-1">Hikayemiz</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">SatKolay Hakkında</h1>
                <div className="w-24 h-1.5 bg-[#ff3f55] mx-auto rounded-full"></div>
            </div>

            <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
                <p className="text-xl md:text-2xl text-gray-800 font-medium mb-8 text-center leading-relaxed">
                    "SatKolay, ikinci el alışverişi güvenli ve kolay hale getirmek için 2025 yılında <span className="text-[#ff3f55] font-bold">Burak Başal</span> tarafından kurulmuştur."
                </p>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
                    <p className="mb-6">
                        Amacımız, kullanılmayan eşyaları ekonomiye kazandırmak ve kullanıcılarımıza en hızlı satış deneyimini sunmaktır.
                        Teknolojinin gücünü kullanarak, alıcı ve satıcıları en güvenli ortamda buluşturuyoruz.
                    </p>
                    <p>
                        Sürdürülebilirlik vizyonumuzla, her ürünün ikinci bir şansı hak ettiğine inanıyoruz.
                        SatKolay ile hem bütçenize hem de doğaya katkıda bulunabilirsiniz.
                    </p>
                </div>

                {/* Signature Section */}
                <div className="flex flex-col items-center justify-center mt-12 pt-8 border-t border-gray-200">
                    <div className="text-center">
                        <div className="font-handwriting text-4xl text-gray-800 mb-2" style={{ fontFamily: 'cursive' }}>Burak Başal</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Kurucu & CEO</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
