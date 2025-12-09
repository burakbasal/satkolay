'use client';

import { useState, useEffect } from 'react';
import { TURKEY_CITIES } from '@/constants/cities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function SearchLocationFilter({ currentCity, currentDistrict }: { currentCity?: string, currentDistrict?: string }) {
    const [selectedCity, setSelectedCity] = useState<string>(currentCity || "");
    const [districts, setDistricts] = useState<string[]>([]);

    useEffect(() => {
        if (selectedCity) {
            const cityData = TURKEY_CITIES.find(c => c.name === selectedCity);
            setDistricts(cityData ? cityData.districts : []);
        } else {
            setDistricts([]);
        }
    }, [selectedCity]);

    return (
        <div className="space-y-3">
            <div>
                <Label className="text-xs font-bold text-gray-500 uppercase">İl</Label>
                <Select name="city" value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="İl Seç" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm Türkiye</SelectItem>
                        {TURKEY_CITIES.map((city) => (
                            <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-xs font-bold text-gray-500 uppercase">İlçe</Label>
                <Select name="district" value={currentDistrict || ""} disabled={!selectedCity || selectedCity === 'all'}>
                    <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="İlçe Seç" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm İlçeler</SelectItem>
                        {districts.map((dist) => (
                            <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
