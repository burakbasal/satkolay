import React from 'react';

interface StaticPageLayoutProps {
    title: string;
    children: React.ReactNode;
    updatedAt?: string;
}

export function StaticPageLayout({ title, children, updatedAt }: StaticPageLayoutProps) {
    return (
        <div className="bg-white min-h-screen py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-10 text-center md:text-left border-b pb-6">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                        {title}
                    </h1>
                    {updatedAt && (
                        <p className="text-sm text-gray-500 font-medium">Son Güncelleme: {updatedAt}</p>
                    )}
                </div>
                <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}
