import { checkAdminAccess } from '@/utils/admin-auth';
import { AdminSidebar } from '@/components/admin/sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. Security Check (Server Side)
    const { profile } = await checkAdminAccess();

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pl-64">
            {/* Sidebar is fixed, so we add padding-left to body */}
            <AdminSidebar />

            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-8">
                <div>
                    {/* Breadcrumb or Title placeholder */}
                    <span className="text-sm text-slate-500">Yönetim Paneli /</span> <span className="font-bold text-slate-200">Genel Bakış</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-200">{profile.full_name || 'Admin'}</p>
                        <p className="text-xs text-slate-500 uppercase font-bold">{profile.role}</p>
                    </div>
                    <div className="h-10 w-10 bg-[#001e93] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
                        {profile.full_name?.[0] || 'A'}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
