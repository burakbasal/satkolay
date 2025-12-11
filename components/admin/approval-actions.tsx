'use client';

import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { approveItem, rejectItem } from '@/app/admin/actions';
import { toast } from 'sonner';
import { useState } from "react";

interface ApprovalActionsProps {
    itemId: string;
}

export function ApprovalActions({ itemId }: ApprovalActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            await approveItem(itemId);
            toast.success('İlan onaylandı ve yayına alındı.');
        } catch (error) {
            toast.error('Onay işlemi başarısız.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('Bu ilanı reddetmek istediğinize emin misiniz?')) return;
        setLoading(true);
        try {
            await rejectItem(itemId); // TODO: Add rejection reason modal later
            toast.success('İlan reddedildi.');
        } catch (error) {
            toast.error('Reddetme işlemi başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 mt-4">
            <Button
                onClick={handleApprove}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1"
            >
                <Check className="w-4 h-4" /> Onayla
            </Button>
            <Button
                onClick={handleReject}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white gap-2 flex-1"
            >
                <X className="w-4 h-4" /> Reddet
            </Button>
        </div>
    );
}
