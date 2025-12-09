'use client';

import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useState } from 'react';

export function ShareButton({ title, text }: { title: string, text: string }) {
    const [copied, setCopied] = useState(false);

    // Eski usül kopyalama (HTTP ve Mobil uyumlu)
    const fallbackCopyTextToClipboard = (text: string) => {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Ekranın dışına koy
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            if (successful) {
                setCopied(true);
                toast.success("Link kopyalandı!");
                setTimeout(() => setCopied(false), 2000);
            } else {
                toast.error("Kopyalama başarısız.");
            }
        } catch (err) {
            toast.error("Tarayıcı desteklemiyor.");
        }

        document.body.removeChild(textArea);
    }

    const handleShare = async () => {
        const url = window.location.href;

        // 1. Önce Native Paylaşım (Mobil Uygulamalar için)
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url,
                });
                return;
            } catch (err) {
                console.log('Paylaşım penceresi kapandı.');
            }
        }

        // 2. Modern Kopyalama (HTTPS için)
        if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                toast.success("Link kopyalandı!");
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                fallbackCopyTextToClipboard(url); // Hata verirse eskiye dön
            }
        } else {
            // 3. Fallback (HTTP/Localhost Mobil için)
            fallbackCopyTextToClipboard(url);
        }
    };

    return (
        <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm" onClick={handleShare}>
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-gray-700" />}
        </Button>
    );
}
