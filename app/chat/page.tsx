'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Send, ChevronLeft, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// TİPLER
type Item = { id: string; title: string; price: number; image_urls: string[] };
type Conversation = {
    id: string;
    user1: any;
    user2: any;
    item: Item | null; // Ürün bilgisi eklendi
    updated_at: string;
};




type Message = { id: string; content: string; sender_id: string; created_at: string };

const QUICK_REPLIES = [
    "📦 Hala satılık mı?",
    "💰 Son fiyat ne olur?",
    "📍 Tam konum neresi?",
    "🔄 Takas düşünür müsün?"
];

export default function ChatPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userId, setUserId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const contextItemId = searchParams.get('itemId');
    const contextSellerId = searchParams.get('sellerId');

    // 1. INIT
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return router.push('/login');
            setUserId(user.id);
        };
        init();
    }, []);

    // 2. FETCH CONVERSATIONS (ITEM DAHİL)
    useEffect(() => {
        if (!userId) return;
        const fetchConvs = async () => {
            const { data } = await supabase
                .from('conversations')
                .select(`
           *, 
           user1:profiles!user1_id(*), 
           user2:profiles!user2_id(*),
           item:items(id, title, price, image_urls)
        `)
                .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
                .order('updated_at', { ascending: false });

            if (data) {
                setConversations(data as any);

                // Eğer URL'den satıcı ve ürünle gelindiyse, o sohbeti bul veya oluştur
                if (contextSellerId && contextItemId) {
                    const exist = data.find((c: any) =>
                        (c.user1.id === contextSellerId || c.user2.id === contextSellerId) &&
                        c.item_id === contextItemId
                    );
                    if (exist) setSelectedChat(exist as any);
                    else createNewConversation(contextSellerId, contextItemId);
                }
            }
        };
        fetchConvs();

        const ch = supabase.channel('public:conversations').on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchConvs).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [userId, contextSellerId, contextItemId]);

    const createNewConversation = async (sellerId: string, itemId: string) => {
        const { data } = await supabase
            .from('conversations')
            .insert({ user1_id: userId, user2_id: sellerId, item_id: itemId })
            .select(`*, user1:profiles!user1_id(*), user2:profiles!user2_id(*), item:items(id, title, price, image_urls)`)
            .single();

        if (data) {
            setConversations(p => [data as any, ...p]);
            setSelectedChat(data as any);
        }
    };

    // 3. FETCH MESSAGES
    useEffect(() => {
        if (!selectedChat) return;
        const fetchMsgs = async () => {
            const { data } = await supabase.from('direct_messages').select('*').eq('conversation_id', selectedChat.id).order('created_at', { ascending: true });
            if (data) setMessages(data);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'auto' }), 50);
        };
        fetchMsgs();

        const ch = supabase.channel(`chat:${selectedChat.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages', filter: `conversation_id=eq.${selectedChat.id}` }, (payload) => {
            setMessages(p => [...p, payload.new as Message]);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [selectedChat]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || !userId) return;
        const msg = newMessage;
        setNewMessage("");
        await supabase.from('direct_messages').insert({ conversation_id: selectedChat.id, sender_id: userId, content: msg });
        await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', selectedChat.id);
    };

    const getOther = (c: Conversation) => (c.user1.id === userId ? c.user2 : c.user1);

    if (!userId) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex h-[100dvh] w-full overflow-hidden">

            {/* --- SOL LİSTE --- */}
            <div className={`w-full md:w-[350px] flex flex-col border-r bg-white ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="h-16 flex items-center justify-between px-4 border-b shrink-0 bg-white">
                    <span className="font-bold text-lg">Mesajlar</span>
                    <button onClick={() => router.push('/')} className="md:hidden text-sm text-red-500 font-medium">Kapat</button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.map(conv => (
                        <div key={conv.id} onClick={() => setSelectedChat(conv)} className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${selectedChat?.id === conv.id ? 'bg-red-50' : ''}`}>
                            <Avatar><AvatarImage src={getOther(conv).avatar_url} /><AvatarFallback>{getOther(conv).username?.[0]}</AvatarFallback></Avatar>
                            <div className="truncate flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm text-gray-900">{getOther(conv).full_name || 'Kullanıcı'}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(conv.updated_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                {/* ÜRÜN ADI LİSTEDE DE GÖRÜNÜR */}
                                {conv.item && <div className="text-xs text-[#ff3f55] font-medium truncate">{conv.item.title}</div>}
                                <div className="text-xs text-gray-500 truncate">Sohbeti aç</div>
                            </div>
                            {/* ÜRÜN RESMİ */}
                            {conv.item?.image_urls?.[0] && (
                                <div className="w-10 h-10 rounded overflow-hidden border shrink-0 relative">
                                    <Image src={conv.item.image_urls[0]} alt="" fill className="object-cover" sizes="40px" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="hidden md:block p-4 border-t">
                    <Button variant="outline" className="w-full" onClick={() => router.push('/')}>Siteye Dön</Button>
                </div>
            </div>

            {/* --- SAĞ EKRAN --- */}
            <div className={`flex-1 flex flex-col h-full relative bg-white w-full ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* 1. HEADER (KULLANICI) */}
                        <div className="h-16 border-b flex items-center justify-between px-4 bg-white shrink-0 z-20 shadow-sm">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 -ml-2"><ChevronLeft className="w-6 h-6 text-gray-800" /></button>
                                <Link href={`/profile/${getOther(selectedChat).username}`} className="flex items-center gap-2 hover:opacity-80">
                                    <Avatar className="w-9 h-9 border"><AvatarImage src={getOther(selectedChat).avatar_url} /><AvatarFallback>U</AvatarFallback></Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm md:text-base truncate leading-none">{getOther(selectedChat).full_name}</span>
                                        <span className="text-xs text-gray-500">@{getOther(selectedChat).username}</span>
                                    </div>
                                </Link>
                            </div>
                            <Info className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* 2. İLAN BAĞLAMI (Varsa, Sabit) */}
                        {selectedChat.item && (
                            <div className="bg-gray-50 p-3 flex items-center gap-3 border-b shrink-0 z-10 relative">
                                <div className="w-12 h-12 relative rounded border bg-white shrink-0 overflow-hidden">
                                    <Image src={selectedChat.item.image_urls?.[0] || '/placeholder.png'} alt="" fill className="object-cover" sizes="48px" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/item/${selectedChat.item.id}`} className="font-bold text-sm truncate hover:underline block">{selectedChat.item.title}</Link>
                                    <div className="text-[#ff3f55] font-bold text-xs">{selectedChat.item.price?.toLocaleString('tr-TR')} TL</div>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => setNewMessage(`Teklifim: ${selectedChat.item!.price} TL`)} className="h-7 text-xs border-red-200 text-red-500 hover:bg-red-50">
                                    Teklif Ver
                                </Button>
                            </div>
                        )}

                        {/* 3. MESAJ LİSTESİ */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white min-h-0 scroll-smooth">
                            {messages.map(msg => {
                                const isMe = msg.sender_id === userId;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] break-words shadow-sm ${isMe ? 'bg-[#ff3f55] text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none border'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={scrollRef} className="h-1" />
                        </div>

                        {/* 4. INPUT ALANI */}
                        <div className="p-3 bg-white border-t shrink-0 pb-safe w-full">
                            {/* Quick Replies - Horizontal Scroll */}
                            <div className="flex gap-2 overflow-x-auto pb-2 mb-1 scrollbar-hide">
                                {messages.length === 0 && QUICK_REPLIES.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setNewMessage(reply)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors border border-gray-200"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={sendMessage} className="flex items-center gap-2 w-full">
                                <div className="flex-1 relative">
                                    <input
                                        className="w-full bg-gray-100 rounded-full py-3 pl-5 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-200 transition-all"
                                        placeholder="Mesaj yaz..."
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        autoComplete="off"
                                    />
                                </div>
                                <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-[#ff3f55] text-white rounded-full disabled:opacity-50 hover:bg-red-600 transition shrink-0 shadow-sm flex items-center justify-center">
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm flex-col gap-3">
                        <p>Sohbet seçiniz</p>
                    </div>
                )}
            </div>
        </div>
    );
}