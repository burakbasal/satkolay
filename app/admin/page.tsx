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

    // Fetch Real Data
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: itemCount } = await supabase.from('items').select('*', { count: 'exact', head: true });
    const { count: activeItemCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('is_sold', false);

    // Revenue simulation (Assuming 0 for now as we don't have orders table fully populated or linked in prompt)
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

            {/* Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Son Katılanlar</h3>
                    <div className="text-slate-500 text-sm italic">Veri akışı bekleniyor...</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Son İlanlar</h3>
                    <div className="text-slate-500 text-sm italic">Veri akışı bekleniyor...</div>
                </div>
            </div>
        </div>
    );
}