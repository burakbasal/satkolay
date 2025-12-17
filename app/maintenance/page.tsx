import Link from 'next/link';
import { Construction, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const runtime = 'edge';

export default function MaintenancePage() {
    return (
        <div className="fixed inset-0 z-50 w-full h-full bg-[#0f111a] flex flex-col items-center justify-center p-4 font-sans text-center overflow-auto">

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in duration-700">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="flex justify-center mb-6 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-rose-500 rounded-2xl flex items-center justify-center rotate-3 hover:rotate-6 transition-transform shadow-lg">
                        <Construction className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Bakımdayız</h1>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Sizlere daha iyi hizmet verebilmek için kısa bir süre bakımdayız. Çok yakında yenilenmiş arayüzümüzle geri döneceğiz.
                </p>

                <div className="flex flex-col gap-3 relative z-10">
                    <Button
                        disabled
                        className="w-full h-12 bg-white/10 hover:bg-white/15 text-white border-none backdrop-blur-md transition-all cursor-not-allowed"
                    >
                        Hizmetlerimiz şu an kapalı
                    </Button>

                    <div className="pt-6 mt-4 border-t border-white/5">
                        <Link href="/login" className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors group">
                            <ShieldCheck className="w-3 h-3 group-hover:scale-110 transition-transform" />
                            <span>Yönetici Girişi</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-xs text-slate-600">
                &copy; {new Date().getFullYear()} SatKolay.com &bull; Tüm Hakları Saklıdır
            </div>
        </div>
    );
}
