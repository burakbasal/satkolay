/* eslint-disable react/no-unescaped-entities */
import { cn } from "@/lib/utils";

interface DataTableProps {
    headers: string[];
    children: React.ReactNode;
}

export function DataTable({ headers, children }: DataTableProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50">
                            {headers.map((h, i) => (
                                <th key={i} className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function DataTableRow({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <tr className={cn("hover:bg-slate-800/50 transition-colors", className)}>
            {children}
        </tr>
    );
}

export function DataTableCell({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <td className={cn("px-6 py-4 text-slate-400", className)}>
            {children}
        </td>
    );
}
