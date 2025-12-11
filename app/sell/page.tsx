'use client';

import { toast } from "sonner";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MASTER_DATA } from '@/lib/master-data';
import { TURKEY_CITIES } from '@/constants/cities';
import { ImagePlus, Loader2, ChevronRight, Check, X } from 'lucide-react';
import { createListing } from './actions';

export default function SellPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
    const [selectedDetail, setSelectedDetail] = useState<string>(""); // 3. Seviye (Renault vb.)
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Yeni state
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
        // Not: Gerçek input'tan dosya silmek için DataTransfer gerekir, şimdilik sadece görseli kaldırıyoruz.
    };



    // ADIM 1: Ana Kategori
    if (step === 1) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Neyi satmak istersin?</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {MASTER_DATA.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat); setStep(2); }}
                            className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-[#001e93] hover:bg-blue-50 transition gap-3 group bg-white shadow-sm"
                        >
                            <cat.icon className="w-8 h-8 text-gray-500 group-hover:text-[#001e93]" />
                            <span className="font-medium text-gray-900">{cat.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ADIM 2: Alt Kategori
    if (step === 2) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <button onClick={() => setStep(1)} className="text-gray-500 mb-4 hover:underline flex items-center gap-1">← Geri</button>
                <h1 className="text-2xl font-bold mb-6">{selectedCategory.title} &gt; Alt Kategori</h1>
                <div className="space-y-2">
                    {selectedCategory?.subCategories?.map((sub: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setSelectedSubCategory(sub);
                                // Eğer alt detaylar varsa Adım 3'e, yoksa Adım 4'e (Form) git
                                if (sub.items && sub.items.length > 0) {
                                    setStep(3);
                                } else {
                                    setStep(4);
                                }
                            }}
                            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 text-left bg-white shadow-sm"
                        >
                            <span className="font-medium">{sub.title}</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ADIM 3: Detay Seçimi (Renault, iPhone vb.) - YENİ EKLENDİ
    if (step === 3) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <button onClick={() => setStep(2)} className="text-gray-500 mb-4 hover:underline flex items-center gap-1">← Geri</button>
                <h1 className="text-2xl font-bold mb-6">{selectedSubCategory.title} Seçimi</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedSubCategory?.items?.map((item: any, idx: number) => {
                        const itemName = typeof item === 'string' ? item : item.title;
                        return (
                            <button
                                key={idx}
                                onClick={() => { setSelectedDetail(itemName); setStep(4); }}
                                className="p-3 border rounded-lg hover:border-[#001e93] hover:bg-blue-50 text-center text-sm font-medium bg-white"
                            >
                                {itemName}
                            </button>
                        )
                    })}
                </div>
            </div>
        );
    }

    // ADIM 4: İlan Formu
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span onClick={() => setStep(1)} className="cursor-pointer hover:underline">{selectedCategory.title}</span> ›
                <span onClick={() => setStep(2)} className="cursor-pointer hover:underline">{selectedSubCategory.title}</span> ›
                {selectedDetail && <span className="font-bold text-gray-900">{selectedDetail}</span>}
            </div>

            <h1 className="text-2xl font-bold mb-6">İlan Detayları</h1>

            <form action={async (formData) => {
                // setLoading(true); // Artık isSubmitting kullanacağız ama loading'i de set etsek zarar gelmez
                setIsSubmitting(true);

                try {
                    const result = await createListing(formData); // createListing artık obje dönüyor

                    if (result?.error) {
                        toast.error(result.error);
                        setIsSubmitting(false);
                    } else if (result?.success) {
                        toast.success("Başarılı", {
                            description: "İlanınız onaya gönderildi."
                        });
                        // Hızlıca yönlendir (1sn bekle ki DB otursun)
                        setTimeout(() => {
                            router.push(`/profile/${result.username}`);
                        }, 1000);
                    }
                } catch (error: any) {
                    toast.error("Bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
                    setIsSubmitting(false);
                }
            }} className="space-y-8 pb-32">
                {/* ... existing fields ... */}
                {/* Gizli Veriler (Backend'e gidecek) */}
                <input type="hidden" name="category" value={selectedCategory?.title} />
                <input type="hidden" name="subCategory" value={selectedSubCategory?.title} />
                <input type="hidden" name="detail" value={selectedDetail} />
                <input type="hidden" name="city" value={selectedCity} />
                <input type="hidden" name="district" value={selectedDistrict} />

                {/* Görsel Yükleme */}
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

                {/* Önizleme Grid */}
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
                            defaultValue={selectedDetail ? `${selectedDetail} - ` : ''}
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

                    {/* DYNAMIC FORM FIELDS */}
                    {selectedCategory?.formFields && (
                        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                            <h3 className="col-span-2 font-bold text-gray-900">Özellikler</h3>
                            {selectedCategory.formFields.map((field: any, idx: number) => (
                                <div key={idx} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                    <Label>{field.label}</Label>
                                    {field.type === 'select' ? (
                                        <Select name={field.name}>
                                            <SelectTrigger className="mt-1"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                            <SelectContent>
                                                {field.options.map((opt: string, i: number) => (
                                                    <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input name={field.name} type={field.type} placeholder={field.placeholder} className="mt-1" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="fixed bottom-28 left-4 right-4 z-50 md:static md:bottom-auto md:left-auto md:right-auto md:z-auto">
                    <Button
                        type="submit"
                        className="w-full bg-[#001e93] hover:bg-[#001e93]/90 h-14 md:h-12 text-lg font-bold shadow-xl border-2 border-white md:border-0"
                        disabled={isSubmitting} // BUTON KESİNLİKLE DISABLED OLACAK
                    >
                        {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Yükleniyor...</> : 'İlanı Yayınla'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
