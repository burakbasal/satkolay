'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function ShareButton({ title }: { title: string }) {
    return (
        <button
            onClick={() => {
                const url = window.location.href;
                if (navigator.share) {
                    navigator.share({ title: 'SatKolay İlanı', text: title, url });
                } else {
                    navigator.clipboard.writeText(url);
                    // Toast veya Alert kullanabiliriz. Şimdilik alert.
                    alert('Link kopyalandı!');
                }
            }}
            className="bg-white/90 p-2 rounded-full hover:bg-white transition text-gray-700 shadow-sm border border-gray-100"
        >
            <Share2 className="w-5 h-5" />
        </button>
    );
}
