import { createClient } from '@/utils/supabase/server';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Shield, User } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminUsersPage() {
    const supabase = await createClient();

    // Tüm Kullanıcıları Çek
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    // Silme İşlemi (Server Action)
    async function deleteUser(formData: FormData) {
        'use server';
        const userId = formData.get('userId') as string;
        const supabase = await createClient();

        // Auth'dan silmek için Service Role gerekir ama şimdilik sadece profilden silelim
        // Gerçek senaryoda Supabase Admin API kullanılır.
        await supabase.from('profiles').delete().eq('id', userId);
        revalidatePath('/admin/users');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
                <div className="text-sm text-muted-foreground">
                    Toplam <strong>{users?.length || 0}</strong> kayıtlı kullanıcı
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Kullanıcı</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Kayıt Tarihi</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users?.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-gray-200">
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback>{user.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.full_name}</div>
                                            <div className="text-gray-500 text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_admin ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            <Shield className="w-3 h-3" /> Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            <User className="w-3 h-3" /> Üye
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <form action={deleteUser}>
                                        <input type="hidden" name="userId" value={user.id} />
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
