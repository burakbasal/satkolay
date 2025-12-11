import { ShieldAlert } from 'lucide-react';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 transform transition-all hover:scale-105 duration-300">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                        <ShieldAlert className="w-12 h-12 text-blue-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                    Bakımdayız
                </h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    SatKolay platformunu sizin için daha hızlı ve güvenli hale getiriyoruz.
                    <br className="hidden md:block" />
                    Kısa bir süre sonra tekrar yayında olacağız.
                </p>

                <div className="flex flex-col gap-3">
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-xs font-mono font-medium">
                        Status: System Upgrade
                    </span>
                    <span className="text-[10px] text-gray-300 mt-4">
                        ID: {new Date().getTime().toString().slice(-6)}
                    </span>
                </div>
            </div>
        </div>
    );
}
