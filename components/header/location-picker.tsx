'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, ChevronDown, Search, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TURKEY_CITIES } from '@/constants/cities';

// URL İÇİN TÜRKÇE KARAKTER TEMİZLEYİCİ
function toEnglishCharacters(str: string) {
    return str
        .replace(/Ğ/g, "G").replace(/ğ/g, "g")
        .replace(/Ü/g, "U").replace(/ü/g, "u")
        .replace(/Ş/g, "S").replace(/ş/g, "s")
        .replace(/İ/g, "I").replace(/ı/g, "i")
        .replace(/Ö/g, "O").replace(/ö/g, "o")
        .replace(/Ç/g, "C").replace(/ç/g, "c");
}

export function LocationPicker() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // Listeyi `constants/cities.ts` dosyasından alıyoruz (Türkçe İsimler)
    // Türkçe karakterlere göre sıralama (A-Z)
    const cityNames = TURKEY_CITIES.map(c => c.name).sort((a, b) => a.localeCompare(b, 'tr'));

    // COOKIE OKUMA (MOUNT EDİLİNCE)
    useEffect(() => {
        const match = document.cookie.match(new RegExp('(^| )user_city=([^;]+)'));
        if (match) {
            // Cookie'de encoding olabilir, decodeURIComponent ile al
            setSelectedCity(decodeURIComponent(match[2]));
        }
    }, []);

    // Arama filtresi (Türkçe uyumlu)
    const filteredCities = cityNames.filter(c =>
        c.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))
    );

    const handleSelectCity = (city: string) => {
        if (city === 'all') {
            // Çerezi sil (veya boşalt)
            document.cookie = "user_city=; path=/; max-age=0";
            setSelectedCity(null);
        } else {
            // Çerezi kaydet (1 Yıl)
            const val = toEnglishCharacters(city); // Veya direkt city, ama clean URL istendiği için burada da normalizasyon yapabiliriz. 
            // Kullanıcı "URL değişmesin" dedi ama filtrenin çalışması için backend'in beklediği formda atmalıyız.
            // Backend `normalizeCityInput` kullanıyor mu? Backend 'app/page.tsx' -> normalizeCityInput kullanıyor.
            // app/page.tsx'de `dbCity` normalizasyon yapıyor. O yüzden buraya ham veya normalized atabiliriz.
            // Plan: "Seçilen 'İzmir' ismini 'Izmir' yapıp" demişti önceki task. 
            // Burada da tutarlılık için normalized atalım.
            const cookieValue = toEnglishCharacters(city);

            document.cookie = `user_city=${encodeURIComponent(cookieValue)}; path=/; max-age=31536000`; // 1 yıl
            setSelectedCity(cookieValue);
        }

        setOpen(false);
        setSearch('');

        // Sayfayı yenile (Server Component cookie'yi okuyup filtrelesin)
        router.refresh();
    };

    // Görüntüleme için: Eğer selectedCity varsa, listeden orijinal ismini bul (Geri dönüşüm)
    const displayCity = selectedCity
        ? cityNames.find(c => toEnglishCharacters(c) === selectedCity) || selectedCity
        : "Tüm Türkiye";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 md:px-4 md:py-2.5 hover:bg-gray-50 text-gray-700 font-medium whitespace-nowrap transition-colors mr-2">
                    <MapPin className="w-4 h-4 text-[#ff3f55]" />
                    {/* Mobilde yazı gizlensin, yer kaplamasın */}
                    <span className="hidden md:block max-w-[100px] lg:max-w-[150px] truncate">{displayCity}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Konum Seç</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Arama */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Şehir ara..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Liste */}
                    <div className="h-[300px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                        <Button
                            variant="ghost"
                            className="w-full justify-start font-bold"
                            onClick={() => handleSelectCity('all')}
                        >
                            Tüm Türkiye
                        </Button>
                        {filteredCities.map((city) => (
                            <Button
                                key={city}
                                variant="ghost"
                                className={`w-full justify-start font-normal ${displayCity === city ? 'bg-red-50 text-[#ff3f55]' : ''}`}
                                onClick={() => handleSelectCity(city)}
                            >
                                {city}
                                {displayCity === city && <Check className="ml-auto w-4 h-4" />}
                            </Button>
                        ))}
                        {filteredCities.length === 0 && (
                            <div className="text-center text-gray-500 py-4">Şehir bulunamadı.</div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
