'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PwaInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsVisible(false);
            setDeferredPrompt(null);
        }
    };

    if (!isVisible) return null;

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleInstallClick}
            className="hidden md:flex items-center gap-2 border-red-200 hover:bg-red-50 text-[#001e93]"
        >
            <Download className="w-4 h-4" />
            <span>Uygulamayı Yükle</span>
        </Button>
    );
}
