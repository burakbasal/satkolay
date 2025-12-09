'use client'

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface MessageButtonProps {
    sellerId: string
    sellerName: string
}

export function MessageButton({ sellerId, sellerName }: MessageButtonProps) {
    const handleSendMessage = () => {
        console.log(`Mesaj gönderilecek satıcı ID: ${sellerId}`)
        toast.info(`${sellerName} adlı satıcıya mesaj gönderme özelliği yakında!`)
    }

    return (
        <Button
            className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg h-12 shadow-md shadow-orange-100"
            onClick={handleSendMessage}
        >
            <MessageCircle className="mr-2 h-5 w-5" />
            Satıcıya Sor
        </Button>
    )
}
