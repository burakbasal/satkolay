import { createClient } from '@/utils/supabase/server';
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminItemsPage() {
    const supabase = await createClient();

    // Tüm İlanları Çek (Satıcı bilgisiyle beraber)
    // Not: İlişkisel sorgu için foreign key ayarlı olmalı. Şimdilik düz çekiyoruz.
    const { data: items } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

    // Silme İşlemi
    async function deleteItem(formData: FormData) {
        'use server';
        const itemId = formData.get('itemId') as string;
        const supabase = await createClient();
        await supabase.from('items').delete().eq('id', itemId);
        revalidatePath('/admin/items');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">İlanlar</h1>
                <div className="text-sm text-muted-foreground">
                    Toplam <strong>{items?.length || 0}</strong> ilan yayında
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Ürün</th>
                            <th className="px-6 py-4">Fiyat</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items?.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-md bg-gray-100 relative overflow-hidden shrink-0 border">
                                            {item.images?.[0] ? (
                                                <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Yok</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                                            <div className="text-gray-500 text-xs line-clamp-1">{item.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    ₺{item.price?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/item/${item.id}`} target="_blank">
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <form action={deleteItem}>
                                            <input type="hidden" name="itemId" value={item.id} />
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
