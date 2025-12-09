import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            {/* İllüstrasyon Alanı */}
            <div className="mb-8 w-full max-w-[300px]">
                <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    {/* Gölgeler */}
                    <ellipse cx="100" cy="140" rx="60" ry="10" fill="#E5E7EB" />

                    {/* Kutu Gövdesi */}
                    <path d="M50 120 L150 120 L160 80 L40 80 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M50 120 L50 70 L40 80 Z" fill="#CBD5E1" />
                    <rect x="50" y="70" width="100" height="50" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />

                    {/* Kutu Kapakları (Açık) */}
                    <path d="M40 80 L20 60 L60 60 L50 70 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
                    <path d="M160 80 L180 60 L140 60 L150 70 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />

                    {/* Büyüteç */}
                    <g transform="rotate(-15 130 50)">
                        <circle cx="130" cy="50" r="25" fill="#fff" stroke="#ff3f55" strokeWidth="3" opacity="0.9" />
                        <path d="M145 65 L165 85" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                        <text x="130" y="58" fontSize="24" textAnchor="middle" fill="#ff3f55" fontFamily="sans-serif" fontWeight="bold">?</text>
                    </g>

                    {/* Floating Elements (Soru işaretleri) */}
                    <text x="40" y="40" fontSize="20" fill="#94A3B8" opacity="0.6">?</text>
                    <text x="170" y="100" fontSize="16" fill="#94A3B8" opacity="0.4">?</text>
                </svg>
            </div>

            {/* Metinler */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Oops! Sayfa Bulunamadı.
            </h1>

            <p className="text-gray-500 text-lg max-w-lg mb-8 leading-relaxed">
                Üzgünüz, aradığınız sayfayı bulamıyoruz. Belki de böyle bir ürün hiç var olmadı ya da çoktan satıldı! Sorun devam ederse lütfen bizimle iletişime geçin.
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                    href="/"
                    className="flex items-center justify-center px-8 py-3 bg-[#ff3f55] text-white font-bold rounded-full hover:bg-[#e63548] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                >
                    Anasayfaya Dön
                </Link>

                <Link
                    href="/search"
                    className="flex items-center justify-center px-8 py-3 bg-transparent border-2 border-[#ff3f55] text-[#ff3f55] font-bold rounded-full hover:bg-red-50 transition-colors"
                >
                    İlanlarda Ara
                </Link>
            </div>
        </div>
    );
}
