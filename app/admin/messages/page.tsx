import { createClient } from '@/utils/supabase/server';
import { DataTable, DataTableCell, DataTableRow } from '@/components/admin/data-table';
import { MessageSquare, Trash, Search, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { deleteMessage } from '@/app/admin/actions';
import { checkAdminAccess } from '@/utils/admin-auth';
import { MessageListClient } from '@/components/admin/message-list-client';

export default async function AdminMessagesPage() {
    await checkAdminAccess();
    const supabase = await createClient();

    // Fetch messages with sender and receiver profiles
    // Warning: unique joining might be needed if schema is specific. 
    // Assuming 'messages' table has 'sender_id', 'receiver_id', 'content', 'created_at'.
    // And standard Supabase relations.

    const { data: messages, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(full_name, email, username),
            receiver:receiver_id(full_name, email, username)
        `)
        .order('created_at', { ascending: false })
        .limit(100); // Spy Mode Limit for performance

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Mesaj Yönetim Merkezi</h2>
                    <p className="text-slate-400">Son 100 mesaj görüntüleniyor (Gizlilik modu: İçerikler şifrelenmemiştir).</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <MessageListClient initialMessages={messages || []} />
            </div>
        </div>
    );
}
