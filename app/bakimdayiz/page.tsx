import { ShieldAlert } from 'lucide-react';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-10 h-10 text-blue-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Bakımdayız</h1>
                <p className="text-gray-500 mb-6">
                    SatKolay şu anda bakımda. Daha iyi hizmet verebilmek için altyapımızı güçlendiriyoruz. Lütfen daha sonra tekrar deneyin.
                </p>
                <div className="text-xs text-gray-400 font-mono">
                    System Maintenance Check — {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
}
