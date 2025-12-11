import { createClient } from '@/utils/supabase/server';
import { DataTable, DataTableCell, DataTableRow } from '@/components/admin/data-table';
import { Eye, Trash, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminItemsPage() {
    const supabase = await createClient();
    const { data: items } = await supabase.from('items').select('*').order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">İlan Yönetimi</h2>
                    <p className="text-slate-400">Toplam {items?.length || 0} ilan.</p>
                </div>
            </div>

            <DataTable headers={['Görsel', 'Başlık', 'Fiyat', 'Durum', 'Tarih', 'İşlemler']}>
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
                            <Link href={`/item/${item.id}`} className="font-bold text-white hover:text-blue-400 hover:underline">
                                {item.title}
                            </Link>
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
                            {new Date(item.created_at).toLocaleDateString('tr-TR')}
                        </DataTableCell>
                        <DataTableCell>
                            <div className="flex items-center gap-2">
                                <a href={`/item/${item.id}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Görüntüle">
                                    <Eye className="w-4 h-4" />
                                </a>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Sil">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTable>
        </div>
    );
}
