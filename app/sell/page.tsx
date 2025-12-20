'use client';

import { toast } from "sonner";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TURKEY_CITIES } from '@/constants/cities';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { createListing } from './actions';
import { CategoryPicker } from '@/components/category-picker';

export default function SellPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [districts, setDistricts] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removePreview = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        // Automatically move to next step after selection
        setStep(2);
    };

    // STEP 1: Category Selection
    if (step === 1) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Neyi satmak istersin?</h1>
                <CategoryPicker onSelect={handleCategorySelect} selectedCategoryId={selectedCategoryId || undefined} />
                <div className="mt-8 text-center text-sm text-gray-400">
                    <p>Devam etmek için bir kategori seçiniz.</p>
                </div>
            </div>
        );
    }

    // STEP 2: Listing Form
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <button onClick={() => setStep(1)} className="hover:underline text-[#001e93] font-medium">
                    ← Kategori Değiştir
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-6">İlan Detayları</h1>

            <form action={async (formData) => {
                setIsSubmitting(true);
                try {
                    // Inject the selected Category ID manually since it's state-based
                    if (selectedCategoryId) {
                        formData.set('category_id', selectedCategoryId);
                    }

                    const result = await createListing(formData);

                    if (result?.error) {
                        toast.error(result.error);
                        setIsSubmitting(false);
                    } else if (result?.success) {
                        toast.success("Başarılı", {
                            description: "İlanınız onaya gönderildi."
                        });
                        setTimeout(() => {
                            router.push(`/profile/${result.username}`);
                        }, 1000);
                    }
                } catch (error: any) {
                    toast.error("Bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
                    setIsSubmitting(false);
                }
            }} className="space-y-8 pb-32">

                {/* Hidden Fields */}
                <input type="hidden" name="city" value={selectedCity} />
                <input type="hidden" name="district" value={selectedDistrict} />

                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                    <input
                        type="file"
                        name="images"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                            <ImagePlus className="w-8 h-8 text-[#001e93]" />
                        </div>
                        <h3 className="font-bold text-gray-900">Fotoğraf Yükle</h3>
                        <p className="text-sm text-gray-500 mt-1">Sürükle bırak veya seç</p>
                    </div>
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                        {previews.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={url} alt="Önizleme" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removePreview(idx)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
                    <div>
                        <Label>İlan Başlığı</Label>
                        <Input
                            name="title"
                            placeholder="Örn: iPhone 13 128GB Hatasız"
                            required
                            className="mt-1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Fiyat (TL)</Label>
                            <Input name="price" type="number" placeholder="0" required className="mt-1" />
                        </div>
                        <div>
                            <Label>Durum</Label>
                            <Select name="condition">
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">Sıfır</SelectItem>
                                    <SelectItem value="like-new">Yeni Gibi</SelectItem>
                                    <SelectItem value="good">İyi</SelectItem>
                                    <SelectItem value="used">Kullanılmış</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label>Açıklama</Label>
                        <Textarea name="description" placeholder="Ürünün detaylarını, kusurlarını vb. anlat..." required className="mt-1 h-32" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>İl</Label>
                            <Select name="city" onValueChange={(value) => {
                                setSelectedCity(value);
                                const cityData = TURKEY_CITIES.find(c => c.name === value);
                                setDistricts(cityData ? cityData.districts : []);
                            }}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="İl Seç" /></SelectTrigger>
                                <SelectContent>
                                    {TURKEY_CITIES.map((city, index) => (
                                        <SelectItem key={index} value={city.name}>{city.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>İlçe</Label>
                            <Select name="district" disabled={!selectedCity} onValueChange={setSelectedDistrict}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="İlçe Seç" /></SelectTrigger>
                                <SelectContent>
                                    {districts.map((dist, idx) => (
                                        <SelectItem key={idx} value={dist}>{dist}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-28 left-4 right-4 z-50 md:static md:bottom-auto md:left-auto md:right-auto md:z-auto">
                    <Button
                        type="submit"
                        className="w-full bg-[#001e93] hover:bg-[#001e93]/90 h-14 md:h-12 text-lg font-bold shadow-xl border-2 border-white md:border-0"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Yükleniyor...</> : 'İlanı Yayınla'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
