import { Car, Smartphone, Home, Shirt, Dumbbell, Briefcase, Book, Dog, Gamepad2, Tv, Camera, Armchair, Hammer, Baby, Music } from 'lucide-react';

export type CategoryItem = {
    id: string;
    label: string;
    icon?: any;
    subs?: CategoryItem[]; // Alt kategoriler
};

export const CATEGORIES: CategoryItem[] = [
    {
        id: 'vasita',
        label: 'Vasıta',
        icon: Car,
        subs: [
            {
                id: 'araba',
                label: 'Araba',
                subs: [
                    { id: 'renault', label: 'Renault' },
                    { id: 'vw', label: 'Volkswagen' },
                    { id: 'fiat', label: 'Fiat' },
                    { id: 'ford', label: 'Ford' },
                    { id: 'opel', label: 'Opel' },
                    { id: 'peugeot', label: 'Peugeot' }
                ]
            },
            {
                id: 'motosiklet',
                label: 'Motosiklet',
                subs: [
                    { id: 'honda', label: 'Honda' },
                    { id: 'yamaha', label: 'Yamaha' },
                    { id: 'kuba', label: 'Kuba' },
                    { id: 'rks', label: 'RKS' }
                ]
            },
            {
                id: 'ticari',
                label: 'Ticari Araçlar',
                subs: [
                    { id: 'kamyon', label: 'Kamyon' },
                    { id: 'otobus', label: 'Otobüs' }
                ]
            },
            {
                id: 'karavan',
                label: 'Karavan',
                subs: [
                    { id: 'cekme', label: 'Çekme Karavan' },
                    { id: 'moto', label: 'Moto Karavan' }
                ]
            },
            {
                id: 'deniz',
                label: 'Deniz Araçları',
                subs: [
                    { id: 'tekne', label: 'Tekne' },
                    { id: 'jet', label: 'Jet Ski' }
                ]
            }
        ]
    },
    {
        id: 'yedek-parca',
        label: 'Yedek Parça & Aksesuar',
        icon: Hammer,
        subs: [
            {
                id: 'oto-yedek',
                label: 'Oto Yedek Parça',
                subs: [
                    { id: 'motor', label: 'Motor & Mekanik' },
                    { id: 'kaporta', label: 'Kaporta' }
                ]
            },
            {
                id: 'oto-aksesuar',
                label: 'Aksesuar & Tuning',
                subs: [
                    { id: 'ses', label: 'Ses Sistemi' },
                    { id: 'jant', label: 'Jant & Lastik' }
                ]
            }
        ]
    },
    {
        id: 'telefon',
        label: 'Telefon',
        icon: Smartphone,
        subs: [
            {
                id: 'ios',
                label: 'iPhone iOS',
                subs: [
                    { id: '17pm', label: 'iPhone 17 Pro Max' },
                    { id: '16pm', label: 'iPhone 16 Pro Max' },
                    { id: '11', label: 'iPhone 11' }
                ]
            },
            {
                id: 'android',
                label: 'Android',
                subs: [
                    { id: 'samsung', label: 'Samsung' },
                    { id: 'xiaomi', label: 'Xiaomi' },
                    { id: 'huawei', label: 'Huawei' }
                ]
            },
            {
                id: 'giyilebilir',
                label: 'Giyilebilir Teknoloji',
                subs: [
                    { id: 'saat', label: 'Akıllı Saat' },
                    { id: 'bileklik', label: 'Akıllı Bileklik' }
                ]
            }
        ]
    },
    {
        id: 'elektronik',
        label: 'Elektronik',
        icon: Tv,
        subs: [
            {
                id: 'bilgisayar',
                label: 'Bilgisayar',
                subs: [
                    { id: 'laptop', label: 'Dizüstü' },
                    { id: 'masaustu', label: 'Masaüstü' },
                    { id: 'tablet', label: 'Tablet' }
                ]
            },
            {
                id: 'tv',
                label: 'TV & Ses',
                subs: [
                    { id: 'televizyon', label: 'Televizyon' },
                    { id: 'hoparlor', label: 'Hoparlör' }
                ]
            },
            {
                id: 'foto',
                label: 'Fotoğraf & Kamera',
                subs: [
                    { id: 'dijital', label: 'Dijital Makine' },
                    { id: 'aksiyon', label: 'Aksiyon Kamerası' }
                ]
            },
            {
                id: 'oyun',
                label: 'Oyun & Konsol',
                subs: [
                    { id: 'ps', label: 'PlayStation' },
                    { id: 'xbox', label: 'Xbox' },
                    { id: 'nintendo', label: 'Nintendo' }
                ]
            }
        ]
    },
    {
        id: 'ev-yasam',
        label: 'Ev & Yaşam',
        icon: Home,
        subs: [
            {
                id: 'mobilya',
                label: 'Mobilya',
                subs: [
                    { id: 'oturma', label: 'Oturma Odası' },
                    { id: 'yatak', label: 'Yatak Odası' },
                    { id: 'mutfak', label: 'Mutfak Mobilyası' }
                ]
            },
            {
                id: 'beyaz-esya',
                label: 'Beyaz Eşya',
                subs: [
                    { id: 'buzdolabi', label: 'Buzdolabı' },
                    { id: 'camasir', label: 'Çamaşır Makinesi' }
                ]
            },
            {
                id: 'kucuk-ev',
                label: 'Elektrikli Ev Aletleri',
                subs: [
                    { id: 'supurge', label: 'Süpürge' },
                    { id: 'utu', label: 'Ütü' }
                ]
            },
            {
                id: 'ev-tekstil',
                label: 'Ev Tekstili',
                subs: [
                    { id: 'hali', label: 'Halı & Kilim' },
                    { id: 'perde', label: 'Perde' }
                ]
            }
        ]
    },
    {
        id: 'giyim',
        label: 'Giyim & Moda',
        icon: Shirt,
        subs: [
            {
                id: 'kadin',
                label: 'Kadın Giyim',
                subs: [
                    { id: 'elbise', label: 'Elbise' },
                    { id: 'mont', label: 'Mont' },
                    { id: 'ayakkabi', label: 'Ayakkabı' }
                ]
            },
            {
                id: 'erkek',
                label: 'Erkek Giyim',
                subs: [
                    { id: 'takim', label: 'Takım Elbise' },
                    { id: 'tisort', label: 'Tişört' },
                    { id: 'ayakkabi', label: 'Ayakkabı' }
                ]
            },
            {
                id: 'cocuk',
                label: 'Çocuk Giyim',
                subs: [
                    { id: 'kiz', label: 'Kız Çocuk' },
                    { id: 'erkek', label: 'Erkek Çocuk' }
                ]
            }
        ]
    },
    {
        id: 'anne-bebek',
        label: 'Anne & Bebek',
        icon: Baby,
        subs: [
            {
                id: 'arac-gerec',
                label: 'Araç Gereç',
                subs: [
                    { id: 'bebek-arabasi', label: 'Bebek Arabası' },
                    { id: 'oto-koltugu', label: 'Oto Koltuğu' }
                ]
            },
            {
                id: 'giyim',
                label: 'Bebek Giyim',
                subs: [
                    { id: 'zibin', label: 'Zıbın' },
                    { id: 'tulum', label: 'Tulum' }
                ]
            }
        ]
    },
    {
        id: 'spor',
        label: 'Spor & Outdoor',
        icon: Dumbbell,
        subs: [
            {
                id: 'fitness',
                label: 'Fitness',
                subs: [
                    { id: 'kosu', label: 'Koşu Bandı' },
                    { id: 'dambil', label: 'Dambıl' }
                ]
            },
            {
                id: 'bisiklet',
                label: 'Bisiklet',
                subs: [
                    { id: 'dag', label: 'Dağ Bisikleti' },
                    { id: 'sehir', label: 'Şehir Bisikleti' }
                ]
            },
            {
                id: 'kamp',
                label: 'Kamp & Doğa',
                subs: [
                    { id: 'cadir', label: 'Çadır' },
                    { id: 'uyku-tulumu', label: 'Uyku Tulumu' }
                ]
            }
        ]
    },
    {
        id: 'hobi',
        label: 'Hobi & Eğlence',
        icon: Gamepad2,
        subs: [
            {
                id: 'kitap',
                label: 'Kitap & Dergi',
                subs: [
                    { id: 'roman', label: 'Roman' },
                    { id: 'egitim', label: 'Eğitim' }
                ]
            },
            {
                id: 'muzik',
                label: 'Müzik Aletleri',
                subs: [
                    { id: 'gitar', label: 'Gitar' },
                    { id: 'piyano', label: 'Piyano' }
                ]
            },
            {
                id: 'oyuncak',
                label: 'Oyuncak',
                subs: [
                    { id: 'lego', label: 'Lego' },
                    { id: 'bebek', label: 'Oyuncak Bebek' }
                ]
            }
        ]
    },
    {
        id: 'evcil-hayvan',
        label: 'Evcil Hayvanlar',
        icon: Dog,
        subs: [
            {
                id: 'kedi',
                label: 'Kedi',
                subs: [
                    { id: 'mama', label: 'Kedi Maması' },
                    { id: 'kum', label: 'Kedi Kumu' }
                ]
            },
            {
                id: 'kopek',
                label: 'Köpek',
                subs: [
                    { id: 'mama', label: 'Köpek Maması' },
                    { id: 'tasma', label: 'Tasma' }
                ]
            }
        ]
    },
    {
        id: 'ofis',
        label: 'Ofis & Kırtasiye',
        icon: Briefcase,
        subs: [
            {
                id: 'mobilya',
                label: 'Ofis Mobilyası',
                subs: [
                    { id: 'koltuk', label: 'Ofis Koltuğu' },
                    { id: 'masa', label: 'Çalışma Masası' }
                ]
            },
            {
                id: 'kirtasiye',
                label: 'Kırtasiye',
                subs: []
            }
        ]
    },
    {
        id: 'antika',
        label: 'Antika & Sanat',
        icon: null, // Özel ikon yoksa boş
        subs: [
            { id: 'mobilya', label: 'Antika Mobilya' },
            { id: 'dekorasyon', label: 'Dekorasyon' },
            { id: 'koleksiyon', label: 'Koleksiyon' }
        ]
    }
];
