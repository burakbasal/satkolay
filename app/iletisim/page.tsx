import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const metadata: Metadata = {
    title: 'İletişim',
    description: 'SatKolay iletişim bilgileri ve destek formu.',
};

export default function ContactPage() {
    return (
        <StaticPageLayout title="Bize Ulaşın">
            <p className="lead text-lg text-gray-600 mb-10">
                Görüşleriniz, önerileriniz ve şikayetleriniz bizim için çok değerli. Aşağıdaki formu doldurarak veya iletişim kanallarımızdan bize ulaşabilirsiniz.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600"><MapPin className="w-6 h-6" /></div>
                        <div>
                            <h3 className="font-bold text-gray-900">Merkez Ofis</h3>
                            <p className="text-gray-600">Teknokent Binası, Dicle Üniversitesi Kampüsü<br />Sur, Diyarbakır</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Mail className="w-6 h-6" /></div>
                        <div>
                            <h3 className="font-bold text-gray-900">E-Posta</h3>
                            <p className="text-gray-600">destek@satkolay.com</p>
                            <p className="text-xs text-gray-500 mt-1">Ortalama yanıt süresi: 24 saat</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Phone className="w-6 h-6" /></div>
                        <div>
                            <h3 className="font-bold text-gray-900">Çağrı Merkezi</h3>
                            <p className="text-gray-600">0850 123 45 67</p>
                            <p className="text-xs text-gray-500 mt-1">Hafta içi 09:00 - 18:00</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 p-8 rounded-2xl border">
                    <h3 className="font-bold text-xl mb-6">İletişim Formu</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Adınız</label>
                                <Input placeholder="Adınız" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Soyadınız</label>
                                <Input placeholder="Soyadınız" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-Posta Adresi</label>
                            <Input type="email" placeholder="ornek@email.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Konu</label>
                            <Input placeholder="Mesajınız ne hakkında?" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mesajınız</label>
                            <Textarea placeholder="Size nasıl yardımcı olabiliriz?" className="h-32" />
                        </div>
                        <Button className="w-full bg-[#001e93] hover:bg-blue-800 text-white font-bold h-12">
                            Gönder
                        </Button>
                    </form>
                </div>
            </div>
        </StaticPageLayout>
    );
}
