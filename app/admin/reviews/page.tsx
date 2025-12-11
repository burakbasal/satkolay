import { createClient } from '@/utils/supabase/server';
import { DataTable, DataTableCell, DataTableRow } from '@/components/admin/data-table';
import { checkAdminAccess } from '@/utils/admin-auth';
import { Star } from 'lucide-react';

export default async function AdminReviewsPage() {
    await checkAdminAccess();
    const supabase = await createClient();

    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
            *,
            reviewer:reviewer_id(full_name, email),
            target:target_id(full_name, email)
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tight">Değerlendirmeler</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <DataTable headers={['Tarih', 'Değerlendiren', 'Hedef', 'Puan', 'Yorum', 'İşlem']}>
                    {reviews?.map((review: any) => (
                        <DataTableRow key={review.id}>
                            <DataTableCell>
                                <span className="text-slate-500 text-xs">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </DataTableCell>
                            <DataTableCell>
                                <div className="text-white font-medium text-sm">{review.reviewer?.full_name}</div>
                            </DataTableCell>
                            <DataTableCell>
                                <div className="text-slate-300 text-sm">{review.target?.full_name}</div>
                            </DataTableCell>
                            <DataTableCell>
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="ml-1 font-bold">{review.rating}</span>
                                </div>
                            </DataTableCell>
                            <DataTableCell>
                                <p className="text-slate-400 text-sm italic">"{review.comment}"</p>
                            </DataTableCell>
                            <DataTableCell>
                                <button className="text-red-500 hover:text-red-400 text-xs font-bold">Sil</button>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                    {(!reviews || reviews.length === 0) && (
                        <div className="p-8 text-center text-slate-500">
                            Henüz değerlendirme yok.
                        </div>
                    )}
                </DataTable>
            </div>
        </div>
    );
}
