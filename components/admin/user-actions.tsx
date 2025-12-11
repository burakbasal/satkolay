'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ban, Trash, Edit, Check, Shield, UserCog, Copy, ExternalLink, User } from 'lucide-react';
import { updateUserRole, toggleUserBan, deleteUser, updateUserProfile } from '@/app/admin/actions';
import { toast } from 'sonner';

interface UserActionsProps {
    user: any; // Passing full object for edit fields
    currentUserRole: string;
}

export function UserActions({ user, currentUserRole }: UserActionsProps) {
    const isOwner = currentUserRole === 'admin';
    const [openEdit, setOpenEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        username: user.username || '',
        full_name: user.full_name || ''
    });
    const [loading, setLoading] = useState(false);

    const handleRoleChange = async (newRole: 'admin' | 'moderator' | 'user') => {
        try {
            await updateUserRole(user.id, newRole);
            toast.success(`Kullanıcı rolü ${newRole} olarak güncellendi.`);
        } catch (error) {
            toast.error('Rol güncellenemedi.');
        }
    };

    const handleBan = async () => {
        try {
            await toggleUserBan(user.id, user.is_banned);
            toast.success(user.is_banned ? 'Kullanıcı yasağı kaldırıldı.' : 'Kullanıcı yasaklandı.');
        } catch (error) {
            toast.error('İşlem başarısız.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
        try {
            await deleteUser(user.id);
            toast.success('Kullanıcı silindi.');
        } catch (error) {
            toast.error('Kullanıcı silinemedi.');
        }
    };

    const handleEditSubmit = async () => {
        setLoading(true);
        try {
            await updateUserProfile(user.id, editForm);
            setOpenEdit(false);
            toast.success('Profil güncellendi.');
        } catch (error) {
            toast.error('Güncelleme başarısız.');
        } finally {
            setLoading(false);
        }
    };

    const copyId = () => {
        navigator.clipboard.writeText(user.id);
        toast.success("ID Kopyalandı");
    };

    return (
        <div className="flex items-center gap-1">
            {/* Copy ID & View Profile */}
            <Button variant="ghost" size="sm" onClick={copyId} className="h-8 w-8 p-0 text-slate-400 hover:text-white" title="ID Kopyala">
                <Copy className="h-4 w-4" />
            </Button>

            <a
                href={`/admin/users/${user.id}`}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Detaylı Görünüm"
            >
                <User className="w-4 h-4" />
            </a>

            {/* EDIT PROFILE */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenEdit(true)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                title="Profili Düzenle"
            >
                <Edit className="h-4 w-4" />
            </Button>

            {/* ROLE MENU (Owner Only) */}
            {isOwner && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                            <UserCog className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                        <DropdownMenuLabel>Rol Ata</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem onClick={() => handleRoleChange('admin')} className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                            <Shield className="mr-2 h-4 w-4 text-purple-500" /> Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange('moderator')} className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                            <Shield className="mr-2 h-4 w-4 text-blue-500" /> Moderator
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange('user')} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                            User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* BAN */}
            <Button
                onClick={handleBan}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-slate-800 ${user.is_banned ? 'text-red-500' : 'text-slate-400'}`}
                title={user.is_banned ? "Yasağı Kaldır" : "Yasakla"}
            >
                {user.is_banned ? <Check className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            </Button>

            {/* DELETE (Owner Only) */}
            {isOwner && (
                <Button
                    onClick={handleDelete}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-900/20 text-slate-400 hover:text-red-500"
                    title="Kullanıcıyı Sil"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            )}

            {/* Edit Modal */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Kullanıcı Düzenle</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Kullanıcının profil bilgilerini buradan değiştirebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullname" className="text-right">İsim</Label>
                            <Input
                                id="fullname"
                                value={editForm.full_name}
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                className="col-span-3 bg-slate-950 border-slate-800"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">Kullanıcı Adı</Label>
                            <Input
                                id="username"
                                value={editForm.username}
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                className="col-span-3 bg-slate-950 border-slate-800"
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
