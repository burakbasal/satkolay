import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single();
    const { data: items } = await supabase.from('items').select('*').eq('user_id', params.id);

    if (!profile) return notFound();

    return (
        <div className="p-8 space-y-8 text-slate-200">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                        {profile.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{profile.full_name || 'İsimsiz'}</h1>
                        <p className="text-slate-400 font-mono text-sm">{profile.id}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded uppercase">{profile.role}</span>
                            <span className={`text-xs px-2 py-1 rounded uppercase ${profile.banned ? 'bg-red-600' : 'bg-green-600'}`}>
                                {profile.banned ? 'Yasaklı' : 'Aktif'}
                            </span>
                        </div>
                    </div>
                </div>
                <Link href="/admin/users" className="bg-slate-800 px-4 py-2 rounded text-sm hover:bg-slate-700">Geri Dön</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 text-xs uppercase">Toplam İlan</h3>
                    <p className="text-2xl font-bold text-white">{items?.length || 0}</p>
                </div>
            </div>
        </div>
    );
}
