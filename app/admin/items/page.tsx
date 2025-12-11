import { createClient } from '@/utils/supabase/server';
import { DataTable, DataTableCell, DataTableRow } from '@/components/admin/data-table';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { ItemActions } from '@/components/admin/item-actions';

export default async function AdminItemsPage() {
    const supabase = await createClient();
    const { data: items } = await supabase.from('items').select('*').order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">İlan Yönetimi</h2>
                    <p className="text-slate-400">Total {items?.length || 0} ilan.</p>
                </div>
            </div>

            <DataTable headers={['Görsel', 'Başlık', 'Fiyat', 'Durum', 'Öne Çıkan', 'İşlemler']}>
                {items?.map((item) => (
                    <DataTableRow key={item.id}>
                        <DataTableCell>
                            {item.image_urls?.[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={item.image_urls[0]}
                                    alt="item"
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                                    No Img
                                </div>
                            )}
                        </DataTableCell>
                        <DataTableCell>
                            <div className="flex flex-col">
                                <Link href={`/item/${item.id}`} className="font-bold text-white hover:text-blue-400 hover:underline block max-w-[200px] truncate">
                                    {item.title}
                                </Link>
                                <span className="text-xs text-slate-500 font-mono">{item.id.split('-')[0]}</span>
                            </div>
                        </DataTableCell>
                        <DataTableCell>
                            <span className="font-mono text-green-400">{item.price} ₺</span>
                        </DataTableCell>
                        <DataTableCell>
                            {item.is_sold ? (
                                <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-500/20">
                                    Satıldı
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-500/20">
                                    Aktif
                                </span>
                            )}
                        </DataTableCell>
                        <DataTableCell>
                            {item.is_featured ? (
                                <span className="text-yellow-500 flex items-center gap-1 text-xs font-bold"><Star className="w-3 h-3 fill-current" /> Vitrinde</span>
                            ) : (
                                <span className="text-slate-600 text-xs">-</span>
                            )}
                        </DataTableCell>
                        <DataTableCell>
                            <ItemActions itemId={item.id} isFeatured={item.is_featured} />
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTable>
        </div>
    );
}
