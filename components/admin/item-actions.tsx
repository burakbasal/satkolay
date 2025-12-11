'use client';

import { Button } from "@/components/ui/button";
import { Trash, Star, Eye, Maximize, Edit, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { deleteItem, toggleItemFeatured, toggleItemBig, updateItemStatus, editItemContent } from '@/app/admin/actions';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ItemActionsProps {
    item: any;
}

export function ItemActions({ item }: ItemActionsProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        title: item.title,
        description: item.description,
        price: item.price
    });
    const [loading, setLoading] = useState(false);

    const handleToggleFeatured = async () => {
        try {
            await toggleItemFeatured(item.id, item.is_featured);
            toast.success(item.is_featured ? 'İlan vitrinden kaldırıldı.' : 'İlan vitrine eklendi.');
        } catch (error) {
            toast.error('İşlem başarısız.');
        }
    };

    const handleToggleBig = async () => {
        try {
            await toggleItemBig(item.id, item.is_large || false); // Handle optional boolean
            toast.success(item.is_large ? 'Büyük ilan modu kapatıldı.' : 'Büyük ilan modu açıldı.');
        } catch (error) {
            toast.error('İşlem başarısız. "is_large" kolonu olmayabilir.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
        try {
            await deleteItem(item.id);
            toast.success('İlan silindi.');
        } catch (error) {
            toast.error('İlan silinemedi.');
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateItemStatus(item.id, newStatus);
            toast.success(`Durum güncellendi: ${newStatus}`);
        } catch (error) {
            toast.error('Durum değişikliği başarısız.');
        }
    };

    const handleEditSubmit = async () => {
        setLoading(true);
        try {
            await editItemContent(item.id, editForm);
            setOpenEdit(false);
            toast.success('İlan içeriği güncellendi.');
        } catch (error) {
            toast.error('Güncelleme başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {/* View */}
            <a
                href={`/item/${item.id}`}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Görüntüle"
            >
                <Eye className="w-4 h-4" />
            </a>

            {/* Status Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Edit className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                        <Edit className="w-4 h-4 mr-2" /> Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Aktif Yap
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                        <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Onaya Çek
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
                        <XCircle className="w-4 h-4 mr-2 text-red-500" /> Reddet
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Featured */}
            <Button
                onClick={handleToggleFeatured}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-slate-800 ${item.is_featured ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                title={item.is_featured ? "Vitrinden Kaldır" : "Vitrine Ekle"}
            >
                {item.is_featured ? <Star className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4" />}
            </Button>

            {/* Big Listing */}
            <Button
                onClick={handleToggleBig}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-slate-800 ${item.is_large ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'}`}
                title={item.is_large ? "Küçült" : "Büyüt (Vitrin)"}
            >
                <Maximize className="w-4 h-4" />
            </Button>

            {/* Delete */}
            <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-900/20 text-slate-400 hover:text-red-500"
                title="İlanı Sil"
            >
                <Trash className="w-4 h-4" />
            </Button>

            {/* Edit Modal */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>İlanı Düzenle</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            İlan içeriğini buradan hızlıca güncelleyebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Başlık</Label>
                            <Input
                                id="title"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="col-span-3 bg-slate-950 border-slate-800"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Fiyat</Label>
                            <Input
                                id="price"
                                type="number"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                className="col-span-3 bg-slate-950 border-slate-800"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desc" className="text-right">Açıklama</Label>
                            <Textarea
                                id="desc"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="col-span-3 bg-slate-950 border-slate-800 min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenEdit(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">İptal</Button>
                        <Button onClick={handleEditSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? 'Güncelleniyor...' : 'Kaydet'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
