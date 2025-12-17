import { Car, Smartphone, Home, Shirt, Dumbbell, Briefcase, Book, Dog, Gamepad2, Tv, Camera, Armchair, Hammer, Baby, Music } from 'lucide-react';

export type CategoryItem = {
    id: string;
    label: string;
    href: string; // Added href
    icon?: any;
    subs?: CategoryItem[]; // Alt kategoriler
};

export const CATEGORIES: CategoryItem[] = [
    {
        id: 'vasita',
        label: 'Vasıta',
        href: '/search?category=Vasıta',
        icon: Car,
        subs: [
            {
                id: 'araba',
                label: 'Araba',
                href: '/search?query=Araba',
                subs: [
                    { id: 'renault', label: 'Renault', href: '/search?query=Renault' },
                    { id: 'vw', label: 'Volkswagen', href: '/search?query=Volkswagen' },
                    { id: 'fiat', label: 'Fiat', href: '/search?query=Fiat' },
                    { id: 'ford', label: 'Ford', href: '/search?query=Ford' },
                    { id: 'opel', label: 'Opel', href: '/search?query=Opel' },
                    { id: 'peugeot', label: 'Peugeot', href: '/search?query=Peugeot' }
                ]
            },
            {
                id: 'motosiklet',
                label: 'Motosiklet',
                href: '/search?query=Motosiklet',
                subs: [
                    { id: 'honda', label: 'Honda', href: '/search?query=Honda' },
                    { id: 'yamaha', label: 'Yamaha', href: '/search?query=Yamaha' },
                    { id: 'kuba', label: 'Kuba', href: '/search?query=Kuba' },
                    { id: 'rks', label: 'RKS', href: '/search?query=RKS' }
                ]
            },
            {
                id: 'ticari',
                label: 'Ticari Araçlar',
                href: '/search?query=Ticari Araçlar',
                subs: [
                    { id: 'kamyon', label: 'Kamyon', href: '/search?query=Kamyon' },
                    { id: 'otobus', label: 'Otobüs', href: '/search?query=Otobüs' }
                ]
            },
            {
                id: 'karavan',
                label: 'Karavan',
                href: '/search?query=Karavan',
                subs: [
                    { id: 'cekme', label: 'Çekme Karavan', href: '/search?query=Çekme Karavan' },
                    { id: 'moto', label: 'Moto Karavan', href: '/search?query=Moto Karavan' }
                ]
            },
            {
                id: 'deniz',
                label: 'Deniz Araçları',
                href: '/search?query=Deniz Araçları',
                subs: [
                    { id: 'tekne', label: 'Tekne', href: '/search?query=Tekne' },
                    { id: 'jet', label: 'Jet Ski', href: '/search?query=Jet Ski' }
                ]
            }
        ]
    },
    {
        id: 'yedek-parca',
        label: 'Yedek Parça & Aksesuar',
        href: '/search?category=Yedek Parça & Aksesuar',
        icon: Hammer,
        subs: [
            {
                id: 'oto-yedek',
                label: 'Oto Yedek Parça',
                href: '/search?query=Oto Yedek Parça',
                subs: [
                    { id: 'motor', label: 'Motor & Mekanik', href: '/search?query=Motor & Mekanik' },
                    { id: 'kaporta', label: 'Kaporta', href: '/search?query=Kaporta' }
                ]
            },
            {
                id: 'oto-aksesuar',
                label: 'Aksesuar & Tuning',
                href: '/search?query=Aksesuar & Tuning',
                subs: [
                    { id: 'ses', label: 'Ses Sistemi', href: '/search?query=Ses Sistemi' },
                    { id: 'jant', label: 'Jant & Lastik', href: '/search?query=Jant & Lastik' }
                ]
            }
        ]
    },
    {
        id: 'telefon',
        label: 'Telefon',
        href: '/search?category=Telefon',
        icon: Smartphone,
        subs: [
            {
                id: 'ios',
                label: 'iPhone iOS',
                href: '/search?query=iPhone iOS',
                subs: [
                    { id: '17pm', label: 'iPhone 17 Pro Max', href: '/search?query=iPhone 17 Pro Max' },
                    { id: '16pm', label: 'iPhone 16 Pro Max', href: '/search?query=iPhone 16 Pro Max' },
                    { id: '11', label: 'iPhone 11', href: '/search?query=iPhone 11' }
                ]
            },
            {
                id: 'android',
                label: 'Android',
                href: '/search?query=Android',
                subs: [
                    { id: 'samsung', label: 'Samsung', href: '/search?query=Samsung' },
                    { id: 'xiaomi', label: 'Xiaomi', href: '/search?query=Xiaomi' },
                    { id: 'huawei', label: 'Huawei', href: '/search?query=Huawei' }
                ]
            },
            {
                id: 'giyilebilir',
                label: 'Giyilebilir Teknoloji',
                href: '/search?query=Giyilebilir Teknoloji',
                subs: [
                    { id: 'saat', label: 'Akıllı Saat', href: '/search?query=Akıllı Saat' },
                    { id: 'bileklik', label: 'Akıllı Bileklik', href: '/search?query=Akıllı Bileklik' }
                ]
            }
        ]
    },
    {
        id: 'elektronik',
        label: 'Elektronik',
        href: '/search?category=Elektronik',
        icon: Tv,
        subs: [
            {
                id: 'bilgisayar',
                label: 'Bilgisayar',
                href: '/search?query=Bilgisayar',
                subs: [
                    { id: 'laptop', label: 'Dizüstü', href: '/search?query=Dizüstü' },
                    { id: 'masaustu', label: 'Masaüstü', href: '/search?query=Masaüstü' },
                    { id: 'tablet', label: 'Tablet', href: '/search?query=Tablet' }
                ]
            },
            {
                id: 'tv',
                label: 'TV & Ses',
                href: '/search?query=TV & Ses',
                subs: [
                    { id: 'televizyon', label: 'Televizyon', href: '/search?query=Televizyon' },
                    { id: 'hoparlor', label: 'Hoparlör', href: '/search?query=Hoparlör' }
                ]
            },
            {
                id: 'foto',
                label: 'Fotoğraf & Kamera',
                href: '/search?query=Fotoğraf & Kamera',
                subs: [
                    { id: 'dijital', label: 'Dijital Makine', href: '/search?query=Dijital Makine' },
                    { id: 'aksiyon', label: 'Aksiyon Kamerası', href: '/search?query=Aksiyon Kamerası' }
                ]
            },
            {
                id: 'oyun',
                label: 'Oyun & Konsol',
                href: '/search?query=Oyun & Konsol',
                subs: [
                    { id: 'ps', label: 'PlayStation', href: '/search?query=PlayStation' },
                    { id: 'xbox', label: 'Xbox', href: '/search?query=Xbox' },
                    { id: 'nintendo', label: 'Nintendo', href: '/search?query=Nintendo' }
                ]
            }
        ]
    },
    {
        id: 'ev-yasam',
        label: 'Ev & Yaşam',
        href: '/search?category=Ev & Yaşam',
        icon: Home,
        subs: [
            {
                id: 'mobilya',
                label: 'Mobilya',
                href: '/search?query=Mobilya',
                subs: [
                    { id: 'oturma', label: 'Oturma Odası', href: '/search?query=Oturma Odası' },
                    { id: 'yatak', label: 'Yatak Odası', href: '/search?query=Yatak Odası' },
                    { id: 'mutfak', label: 'Mutfak Mobilyası', href: '/search?query=Mutfak Mobilyası' }
                ]
            },
            {
                id: 'beyaz-esya',
                label: 'Beyaz Eşya',
                href: '/search?query=Beyaz Eşya',
                subs: [
                    { id: 'buzdolabi', label: 'Buzdolabı', href: '/search?query=Buzdolabı' },
                    { id: 'camasir', label: 'Çamaşır Makinesi', href: '/search?query=Çamaşır Makinesi' }
                ]
            },
            {
                id: 'kucuk-ev',
                label: 'Elektrikli Ev Aletleri',
                href: '/search?query=Elektrikli Ev Aletleri',
                subs: [
                    { id: 'supurge', label: 'Süpürge', href: '/search?query=Süpürge' },
                    { id: 'utu', label: 'Ütü', href: '/search?query=Ütü' }
                ]
            },
            {
                id: 'ev-tekstil',
                label: 'Ev Tekstili',
                href: '/search?query=Ev Tekstili',
                subs: [
                    { id: 'hali', label: 'Halı & Kilim', href: '/search?query=Halı & Kilim' },
                    { id: 'perde', label: 'Perde', href: '/search?query=Perde' }
                ]
            }
        ]
    },
    {
        id: 'giyim',
        label: 'Giyim & Moda',
        href: '/search?category=Giyim & Moda',
        icon: Shirt,
        subs: [
            {
                id: 'kadin',
                label: 'Kadın Giyim',
                href: '/search?query=Kadın Giyim',
                subs: [
                    { id: 'elbise', label: 'Elbise', href: '/search?query=Elbise' },
                    { id: 'mont', label: 'Mont', href: '/search?query=Mont' },
                    { id: 'ayakkabi', label: 'Ayakkabı', href: '/search?query=Ayakkabı' }
                ]
            },
            {
                id: 'erkek',
                label: 'Erkek Giyim',
                href: '/search?query=Erkek Giyim',
                subs: [
                    { id: 'takim', label: 'Takım Elbise', href: '/search?query=Takım Elbise' },
                    { id: 'tisort', label: 'Tişört', href: '/search?query=Tişört' },
                    { id: 'ayakkabi', label: 'Ayakkabı', href: '/search?query=Ayakkabı' }
                ]
            },
            {
                id: 'cocuk',
                label: 'Çocuk Giyim',
                href: '/search?query=Çocuk Giyim',
                subs: [
                    { id: 'kiz', label: 'Kız Çocuk', href: '/search?query=Kız Çocuk' },
                    { id: 'erkek', label: 'Erkek Çocuk', href: '/search?query=Erkek Çocuk' }
                ]
            }
        ]
    },
    {
        id: 'anne-bebek',
        label: 'Anne & Bebek',
        href: '/search?category=Anne & Bebek',
        icon: Baby,
        subs: [
            {
                id: 'arac-gerec',
                label: 'Araç Gereç',
                href: '/search?query=Araç Gereç',
                subs: [
                    { id: 'bebek-arabasi', label: 'Bebek Arabası', href: '/search?query=Bebek Arabası' },
                    { id: 'oto-koltugu', label: 'Oto Koltuğu', href: '/search?query=Oto Koltuğu' }
                ]
            },
            {
                id: 'giyim',
                label: 'Bebek Giyim',
                href: '/search?query=Bebek Giyim',
                subs: [
                    { id: 'zibin', label: 'Zıbın', href: '/search?query=Zıbın' },
                    { id: 'tulum', label: 'Tulum', href: '/search?query=Tulum' }
                ]
            }
        ]
    },
    {
        id: 'spor',
        label: 'Spor & Outdoor',
        href: '/search?category=Spor & Outdoor',
        icon: Dumbbell,
        subs: [
            {
                id: 'fitness',
                label: 'Fitness',
                href: '/search?query=Fitness',
                subs: [
                    { id: 'kosu', label: 'Koşu Bandı', href: '/search?query=Koşu Bandı' },
                    { id: 'dambil', label: 'Dambıl', href: '/search?query=Dambıl' }
                ]
            },
            {
                id: 'bisiklet',
                label: 'Bisiklet',
                href: '/search?query=Bisiklet',
                subs: [
                    { id: 'dag', label: 'Dağ Bisikleti', href: '/search?query=Dağ Bisikleti' },
                    { id: 'sehir', label: 'Şehir Bisikleti', href: '/search?query=Şehir Bisikleti' }
                ]
            },
            {
                id: 'kamp',
                label: 'Kamp & Doğa',
                href: '/search?query=Kamp & Doğa',
                subs: [
                    { id: 'cadir', label: 'Çadır', href: '/search?query=Çadır' },
                    { id: 'uyku-tulumu', label: 'Uyku Tulumu', href: '/search?query=Uyku Tulumu' }
                ]
            }
        ]
    },
    {
        id: 'hobi',
        label: 'Hobi & Eğlence',
        href: '/search?category=Hobi & Eğlence',
        icon: Gamepad2,
        subs: [
            {
                id: 'kitap',
                label: 'Kitap & Dergi',
                href: '/search?query=Kitap & Dergi',
                subs: [
                    { id: 'roman', label: 'Roman', href: '/search?query=Roman' },
                    { id: 'egitim', label: 'Eğitim', href: '/search?query=Eğitim' }
                ]
            },
            {
                id: 'muzik',
                label: 'Müzik Aletleri',
                href: '/search?query=Müzik Aletleri',
                subs: [
                    { id: 'gitar', label: 'Gitar', href: '/search?query=Gitar' },
                    { id: 'piyano', label: 'Piyano', href: '/search?query=Piyano' }
                ]
            },
            {
                id: 'oyuncak',
                label: 'Oyuncak',
                href: '/search?query=Oyuncak',
                subs: [
                    { id: 'lego', label: 'Lego', href: '/search?query=Lego' },
                    { id: 'bebek', label: 'Oyuncak Bebek', href: '/search?query=Oyuncak Bebek' }
                ]
            }
        ]
    },
    {
        id: 'evcil-hayvan',
        label: 'Evcil Hayvanlar',
        href: '/search?category=Evcil Hayvanlar',
        icon: Dog,
        subs: [
            {
                id: 'kedi',
                label: 'Kedi',
                href: '/search?query=Kedi',
                subs: [
                    { id: 'mama', label: 'Kedi Maması', href: '/search?query=Kedi Maması' },
                    { id: 'kum', label: 'Kedi Kumu', href: '/search?query=Kedi Kumu' }
                ]
            },
            {
                id: 'kopek',
                label: 'Köpek',
                href: '/search?query=Köpek',
                subs: [
                    { id: 'mama', label: 'Köpek Maması', href: '/search?query=Köpek Maması' },
                    { id: 'tasma', label: 'Tasma', href: '/search?query=Tasma' }
                ]
            }
        ]
    },
    {
        id: 'ofis',
        label: 'Ofis & Kırtasiye',
        href: '/search?category=Ofis & Kırtasiye',
        icon: Briefcase,
        subs: [
            {
                id: 'mobilya',
                label: 'Ofis Mobilyası',
                href: '/search?query=Ofis Mobilyası',
                subs: [
                    { id: 'koltuk', label: 'Ofis Koltuğu', href: '/search?query=Ofis Koltuğu' },
                    { id: 'masa', label: 'Çalışma Masası', href: '/search?query=Çalışma Masası' }
                ]
            },
            {
                id: 'kirtasiye',
                label: 'Kırtasiye',
                href: '/search?query=Kırtasiye',
                subs: []
            }
        ]
    },
    {
        id: 'antika',
        label: 'Antika & Sanat',
        href: '/search?category=Antika & Sanat',
        icon: null, // Özel ikon yoksa boş
        subs: [
            { id: 'mobilya', label: 'Antika Mobilya', href: '/search?query=Antika Mobilya' },
            { id: 'dekorasyon', label: 'Dekorasyon', href: '/search?query=Dekorasyon' },
            { id: 'koleksiyon', label: 'Koleksiyon', href: '/search?query=Koleksiyon' }
        ]
    }
];
