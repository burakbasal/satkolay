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
import { Ban, Trash, Edit, Check, Shield, MoreHorizontal, UserCog } from 'lucide-react';
import { updateUserRole, toggleUserBan, deleteUser } from '@/app/admin/actions';
import { toast } from 'sonner';

interface UserActionsProps {
    userId: string;
    currentRole: string;
    isBanned: boolean;
    currentUserRole: string; // To know if we can perform actions
}

export function UserActions({ userId, currentRole, isBanned, currentUserRole }: UserActionsProps) {
    const isOwner = currentUserRole === 'admin'; // 'admin' in DB is Owner

    const handleRoleChange = async (newRole: 'admin' | 'moderator' | 'user') => {
        try {
            await updateUserRole(userId, newRole);
            toast.success(`Kullanıcı rolü ${newRole} olarak güncellendi.`);
        } catch (error) {
            toast.error('Rol güncellenemedi.');
        }
    };

    const handleBan = async () => {
        try {
            await toggleUserBan(userId, isBanned);
            toast.success(isBanned ? 'Kullanıcı yasağı kaldırıldı.' : 'Kullanıcı yasaklandı.');
        } catch (error) {
            toast.error('İşlem başarısız.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
        try {
            await deleteUser(userId);
            toast.success('Kullanıcı silindi.');
        } catch (error) {
            toast.error('Kullanıcı silinemedi.');
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* ROL DEĞİŞTİR (Sadece Owner) */}
            {isOwner && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300">
                            <span className="sr-only">Menü</span>
                            <UserCog className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                        <DropdownMenuLabel>Rol Ata</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem onClick={() => handleRoleChange('admin')} className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                            <Shield className="mr-2 h-4 w-4 text-purple-500 group-hover:text-purple-400" /> Admin (Owner)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange('moderator')} className="focus:bg-slate-800 focus:text-white cursor-pointer group">
                            <Shield className="mr-2 h-4 w-4 text-blue-500 group-hover:text-blue-400" /> Moderator
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange('user')} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                            User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* YASAKLA (Owner + Mod) */}
            <Button
                onClick={handleBan}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-slate-800 ${isBanned ? 'text-red-500' : 'text-slate-400'}`}
                title={isBanned ? "Yasağı Kaldır" : "Yasakla"}
            >
                {isBanned ? <Check className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            </Button>

            {/* SİL (Sadece Owner) */}
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
        </div>
    );
}
