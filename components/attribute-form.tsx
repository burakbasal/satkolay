"use client";

import { useEffect, useState } from "react";
import { Attribute, getCategoryAttributes } from "@/lib/services/categoryService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AttributeFormProps {
    categoryId: string;
    onChange: (attributes: Record<string, any>) => void;
}

export function AttributeForm({ categoryId, onChange }: AttributeFormProps) {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState<Record<string, any>>({});

    useEffect(() => {
        setLoading(true);
        getCategoryAttributes(categoryId)
            .then(data => {
                setAttributes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [categoryId]);

    const handleChange = (id: string, value: any) => {
        const newValues = { ...values, [id]: value };
        setValues(newValues);
        onChange(newValues);
    };

    if (loading) {
        return <div className="py-4 text-center text-gray-500 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Özellikler yükleniyor...</div>;
    }

    if (attributes.length === 0) {
        return null; // No attributes for this category
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6 mt-6">
            <h3 className="col-span-1 md:col-span-2 font-bold text-gray-900 text-lg">Ürün Özellikleri</h3>

            {attributes.map((attr) => (
                <div key={attr.id} className="space-y-1">
                    <Label className="flex items-center gap-1">
                        {attr.name}
                        {attr.is_required && <span className="text-red-500">*</span>}
                    </Label>

                    {/* SELECT TYPE */}
                    {attr.type === 'select' && attr.options && (
                        <Select onValueChange={(val) => handleChange(attr.id, val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                {attr.options.map((opt) => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* NUMBER TYPE */}
                    {attr.type === 'number' && (
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder={attr.name}
                                onChange={(e) => handleChange(attr.id, parseFloat(e.target.value))}
                            />
                            {attr.unit && (
                                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">{attr.unit}</span>
                            )}
                        </div>
                    )}

                    {/* TEXT TYPE */}
                    {attr.type === 'text' && (
                        <Input
                            type="text"
                            placeholder={attr.name}
                            onChange={(e) => handleChange(attr.id, e.target.value)}
                        />
                    )}

                </div>
            ))}
        </div>
    );
}
