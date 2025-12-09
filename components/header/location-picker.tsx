'use client';

import { useState } from 'react';
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
    const searchParams = useSearchParams();

    // URL'den gelen (ingilizce) şehri al
    const currentUrlCity = searchParams.get('city');
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Listeyi `constants/cities.ts` dosyasından alıyoruz (Türkçe İsimler)
    // Not: `Object.keys` yerine `map` kullanıyoruz çünkü TURKEY_CITIES bir array.
    const cityNames = TURKEY_CITIES.map(c => c.name).sort();

    // Arama filtresi (Türkçe uyumlu)
    const filteredCities = cityNames.filter(c =>
        c.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))
    );

    const handleSelectCity = (city: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (city === 'all') {
            params.delete('city');
            params.delete('district');
        } else {
            // ÖNEMLİ: Seçilen "İzmir" ismini "Izmir" yapıp URL'e koyuyoruz.
            const urlFriendlyCity = toEnglishCharacters(city);
            params.set('city', urlFriendlyCity);

            params.delete('district');
        }

        router.push(`/?${params.toString()}`);
        setOpen(false);
        setSearch('');
    };

    // Buton üzerindeki yazıyı düzelt (URL "Izmir" ise Ekranda "İzmir" görünsün)
    // Listeden URL'deki "Izmir"e karşılık gelen orijinal Türkçe ismi buluyoruz.
    const displayCity = currentUrlCity
        ? cityNames.find(c => toEnglishCharacters(c) === currentUrlCity) || currentUrlCity
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
                                // Eğer ekrandaki "İzmir" ile URL'deki "Izmir" denk geliyorsa seçili göster
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
