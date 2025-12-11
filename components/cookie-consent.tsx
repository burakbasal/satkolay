"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        // Check localStorage on mount
        const consent = localStorage.getItem("satkolay_cookie_consent")
        if (!consent) {
            // Use a small timeout to allow slide-up animation effect after mount
            const timer = setTimeout(() => setShow(true), 500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("satkolay_cookie_consent", "true")
        setShow(false)
    }

    const handleDecline = () => {
        localStorage.setItem("satkolay_cookie_consent", "false")
        setShow(false)
    }

    if (!show) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t shadow-lg animate-in slide-in-from-bottom duration-500">
            <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm md:text-base text-gray-700 text-center md:text-left">
                    <p>
                        Sizlere daha iyi hizmet sunabilmek adına sitemizde çerezler kullanılmaktadır. Detaylı bilgi için{" "}
                        <a href="#" className="underline font-medium text-primary hover:text-primary/80">
                            Gizlilik Politikamızı
                        </a>{" "}
                        inceleyebilirsiniz.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="border-gray-300 hover:bg-gray-50 text-gray-700 min-w-[100px]"
                    >
                        Reddet
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-w-[100px]"
                    >
                        Kabul Et
                    </Button>
                </div>
            </div>
        </div>
    )
}
