'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TURKEY_CITIES } from '@/constants/cities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetHeader } from "@/components/ui/sheet";
import { SlidersHorizontal, MapPin, Tag, FilterX, ChevronDown, Navigation } from 'lucide-react';
import { MASTER_DATA } from '@/lib/master-data';
import { getDistrictsWithinRadius } from '@/lib/geolocation';
import { Slider } from "@/components/ui/slider";
import Link from 'next/link';

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Params
    const city = searchParams.get('city') || '';
    const district = searchParams.get('district') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const category = searchParams.get('category') || '';
    const query = searchParams.get('query') || '';

    // Local State
    const [selectedCity, setSelectedCity] = useState(city);
    const [selectedDistrict, setSelectedDistrict] = useState(district);
    const [min, setMin] = useState(minPrice);
    const [max, setMax] = useState(maxPrice);
    const [radius, setRadius] = useState([10]); // Default 10km
    const [isLocating, setIsLocating] = useState(false);

    // Derived
    const cityData = TURKEY_CITIES.find(c => c.name === selectedCity);
    const districts = cityData ? cityData.districts : [];

    // Sync state with URL params
    useEffect(() => {
        setSelectedCity(city);
        setSelectedDistrict(district);
        setMin(minPrice);
        setMax(maxPrice);
    }, [city, district, minPrice, maxPrice]);

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity); else params.delete('city');
        if (selectedDistrict && selectedDistrict !== 'all') params.set('district', selectedDistrict); else params.delete('district');
        if (min) params.set('minPrice', min); else params.delete('minPrice');
        if (max) params.set('maxPrice', max); else params.delete('maxPrice');

        // If performing standard filter, remove special geolocation params if any (optional choice)
        // params.delete('districts'); 

        router.push(`/search?${params.toString()}`);
    };

    const handleClear = () => {
        setSelectedCity(''); setSelectedDistrict(''); setMin(''); setMax('');
        router.push('/search');
    };

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            alert("Tarayıcınız konum servisini desteklemiyor.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const nearbyDistricts = getDistrictsWithinRadius(latitude, longitude, radius[0]);

                if (nearbyDistricts.length === 0) {
                    alert("Bu yarıçapta kayıtlı hizmet bölgemiz bulunamadı.");
                    setIsLocating(false);
                    return;
                }

                const params = new URLSearchParams(searchParams.toString());
                // Remove specific city/district filters to allow radius search to take over
                params.delete('city');
                params.delete('district');
                params.set('districts', nearbyDistricts.join(','));

                router.push(`/search?${params.toString()}`);
                setIsLocating(false);
            },
            (error) => {
                console.error("Location error:", error);
                alert("Konum alınamadı. Lütfen konum izni verin.");
                setIsLocating(false);
            }
        );
    };

    const FilterContent = () => (
        <div className="space-y-6">

            {/* CATEGORIES */}
            <div className="space-y-2">
                <h3 className="font-bold text-gray-900 flex items-center justify-between">
                    Kategoriler
                    {(category || query) && (
                        <Link href="/search" className="text-gray-400 hover:text-red-500 transition-colors" title="Filtreleri Temizle">
                            <FilterX className="w-4 h-4" />
                        </Link>
                    )}
                </h3>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {MASTER_DATA.map((cat) => {
                        const isMainActive = category === cat.title || cat.subCategories?.some(sub => sub.title === category || sub.items?.includes(category || ''));
                        return (
                            <div key={cat.id}>
                                <Link
                                    href={cat.href}
                                    className={`flex items-center justify-between py-2 px-2 rounded-md text-sm font-bold transition-colors ${category === cat.title ? 'bg-red-50 text-[#ff3f55]' : 'text-gray-800 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {cat.icon && <cat.icon className="w-4 h-4" />}
                                        {cat.title}
                                    </div>
                                    {isMainActive && <ChevronDown className="w-3 h-3" />}
                                </Link>

                                {isMainActive && cat.subCategories && (
                                    <div className="ml-2 border-l-2 border-gray-100 pl-3 mt-1 space-y-3">
                                        {cat.subCategories.map((sub, idx) => {
                                            return (
                                                <div key={idx}>
                                                    <Link
                                                        href={sub.href}
                                                        className={`block text-xs font-bold mb-1 ${category === sub.title ? 'text-[#ff3f55]' : 'text-gray-700 hover:text-[#ff3f55]'}`}
                                                    >
                                                        {sub.title}
                                                    </Link>
                                                    <div className="flex flex-col gap-1 pl-1 border-l border-gray-200 ml-1">
                                                        {sub.items?.map((item, i) => {
                                                            const itemTitle = item;
                                                            const itemHref = `${sub.href}&query=${item}`;
                                                            const isSelected = query === itemTitle || category === itemTitle;
                                                            return (
                                                                <Link
                                                                    key={i}
                                                                    href={itemHref}
                                                                    className={`text-[11px] truncate block py-0.5 pl-2 border-l-2 transition-all ${isSelected ? 'text-[#ff3f55] border-[#ff3f55] font-bold' : 'text-gray-500 border-transparent hover:text-black hover:border-gray-300'}`}
                                                                >
                                                                    {itemTitle}
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* LOCATION */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4" /> Konum & Mesafe</h3>

                {/* Geolocation Button */}
                <div className="space-y-2">
                    <Button
                        variant="secondary"
                        onClick={handleNearMe}
                        disabled={isLocating}
                        className="w-full text-[#ff3f55] bg-red-50 hover:bg-red-100 border border-red-100"
                    >
                        {isLocating ? 'Konum Alınıyor...' : (
                            <>
                                <Navigation className="w-4 h-4 mr-2" />
                                Yakınımda Ara ({radius[0]}km)
                            </>
                        )}
                    </Button>
                    <div className="px-1">
                        <Slider
                            value={radius}
                            onValueChange={setRadius}
                            max={50}
                            min={5}
                            step={5}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>5km</span>
                            <span>25km</span>
                            <span>50km</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">VEYA</span>
                    </div>
                </div>

                <Select value={selectedCity} onValueChange={(val) => { setSelectedCity(val); setSelectedDistrict(''); }}>
                    <SelectTrigger><SelectValue placeholder="İl Seçin" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm Türkiye</SelectItem>
                        {TURKEY_CITIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedCity || selectedCity === 'all'}>
                    <SelectTrigger><SelectValue placeholder="İlçe Seçin" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm İlçeler</SelectItem>
                        {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* PRICE */}
            <div className="space-y-2 pt-4 border-t">
                <h3 className="font-bold flex items-center gap-2"><Tag className="w-4 h-4" /> Fiyat Aralığı</h3>
                <div className="flex gap-2">
                    <Input type="number" placeholder="Min TL" value={min} onChange={e => setMin(e.target.value)} />
                    <Input type="number" placeholder="Max TL" value={max} onChange={e => setMax(e.target.value)} />
                </div>
            </div>

            {/* BUTTONS */}
            <div className="pt-4 flex flex-col gap-2">
                <Button onClick={handleFilter} className="w-full bg-[#ff3f55] hover:bg-[#e63548]">Sonuçları Göster</Button>
                <Button variant="outline" onClick={handleClear} className="w-full">Temizle</Button>
            </div>
        </div>
    );

    return (
        <>
            {/* DESKTOP */}
            <div className="hidden lg:block w-full">
                <FilterContent />
            </div>

            {/* MOBILE */}
            <div className="lg:hidden mb-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full"><SlidersHorizontal className="w-4 h-4 mr-2" /> Filtrele</Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader className="mb-4"><SheetTitle>Filtrele</SheetTitle></SheetHeader>
                        <div className="overflow-y-auto max-h-[85vh] pr-2">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
