'use client';

import { useState } from 'react';
import { DataTable, DataTableCell, DataTableRow } from '@/components/admin/data-table';
import { Button } from "@/components/ui/button";
import { Trash, Search, ArrowRight, MessageSquare } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { deleteMessage } from '@/app/admin/actions';
import { toast } from 'sonner';

interface MessageListClientProps {
    initialMessages: any[];
}

export function MessageListClient({ initialMessages }: MessageListClientProps) {
    const [search, setSearch] = useState('');

    // Filter locally for "Spy Mode" search
    const filteredMessages = initialMessages.filter(m =>
        m.content?.toLowerCase().includes(search.toLowerCase()) ||
        m.sender?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.receiver?.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?')) return;
        try {
            await deleteMessage(id);
            toast.success('Mesaj silindi.');
            // Ideally remove from state locally or refresh, revalidatePath handles refresh on server actions usually 
            // but in client list we might want optimistic update. 
            // For now rely on router refresh or just let server action revalidate page.
        } catch (error) {
            toast.error('Silme işlemi başarısız.');
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <Input
                    placeholder="Mesaj içeriği veya kişi ara..."
                    className="pl-10 bg-slate-950 border-slate-800 text-white w-full max-w-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <DataTable headers={['Gönderen', 'Alıcı', 'Mesaj', 'Tarih', 'İşlem']}>
                {filteredMessages.map((msg) => (
                    <DataTableRow key={msg.id}>
                        <DataTableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">{msg.sender?.full_name || 'Bilinmeyen'}</span>
                                <span className="text-xs text-slate-500">{msg.sender?.email}</span>
                            </div>
                        </DataTableCell>
                        <DataTableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-300 text-sm">{msg.receiver?.full_name || 'Bilinmeyen'}</span>
                                <span className="text-xs text-slate-500">{msg.receiver?.email}</span>
                            </div>
                        </DataTableCell>
                        <DataTableCell>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 max-w-md">
                                <p className="text-slate-300 text-sm">{msg.content}</p>
                            </div>
                        </DataTableCell>
                        <DataTableCell>
                            <span className="text-xs text-slate-500 font-mono">
                                {new Date(msg.created_at).toLocaleString('tr-TR')}
                            </span>
                        </DataTableCell>
                        <DataTableCell>
                            <Button
                                onClick={() => handleDelete(msg.id)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-900/20 text-slate-600 hover:text-red-500"
                                title="Mesajı Sil"
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </DataTableCell>
                    </DataTableRow>
                ))}
                {filteredMessages.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        Mesaj bulunamadı.
                    </div>
                )}
            </DataTable>
        </div>
    );
}
