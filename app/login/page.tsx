'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

// YASAKLI MAİL LİSTESİ (Genişletilebilir)
const BLOCKED_DOMAINS = [
    'mail.tm', 'temp-mail.org', '10minutemail.com', 'guerrillamail.com', 'sharklasers.com',
    'yopmail.com', 'getairmail.com', 'throwawaymail.com', 'tempmail.net', 'comfythings.com', 'cexch.com'
];

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    const router = useRouter();
    const supabase = createClient();

    // Google Girişi
    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) toast.error(error.message);
    };

    // Kullanıcı Adı Kontrolü
    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameStatus('idle');
            return;
        }
        const checkUsername = setTimeout(async () => {
            setUsernameStatus('checking');
            const { data } = await supabase.from('profiles').select('username').eq('username', username).single();
            if (data) setUsernameStatus('taken');
            else setUsernameStatus('available');
        }, 500);
        return () => clearTimeout(checkUsername);
    }, [username]);

    // Email Kontrolü
    const validateEmail = (email: string) => {
        const domain = email.split('@')[1];
        if (BLOCKED_DOMAINS.includes(domain)) {
            toast.error("Geçici (Disposable) mail adresleri kabul edilmemektedir.");
            return false;
        }
        return true;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast.error("Giriş başarısız: " + error.message);
            setLoading(false);
        } else {
            router.refresh();
            router.push('/');
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) return;
        if (usernameStatus === 'taken') return toast.error("Kullanıcı adı alınmış.");

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    username: username,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Hesap oluşturuldu! Giriş yapılıyor...');
            router.push('/');
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 font-sans">
            <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-[#ff3f55] tracking-tighter">SatKolay</h2>
                    <p className="mt-2 text-sm text-gray-600">Güvenli Alışverişin Adresi</p>
                </div>

                {/* GOOGLE BUTONU */}
                <Button variant="outline" onClick={handleGoogleLogin} className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50 flex items-center gap-2 relative" disabled={loading}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google ile Devam Et
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Veya E-posta İle</span></div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                        <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label>E-posta</Label>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Şifre</Label>
                                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="h-12" />
                            </div>
                            <Button type="submit" className="w-full bg-[#ff3f55] hover:bg-[#e63548] h-12 text-lg font-bold" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Giriş Yap'}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register">
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ad Soyad</Label>
                                    <Input value={fullName} onChange={e => setFullName(e.target.value)} required className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kullanıcı Adı</Label>
                                    <div className="relative">
                                        <Input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} required className={`h-12 pr-10 ${usernameStatus === 'taken' ? 'border-red-500' : usernameStatus === 'available' ? 'border-green-500' : ''}`} />
                                        <div className="absolute right-3 top-3">
                                            {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                                            {usernameStatus === 'available' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                            {usernameStatus === 'taken' && <XCircle className="w-5 h-5 text-red-500" />}
                                        </div>
                                    </div>
                                    {usernameStatus === 'taken' && <p className="text-xs text-red-500 mt-1">Alınmış.</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>E-posta</Label>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Şifre</Label>
                                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="h-12" />
                            </div>
                            <Button type="submit" className="w-full bg-[#ff3f55] hover:bg-[#e63548] h-12 text-lg font-bold" disabled={loading || usernameStatus === 'taken'}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Kayıt Ol'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
