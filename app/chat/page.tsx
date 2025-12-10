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

    // URL Params
    const contextConvId = searchParams.get('id');
    const offerPrice = searchParams.get('offerPrice');

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

                // DEEP LINKING: ID ile gelindiyse seç
                if (contextConvId) {
                    const exist = data.find((c: any) => c.id === contextConvId);
                    if (exist) {
                        setSelectedChat(exist as any);
                        // Teklif varsa mesaj kutusuna yaz
                        if (offerPrice) {
                            setNewMessage(`Teklifim: ${Number(offerPrice).toLocaleString('tr-TR')} TL`);
                        }
                    }
                }
            }
        };
        fetchConvs();

        const ch = supabase.channel('public:conversations').on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchConvs).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [userId, contextConvId, offerPrice]);

    // 3. FETCH MESSAGES
    useEffect(() => {
        if (!selectedChat) return;
        const fetchMsgs = async () => {
            const { data } = await supabase.from('direct_messages').select('*').eq('conversation_id', selectedChat.id).order('created_at', { ascending: true });
            if (data) setMessages(data as any);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'auto' }), 50);
        };
        fetchMsgs();

        const ch = supabase.channel(`chat:${selectedChat.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages', filter: `conversation_id=eq.${selectedChat.id}` }, (payload) => {
            setMessages(currentMessages => {
                const newMsg = payload.new as Message;

                // 1. Önce listedeki "geçici/optimistic" mesajları temizle (id'si sayı olan veya is_optimistic: true olanlar)
                // (Note: Backend'den gelen mesajın ID'si uuid (string) olur, bizim geçici ID timestamp (string) ama ayırt edilebilir)
                // En garantisi is_optimistic flag'i kontrol etmek.

                const cleanList = currentMessages.filter(m => !(m as any).is_optimistic && m.id !== newMsg.id);
                return [...cleanList, newMsg];
            });
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [selectedChat]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || !userId) return;
        const msg = newMessage;

        // 1. OPTIMISTIC UI: Mesajı hemen listeye ekle
        const tempMessage: any = {
            id: Date.now().toString(), // Geçici ID
            content: msg,
            sender_id: userId,
            created_at: new Date().toISOString(),
            is_optimistic: true // EKRANDA 2 TANE GÖZÜKMESİN DİYE İŞARET
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage("");
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

        // 2. BACKEND'E GÖNDER
        const { error } = await supabase.from('direct_messages').insert({
            conversation_id: selectedChat.id,
            sender_id: userId,
            content: msg
        });

        if (error) {
            console.error("Mesaj gönderilemedi", error);
            // Hata olursa mesajı silebilir veya uyarabiliriz (şimdilik log yetiyor)
        }

        await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', selectedChat.id);
    };

    const getOther = (c: Conversation) => (c.user1.id === userId ? c.user2 : c.user1);

    if (!userId) return null;

    return (
        <div className="h-[calc(100vh-140px)] min-h-[500px] w-full max-w-[1280px] mx-auto flex gap-4">
            {/* --- SOL LİSTE (SIDEBAR) --- */}
            <div className={`
                w-full md:w-1/3 h-full
                bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col
                ${selectedChat ? 'hidden md:flex' : 'flex'}
            `}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b bg-white shrink-0">
                    <span className="font-bold text-lg text-gray-900">Mesajlar</span>
                </div>

                {/* Sidebar List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            Henüz hiç mesajınız yok.
                        </div>
                    )}
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedChat(conv)}
                            className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${selectedChat?.id === conv.id ? 'bg-red-50 border-l-4 border-l-[#ff3f55]' : 'border-l-4 border-l-transparent'}`}
                        >
                            <Avatar className="w-12 h-12 border border-gray-100"><AvatarImage src={getOther(conv).avatar_url} /><AvatarFallback>{getOther(conv).username?.[0]}</AvatarFallback></Avatar>
                            <div className="truncate flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-sm text-gray-900">{getOther(conv).full_name || 'Kullanıcı'}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(conv.updated_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                {conv.item && (
                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff3f55]"></span>
                                        <span className="truncate">{conv.item.title}</span>
                                    </div>
                                )}
                                <div className="text-xs text-gray-400 truncate">Sohbeti görüntüle</div>
                            </div>
                            {conv.item?.image_urls?.[0] && (
                                <div className="w-12 h-12 rounded-md overflow-hidden border shrink-0 bg-gray-100">
                                    <Image src={conv.item.image_urls[0]} alt="" width={48} height={48} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SAĞ EKRAN (CHAT PENCERESİ) --- */}
            <div className={`
                w-full md:w-2/3 h-full
                bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col
                ${!selectedChat ? 'hidden md:flex' : 'flex'}
            `}>
                {selectedChat ? (
                    <>
                        {/* 1. HEADER */}
                        <div className="h-16 flex-none bg-white border-b flex items-center justify-between px-4 z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
                                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                                </button>
                                <Link href={`/profile/${getOther(selectedChat).username}`} className="flex items-center gap-3 group">
                                    <div className="relative">
                                        <Avatar className="w-10 h-10 border border-gray-200"><AvatarImage src={getOther(selectedChat).avatar_url} /><AvatarFallback>U</AvatarFallback></Avatar>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="font-bold text-sm text-gray-900 group-hover:underline">
                                            {getOther(selectedChat).full_name || getOther(selectedChat).username || 'Kullanıcı'}
                                        </span>
                                        {selectedChat.item ? (
                                            <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {selectedChat.item.title} • Sohbeti
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500">Çevrimiçi</span>
                                        )}
                                    </div>
                                </Link>
                            </div>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                                <Info className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* 2. İLAN BAĞLAMI */}
                        {selectedChat.item && (
                            <div className="flex-none bg-white px-4 py-3 flex items-center gap-4 border-b shrink-0 shadow-sm whitespace-nowrap overflow-x-auto scrollbar-hide">
                                <div className="w-12 h-12 relative rounded-md border bg-gray-100 shrink-0 overflow-hidden">
                                    <Image src={selectedChat.item.image_urls?.[0] || '/placeholder.png'} alt="" fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/item/${selectedChat.item.id}`} className="font-bold text-sm text-gray-800 hover:text-[#ff3f55] transition-colors block truncate">
                                        {selectedChat.item.title}
                                    </Link>
                                    <div className="text-[#ff3f55] font-black text-sm">{selectedChat.item.price?.toLocaleString('tr-TR')} TL</div>
                                </div>
                                <Button
                                    size="sm"
                                    className="h-9 px-4 bg-[#ff3f55] hover:bg-[#e63548] text-white font-bold shrink-0"
                                    onClick={() => setNewMessage(`Teklifim: ${selectedChat.item!.price} TL`)}
                                >
                                    Teklif Ver
                                </Button>
                            </div>
                        )}

                        {/* 3. MESAJ LİSTESİ */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#eef2f5] custom-scrollbar">
                            <div className="text-center text-xs text-gray-400 py-4">Sohbet Başladı • {new Date(selectedChat.updated_at).toLocaleDateString('tr-TR')}</div>
                            {messages.map(msg => {
                                const isMe = msg.sender_id === userId;
                                return (
                                    <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${isMe
                                            ? 'bg-[#ff3f55] text-white rounded-tr-none'
                                            : 'bg-white text-gray-900 border rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={scrollRef} className="h-2" />
                        </div>

                        {/* 4. INPUT ALANI */}
                        <div className="flex-none p-4 border-t bg-white z-10">
                            {/* Hızlı Yanıtlar */}
                            {!newMessage && (
                                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                                    {QUICK_REPLIES.map((reply, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setNewMessage(reply)}
                                            className="whitespace-nowrap px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={sendMessage} className="flex items-center gap-3">
                                <input
                                    className="flex-1 bg-gray-100 rounded-full py-3.5 px-6 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all border border-transparent focus:border-red-200"
                                    placeholder="Bir mesaj yazın..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="w-12 h-12 flex items-center justify-center bg-[#ff3f55] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e63548] transition-all shadow-md active:scale-95 shrink-0"
                                >
                                    <Send className="w-5 h-5 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center min-h-[400px]">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg mb-2">Henüz bir sohbet seçmediniz</h3>
                        <p className="max-w-xs mx-auto text-sm">Soldaki listeden bir konuşma seçin veya ilanlardan satıcılara mesaj atın.</p>
                    </div>
                )}
            </div>
        </div>
    );
}