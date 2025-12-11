'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MASTER_DATA } from '@/lib/master-data';
import { TURKEY_CITIES } from '@/constants/cities';
import { updateListing } from '../actions';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchItem = async () => {
            const { id } = await params;
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const { data } = await supabase
                .from('items')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                if (data.seller_id !== user.id) {
                    router.push('/'); // Yetkisiz erişim
                    return;
                }
                setItem(data);
                setSelectedCity(data.city);
                const cat = MASTER_DATA.find(c => c.title === data.category || c.id === data.category);
                setSelectedCategory(cat);
            }
            setLoading(false);
        };
        fetchItem();
    }, []);

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
    if (!item) return <div className="p-10 text-center">İlan bulunamadı.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">İlanı Düzenle</h1>

            <form action={updateListing} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200">
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="category" value={item.category} />

                {/* Resim Alanı */}
                <div className="space-y-4">
                    <Label>Fotoğraflar</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                        <input
                            type="file"
                            name="images"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                                // Önizleme Mantığı (Sadece görsel, form zaten dosyayı alıyor)
                                if (e.target.files) {
                                    const files = Array.from(e.target.files);
                                    // Not: Gerçek preview state'i karmaşıklaşmasın diye burada basit tutuyoruz.
                                    // Kullanıcı submit edince gidecek.
                                    alert(`${files.length} fotoğraf seçildi. (Kaydedince görünecek)`);
                                }
                            }}
                        />
                        <div className="flex flex-col items-center pointer-events-none">
                            <span className="text-[#001e93] font-bold">+ Yeni Fotoğraf Ekle</span>
                        </div>
                    </div>

                    {/* Mevcut Resimler */}
                    {item.image_urls && item.image_urls.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {item.image_urls.map((url: string, idx: number) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group">
                                    <Image src={url} alt="" fill className="object-cover" />
                                    {/* Silme butonu (Basit implementasyon: input hidden ile keep_urls'i yönetmek gerek) */}
                                    {/* Şimdilik sadece gösteriyoruz, silme özelliği complex form gerektirir */}
                                    <input type="hidden" name="keep_urls" value={url} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <Label>Başlık</Label>
                    <Input name="title" defaultValue={item.title} required className="mt-1" />
                </div>

                <div>
                    <Label>Fiyat (TL)</Label>
                    <Input name="price" type="number" defaultValue={item.price} required className="mt-1" />
                </div>

                <div>
                    <Label>Açıklama</Label>
                    <Textarea name="description" defaultValue={item.description} required className="mt-1 h-32" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>İl</Label>
                        <Select name="city" defaultValue={item.city} onValueChange={setSelectedCity}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="İl Seçin" /></SelectTrigger>
                            <SelectContent>
                                {TURKEY_CITIES.map(city => (
                                    <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>İlçe</Label>
                        <Select name="district" defaultValue={item.district}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="İlçe Seçin" /></SelectTrigger>
                            <SelectContent>
                                {TURKEY_CITIES.find(c => c.name === selectedCity)?.districts.map(dist => (
                                    <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* DİNAMİK ÖZELLİKLER */}
                {selectedCategory?.formFields && (
                    <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                        <h3 className="col-span-2 font-bold text-gray-900">Özellikler</h3>
                        {selectedCategory.formFields.map((field: any, idx: number) => (
                            <div key={idx} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                <Label>{field.label}</Label>
                                {field.type === 'select' ? (
                                    <Select name={field.name} defaultValue={item.attributes?.[field.name.replace('attr_', '')]}>
                                        <SelectTrigger className="mt-1"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                        <SelectContent>
                                            {field.options.map((opt: string, i: number) => (
                                                <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        name={field.name}
                                        type={field.type}
                                        defaultValue={item.attributes?.[field.name.replace('attr_', '')]}
                                        className="mt-1"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <Button type="submit" className="w-full bg-[#001e93] hover:bg-[#e63548] text-white font-bold py-3 mt-4">
                    Güncelle
                </Button>
            </form>
        </div>
    );
}
