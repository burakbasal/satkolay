import {
    Car,
    Home,
    Smartphone,
    Shirt,
    Sofa,
    Sparkles,
    Gamepad2,
    MoreHorizontal,
    Briefcase,
    Baby,
    Dumbbell,
    Palette
} from 'lucide-react';

export const MASTER_DATA = [
    {
        id: 'vasita',
        title: 'Vasıta',
        icon: Car,
        href: '/search?category=Vasıta',
        subCategories: [
            {
                title: 'Otomobil',
                href: '/search?category=Vasıta&sub=Otomobil',
                items: ['Audi', 'BMW', 'Mercedes', 'Fiat', 'Ford', 'Renault', 'Volkswagen']
            },
            {
                title: 'Motosiklet',
                href: '/search?category=Vasıta&sub=Motosiklet',
                items: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki']
            },
            {
                title: 'Ticari Araçlar',
                href: '/search?category=Vasıta&sub=Ticari Araçlar',
                items: ['Kamyon', 'Kamyonet', 'Minibüs']
            }
        ]
    },
    {
        id: 'emlak',
        title: 'Emlak',
        icon: Home,
        href: '/search?category=Emlak',
        subCategories: [
            {
                title: 'Konut',
                href: '/search?category=Emlak&sub=Konut',
                items: ['Satılık Daire', 'Kiralık Daire', 'Müstakil Ev', 'Villa']
            },
            {
                title: 'İşyeri',
                href: '/search?category=Emlak&sub=İşyeri',
                items: ['Satılık', 'Kiralık', 'Devren Satılık']
            },
            {
                title: 'Arsa',
                href: '/search?category=Emlak&sub=Arsa',
                items: ['Satılık', 'Kiralık']
            }
        ]
    },
    {
        id: 'elektronik',
        title: 'Elektronik',
        icon: Smartphone,
        href: '/search?category=Elektronik',
        subCategories: [
            {
                title: 'Telefon',
                href: '/search?category=Elektronik&sub=Telefon',
                items: ['iPhone', 'Samsung', 'Xiaomi', 'Huawei']
            },
            {
                title: 'Bilgisayar',
                href: '/search?category=Elektronik&sub=Bilgisayar',
                items: ['Dizüstü', 'Masaüstü', 'Tablet', 'Aksesuar']
            },
            {
                title: 'Fotoğraf & Kamera',
                href: '/search?category=Elektronik&sub=Fotoğraf & Kamera',
                items: ['Makine', 'Lens', 'Aksiyon Kamera']
            }
        ]
    },
    {
        id: 'ev-yasam',
        title: 'Ev & Yaşam',
        icon: Sofa,
        href: '/search?category=Ev & Yaşam',
        subCategories: [
            {
                title: 'Mobilya',
                href: '/search?category=Ev & Yaşam&sub=Mobilya',
                items: ['Oturma Grubu', 'Yatak Odası', 'Mutfak', 'Antre']
            },
            {
                title: 'Beyaz Eşya',
                href: '/search?category=Ev & Yaşam&sub=Beyaz Eşya',
                items: ['Buzdolabı', 'Çamaşır Makinesi', 'Bulaşık Makinesi']
            },
            {
                title: 'Ev Tekstili',
                href: '/search?category=Ev & Yaşam&sub=Ev Tekstili',
                items: ['Perde', 'Halı', 'Nevresim']
            }
        ]
    },
    {
        id: 'giyim',
        title: 'Moda & Giyim',
        icon: Shirt,
        href: '/search?category=Moda & Giyim',
        subCategories: [
            {
                title: 'Kadın',
                href: '/search?category=Moda & Giyim&sub=Kadın',
                items: ['Giyim', 'Ayakkabı', 'Çanta', 'Aksesuar']
            },
            {
                title: 'Erkek',
                href: '/search?category=Moda & Giyim&sub=Erkek',
                items: ['Giyim', 'Ayakkabı', 'Saat', 'Aksesuar']
            }
        ]
    },
    {
        id: 'kisisel-bakim',
        title: 'Kişisel Bakım',
        icon: Sparkles,
        href: '/search?category=Kişisel Bakım',
        subCategories: [
            {
                title: 'Kozmetik',
                href: '/search?category=Kişisel Bakım&sub=Kozmetik',
                items: ['Makyaj', 'Parfüm', 'Cilt Bakımı']
            }
        ]
    },
    {
        id: 'hobi',
        title: 'Hobi & Oyun',
        icon: Gamepad2,
        href: '/search?category=Hobi & Oyun',
        subCategories: [
            {
                title: 'Oyun Konsolları',
                href: '/search?category=Hobi & Oyun&sub=Oyun Konsolları',
                items: ['PlayStation', 'Xbox', 'Nintendo']
            },
            {
                title: 'Spor',
                href: '/search?category=Hobi & Oyun&sub=Spor',
                items: ['Fitness', 'Kamp', 'Bisiklet']
            }
        ]
    },
    {
        id: 'anne-bebek',
        title: 'Anne & Bebek',
        icon: Baby,
        href: '/search?category=Anne & Bebek',
        subCategories: [
            {
                title: 'Giyim',
                href: '/search?category=Anne & Bebek&sub=Giyim',
                items: ['Bebek Giyim', 'Hamile Giyim']
            },
            {
                title: 'Araç Gereç',
                href: '/search?category=Anne & Bebek&sub=Araç Gereç',
                items: ['Bebek Arabası', 'Oto Koltuğu', 'Mama Sandalyesi']
            }
        ]
    },
    {
        id: 'diger',
        title: 'Diğer',
        icon: MoreHorizontal,
        href: '/search?category=Diğer',
        subCategories: [
            {
                title: 'Diğer İlanlar',
                href: '/search?category=Diğer&sub=Diğer İlanlar',
                items: ['Hizmet', 'İş İlanları', 'Hayvanlar Alemi']
            }
        ]
    }
];
