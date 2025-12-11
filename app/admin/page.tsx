import { createClient } from '@/utils/supabase/server';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export const metadata = {
    title: 'Admin Dashboard',
};

async function StatsCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );
}

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch Real Data Counts
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: itemCount } = await supabase.from('items').select('*', { count: 'exact', head: true });
    const { count: activeItemCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('is_sold', false);

    // Fetch Recent Activity
    const { data: recentUsers } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5);
    const { data: recentItems } = await supabase.from('items').select('*').order('created_at', { ascending: false }).limit(5);

    // Revenue simulation
    const revenue = "0 ₺";

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Dashboard</h2>
                <p className="text-slate-400">Platform istatistikleri ve genel durum.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Toplam Kullanıcı" value={userCount || 0} icon={Users} color="bg-blue-500 text-blue-500" />
                <StatsCard title="Toplam İlan" value={itemCount || 0} icon={Package} color="bg-purple-500 text-purple-500" />
                <StatsCard title="Aktif İlanlar" value={activeItemCount || 0} icon={ShoppingCart} color="bg-green-500 text-green-500" />
                <StatsCard title="Toplam Gelir" value={revenue} icon={TrendingUp} color="bg-yellow-500 text-yellow-500" />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Son Kullanıcılar */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Son Katılanlar</h3>
                    <div className="space-y-4">
                        {recentUsers?.map((u: any) => (
                            <div key={u.id} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs">
                                        {u.full_name?.[0] || '?'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-200">{u.full_name || 'İsimsiz'}</div>
                                        <div className="text-xs text-slate-500 max-w-[150px] truncate">{u.email}</div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                        {(!recentUsers || recentUsers.length === 0) && (
                            <div className="text-slate-500 text-sm">Hiç kullanıcı yok.</div>
                        )}
                    </div>
                </div>

                {/* Son İlanlar */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Son İlanlar</h3>
                    <div className="space-y-4">
                        {recentItems?.map((i: any) => (
                            <div key={i.id} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    {i.image_urls?.[0] ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={i.image_urls[0]} alt="" className="w-10 h-10 rounded bg-slate-800 object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-500">Img</div>
                                    )}
                                    <div>
                                        <div className="text-sm font-bold text-slate-200 max-w-[150px] truncate">{i.title}</div>
                                        <div className="text-xs text-green-400 font-mono">{i.price} ₺</div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">{new Date(i.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                        {(!recentItems || recentItems.length === 0) && (
                            <div className="text-slate-500 text-sm">Hiç ilan yok.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}