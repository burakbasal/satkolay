import { Car, Smartphone, Monitor, Armchair, Bike, Shirt, Star, Baby, Music, Briefcase, Dumbbell, Truck, Hammer, Cat, History } from 'lucide-react';

export const MASTER_DATA = [
    {
        id: 'araba', title: 'Araba', icon: Car, href: '/search?category=Araba',
        subCategories: [
            {
                title: 'Araba', href: '/search?category=Araba',
                items: ['Renault', 'Volkswagen', 'Fiat', 'Ford', 'Opel', 'Peugeot']
            },
            {
                title: 'Oto Yedek Parça', href: '/search?category=YedekParca',
                items: ['Kaporta & Karoser', 'Elektrik', 'Motor & Mekanik', 'Yürüyen & Direksiyon', 'Isıtma & Havalandırma & Klima', 'Şanzıman & Vites', 'Ateşleme & Yakıt', 'Fren & Debriyaj']
            },
            {
                title: 'Jant & Lastik', href: '/search?category=JantLastik',
                items: ['Jant', 'Lastik', 'Jant & Lastik Takımları', 'Jant Kapakları', 'Aksesuar & Ekipman']
            },
            {
                title: 'Aksesuar & Tuning', href: '/search?category=Tuning',
                items: ['Aksesuar & Tuning', 'İç Aksesuar', 'Dış Aksesuar', 'Performans', 'Elektronik', 'Bakım & Onarım Ürünleri']
            },
            {
                title: 'Ses & Görüntü Sistemleri', href: '/search?category=OtoSes',
                items: ['Ses & Görüntü Sistemleri']
            },
            {
                title: 'Kiralık Araçlar', href: '/search?category=Kiralik',
                items: ['Kiralık Araçlar']
            }
        ]
    },
    {
        id: 'telefon', title: 'Telefon', icon: Smartphone, href: '/search?category=Telefon',
        subCategories: [
            {
                title: 'iPhone iOS Telefon', href: '/search?category=iPhone',
                items: ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 11', 'iPhone 13', 'iPhone 16 Pro Max', 'iPhone 15 Pro Max', 'iPhone 14 Pro Max', 'iPhone 12', 'iPhone 16 Pro', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 13 Pro Max', 'iPhone 16']
            },
            {
                title: 'Android Telefon', href: '/search?category=Android',
                items: ['Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Poco', 'Infinix', 'Tecno', 'Realme', 'Vivo']
            },
            {
                title: 'Diğer Cep Telefonları', href: '/search?category=DigerTel',
                items: ['Diğer Cep Telefonları']
            },
            {
                title: 'Telsiz & Masaüstü Telefon', href: '/search?category=Telsiz',
                items: ['Telsiz & Masaüstü Telefon']
            },
            {
                title: 'Telefon Aksesuarları', href: '/search?category=TelAksesuar',
                items: ['Şarj Cihazı', 'Bluetooth Kulaklık', 'Kablolu Kulaklık', 'Telefon Kılıfı', 'Ekran Koruyucu', 'Selfie Çubuğu & Stand']
            },
            {
                title: 'Telefon Yedek Parçaları', href: '/search?category=TelParca',
                items: ['Batarya', 'Ekran', 'Anakart', 'Kasa & Kapak', 'Diğer']
            }
        ]
    },
    {
        id: 'elektronik', title: 'Elektronik', icon: Monitor, href: '/search?category=Elektronik',
        subCategories: [
            {
                title: 'Bilgisayar', href: '/search?category=Bilgisayar',
                items: ['Dizüstü Bilgisayar', 'Masaüstü Bilgisayar', 'Monitör', 'Sunucu', 'Yazıcı & Tarayıcı', 'Bilgisayar Aksesuarları', 'Modem', 'Bilgisayar Bileşenleri']
            },
            {
                title: 'Tablet', href: '/search?category=Tablet',
                items: ['Tablet', 'E-Kitap Okuyucu', 'Tablet Aksesuarları']
            },
            {
                title: 'Oyunculara Özel', href: '/search?category=Oyun',
                items: ['Oyun Konsolu', 'Konsol Oyunu', 'Konsol Aksesuarları', 'Oyun Bilgisayarı', 'Bilgisayar Oyunu', 'Oyuncu Donanımları']
            },
            {
                title: 'TV, Görüntü & Ses Sistemi', href: '/search?category=TV',
                items: ['Televizyon', 'Hoparlör & Ev Sinema Sistemi', 'Media Player & Akıllı TV Kutusu', 'Güvenlik Kamera Sistemi', 'Uydu Ekipmanları', 'Televizyon Aksesuarları']
            },
            {
                title: 'Elektrikli Ev Aletleri', href: '/search?category=EvAletleri',
                items: ['İçecek Hazırlama', 'Yiyecek Hazırlama', 'Pişirme', 'Ütü', 'Süpürge', 'Dikiş Makinesi', 'Yedek Parça & Aksesuar']
            },
            {
                title: 'Beyaz Eşya', href: '/search?category=BeyazEsya',
                items: ['Buzdolabı', 'Çamaşır Makinesi', 'Bulaşık Makinesi', 'Ocak', 'Fırın', 'Çamaşır Kurutma Makinesi', 'Aspiratör & Davlumbaz', 'Mikrodalga Fırın']
            },
            {
                title: 'Isıtma & Soğutma', href: '/search?category=Iklim',
                items: ['Klima', 'Kombi', 'Soba & Isıtıcı', 'Vantilatör', 'Hava Temizleyici ve Nemlendirici', 'Şofben & Termosifon', 'Elektrikli Şömine', 'Yedek Parça']
            },
            {
                title: 'Fotoğraf & Kamera', href: '/search?category=Kamera',
                items: ['Dijital Fotoğraf Makinesi', 'Analog Fotoğraf Makinesi', 'Video Kamera', 'Lens & Filtre', 'Aksiyon Kamerası & Gimbal', 'Dürbün & Teleskop', 'Stüdyo & Işık Ekipmanları', 'Fotoğraf & Kamera Aksesuarları']
            },
            {
                title: 'Giyilebilir Teknoloji', href: '/search?category=Giyilebilir',
                items: ['Akıllı Bileklik', 'Akıllı Saat', 'Sanal Gerçeklik Gözlüğü']
            }
        ]
    },
    {
        id: 'ev', title: 'Ev & Yaşam', icon: Armchair, href: '/search?category=Ev',
        subCategories: [
            {
                title: 'Mobilya', href: '/search?category=Mobilya',
                items: ['Oturma Odası & Salon', 'Yatak Odası', 'Yemek Odası', 'Mutfak & Banyo', 'Çocuk & Genç Odası', 'Bahçe Mobilyası', 'Antre & Hol']
            },
            {
                title: 'Mutfak Gereçleri & Sofra', href: '/search?category=Mutfak',
                items: ['Bardak & Kadeh', 'Tabak & Kase', 'Çatal & Kaşık & Bıçak', 'Tencere & Tava', 'Çaydanlık', 'Cezve', 'Baharat Takımı', 'Yemek Takımı']
            },
            {
                title: 'Ev Tekstili', href: '/search?category=Tekstil',
                items: ['Banyo Tekstili', 'Mutfak Tekstili', 'Yatak Odası Tekstili', 'Salon Tekstili', 'Halı & Kilim', 'Perde', 'Bohça & Hurç', 'Seccade']
            },
            {
                title: 'Ev Dekorasyonu', href: '/search?category=Dekorasyon',
                items: ['Duvar & Masa Saati', 'Ayna', 'Tablo', 'Biblo', 'Vazo', 'Çerçeve', 'Şamdan & Mumluk', 'Dekoratif Saksı']
            },
            {
                title: 'Aydınlatma', href: '/search?category=Aydinlatma',
                items: ['Lambader', 'Abajur & Masa Lambası', 'Ampul', 'Aplik', 'Avize']
            },
            {
                title: 'Ev Gereçleri', href: '/search?category=EvGerecleri',
                items: ['Ütü Masası', 'Çöp Kutusu', 'Çamaşırlık', 'Askı', 'Pazar Arabası & Çantası', 'Pratik Ev Eşyaları', 'Temizlik Malzemeleri']
            }
        ]
    },
    {
        id: 'motosiklet', title: 'Motosiklet', icon: Bike, href: '/search?category=Motosiklet',
        subCategories: [
            { title: 'Motosiklet', href: '/search?category=Motosiklet', items: ['Honda', 'Mondial', 'Kuba', 'Arora', 'RKS', 'Yamaha'] },
            { title: 'Aksesuarlar', href: '/search?category=MotoAksesuar', items: ['Elektronik Ürünler', 'Dış Aksesuar', 'Koruma', 'Bakım Ürünleri', 'Bağlama & Taşıma', 'Reflektif Ürünler'] },
            { title: 'Yedek Parça', href: '/search?category=MotoParca', items: ['Yedek Parça'] },
            { title: 'Jant & Lastik', href: '/search?category=MotoLastik', items: ['Jant', 'Lastik', 'Jant & Lastik Takımı', 'Aksesuar & Ekipman'] },
            { title: 'Kask', href: '/search?category=Kask', items: ['Açık Kask', 'Kapalı Kask', 'Çeneden Açılır Kask', 'Kross Kask', 'Motosiklet Chopper Kask', 'Çocuk Kask', 'Vizör', 'Kask Askısı'] },
            { title: 'Giyim & Ekipman', href: '/search?category=MotoGiyim', items: ['Boyunluk', 'Bellik', 'Dirseklik', 'Dizlik', 'Sırtlık', 'Ayakkabı & Bot', 'Mont', 'Pantolon'] }
        ]
    },
    {
        id: 'giyim', title: 'Giyim & Aksesuar', icon: Shirt, href: '/search?category=Giyim',
        subCategories: [
            { title: 'Kadın', href: '/search?category=Kadin', items: ['Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'Ev Giyim', 'Plaj Giyim', 'Tesettür Giyim', 'Hamile Giyim', 'Elbise'] },
            { title: 'Erkek', href: '/search?category=Erkek', items: ['Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'Ev Giyim', 'Plaj Giyim', 'Takım Elbise', 'Damatlık', 'Ayakkabı'] },
            { title: 'Kız Çocuk', href: '/search?category=KizCocuk', items: ['Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'Ev Giyim', 'Plaj Giyim', 'Elbise', 'Ayakkabı', 'Çanta'] },
            { title: 'Erkek Çocuk', href: '/search?category=ErkekCocuk', items: ['Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'Ev Giyim', 'Plaj Giyim', 'Takım Elbise', 'Ayakkabı', 'Çanta'] }
        ]
    },
    {
        id: 'kozmetik', title: 'Kişisel Bakım & Kozmetik', icon: Star, href: '/search?category=Kozmetik',
        subCategories: [
            { title: 'Kişisel Bakım Aletleri', href: '/search?category=BakimAleti', items: ['Saç Kurutma Makinesi', 'Saç Düzleştirici', 'Saç Maşası', 'Yüz Temizleme Cihazı', 'Epilasyon Aleti', 'Tıraş Makinesi'] },
            { title: 'Makyaj', href: '/search?category=Makyaj', items: ['Dudak', 'Göz', 'Yüz', 'Fırça & Aksesuar'] },
            { title: 'Cilt Bakımı', href: '/search?category=Cilt', items: ['Güneş Ürünleri', 'Krem & Serum', 'Maske & Peeling'] },
            { title: 'Saç Bakımı', href: '/search?category=Sac', items: ['Boya', 'Fırça & Tarak', 'Şampuan & Saç Kremi', 'Sprey & Jöle', 'Peruk & Kaynak'] },
            { title: 'Tırnak Bakımı', href: '/search?category=Trnak', items: ['Oje & Tırnak', 'Manikür & Pedikür Aletleri'] },
            { title: 'Parfüm', href: '/search?category=Parfum', items: ['Parfüm'] },
            { title: 'Deodorant', href: '/search?category=Deodorant', items: ['Deodorant'] }
        ]
    },
    {
        id: 'bebek', title: 'Anne & Bebek & Oyuncak', icon: Baby, href: '/search?category=Bebek',
        subCategories: [
            { title: 'Bebek Araç & Gereçleri', href: '/search?category=BebekArac', items: ['Bebek Arabası & Puset', 'Oto Koltuğu & Ana Kucağı', 'Mama Sandalyesi', 'Yürüteç', 'Kanguru', 'Park Yatak', 'Bebek Telsizi & Kamera'] },
            { title: 'Anne & Bebek Bakım', href: '/search?category=BebekBakim', items: ['Bebek Banyo Gereçleri', 'Bebek Kozmetik', 'Bebek Bezi', 'Bebek Beslenme Gereçleri', 'Emzirme Ürünleri'] },
            { title: 'Bebek Odası & Mobilya', href: '/search?category=BebekOda', items: ['Bebek Odası & Mobilya'] },
            { title: 'Bebek Giyim', href: '/search?category=BebekGiyim', items: ['Üst Giyim', 'Alt Giyim', 'Elbise', 'Dış Giyim', 'Ev Giyim', 'Plaj Giyim', 'Ayakkabı', 'Aksesuar'] },
            { title: 'Oyuncak', href: '/search?category=Oyuncak', items: ['Pelüş Oyuncak', 'Eğitici Oyuncak', 'Figür Oyuncak', 'Oyuncak Bebek', 'Oyuncak Araba', 'Akülü Araç', 'Yapı Oyuncak', 'Ahşap Oyuncak'] }
        ]
    },
    {
        id: 'hobi', title: 'Hobi & Kitap & Müzik', icon: Music, href: '/search?category=Hobi',
        subCategories: [
            { title: 'Hobi', href: '/search?category=HobiMain', items: ['Kutu ve Masa Oyunları', 'Puzzle', 'Film & Müzik', 'Koleksiyon', 'Model Araçlar', 'örgü & El işi', 'Drone', 'Nargile Aksesuarları'] },
            { title: 'Kitap', href: '/search?category=Kitap', items: ['Roman & Edebiyat', 'Eğitim & Ders', 'Kişisel Gelişim', 'Çizgi Roman & Manga', 'Çocuk & Gençlik', 'İş. Ekonomi, Pazarlama', 'Tarih', 'Din & Tasavvuf'] },
            { title: 'Müzik & Müzik Aletleri', href: '/search?category=Muzik', items: ['Pikap', 'Plak', 'Tuşlu Çalgılar', 'Üflemeli Çalgılar', 'Yaylı Çalgılar', 'Vurmalı Çalgılar', 'Telli Çalgılar', 'Stüdyo & DJ Ekipmanları'] }
        ]
    },
    {
        id: 'ofis', title: 'Ofis & Kırtasiye', icon: Briefcase, href: '/search?category=Ofis',
        subCategories: [
            { title: 'Kırtasiye', href: '/search?category=Kirtasiye', items: ['Fotokopi Kağıdı', 'Yazı Tahtası & Pano', 'Okul & Kırtasiye', 'Masa Üstü Gereçleri', 'Sanatsal Boya & Malzeme'] },
            { title: 'Ofis Teknolojileri', href: '/search?category=OfisTekno', items: ['Fotokopi Makinesi', 'Faks Makinesi', 'Slayt Makinesi', 'Yazarkasa', 'Para Kasası', 'Para Sayma Makinesi', 'Laminasyon Makinesi & Malzemeler', 'Etiket Makineleri'] },
            { title: 'Ofis Mobilyaları', href: '/search?category=OfisMobilya', items: ['Masa', 'Sandalye', 'Koltuk', 'Kitaplık', 'Dolap', 'Sehpa', 'Ofis Mobilya Takımı'] }
        ]
    },
    {
        id: 'spor', title: 'Spor & Outdoor', icon: Dumbbell, href: '/search?category=Spor',
        subCategories: [
            { title: 'Bisiklet', href: '/search?category=Bisiklet', items: ['Dağ Bisikleti', 'Şehir Bisikleti', 'Katlanır Bisiklet', 'Elektrikli Bisiklet', 'Çocuk Bisikleti', 'Bisiklet Aksesuar & Yedek Parça', 'Yarış Bisikleti'] },
            { title: 'Fitness Sporları', href: '/search?category=Fitness', items: ['Koşu & Yürüyüş Bandı', 'Kondisyon Bisikleti', 'Pilates & Yoga', 'Boks', 'Trambolin', 'Barfiks & şınav Barı', 'Mekik Aletleri', 'Dambıl'] },
            { title: 'Kış Sporları', href: '/search?category=Kis', items: ['Kayak & Kızak', 'Snowboard', 'Kayak Giyim'] },
            { title: 'Su Sporları', href: '/search?category=Su', items: ['Tekne ve Yelken Ekipmanları', 'Yüzme Aksesuarları', 'Öğretici Ürünler', 'Kano & Sörf'] },
            { title: 'Doğa Sporları', href: '/search?category=Doga', items: ['Kampçılık', 'Balıkçılık', 'Avcılık', 'Okçuluk', 'Binicilik', 'Golf'] },
            { title: 'Takım Sporları', href: '/search?category=Takim', items: ['Futbol', 'Basketbol', 'Voleybol'] },
            { title: 'Raket Sporları', href: '/search?category=Raket', items: ['Tenis', 'Masa Tenisi', 'Tenis Aksesuarları'] },
            { title: 'Paten & Kaykay & Scooter', href: '/search?category=Paten', items: ['Paten & Kaykay & Scooter'] },
            { title: 'Salon Oyunları', href: '/search?category=Salon', items: ['Bilardo', 'Bowling', 'Dart', 'Langırt'] }
        ]
    },
    {
        id: 'diger-arac', title: 'Diğer Araçlar', icon: Truck, href: '/search?category=DigerArac',
        subCategories: [
            { title: 'Kamyon', href: '/search?category=Kamyon', items: ['Kamyon'] },
            { title: 'Karavan', href: '/search?category=Karavan', items: ['Çekme Karavan', 'Moto Karavan'] },
            { title: 'Otobüs', href: '/search?category=Otobus', items: ['Otobüs'] },
            { title: 'Tekne', href: '/search?category=Deniz', items: ['Motoryat', 'Yelkenli', 'Katamaran', 'Sürat Teknesi', 'Bot', 'Jet Ski', 'Sandal', 'Gezi Teknesi'] },
            { title: 'Diğer Araç Parçaları', href: '/search?category=DigerParca', items: ['Diğer'] },
            { title: 'Diğer', href: '/search?category=Diger', items: ['Diğer'] }
        ]
    },
    {
        id: 'yapi-market', title: 'Yapı Market & Bahçe', icon: Hammer, href: '/search?category=YapiMarket',
        subCategories: [
            { title: 'El Aletleri', href: '/search?category=ElAletleri', items: ['Elektrikli El Aletleri', 'Manuel El Aletleri', 'Küçük El Aletleri'] },
            { title: 'Hırdavat', href: '/search?category=Hirdavat', items: ['Hırdavat'] },
            { title: 'Banyo Yapı Malzemeleri', href: '/search?category=BanyoYapi', items: ['Banyo Yapı Malzemeleri'] },
            { title: 'Elektrik & Tesisat Malzemeleri', href: '/search?category=Elektrik', items: ['Elektrik & Tesisat Malzemeleri'] },
            { title: 'Güvenlik Ürünleri', href: '/search?category=Guvenlik', items: ['Güvenlik Ürünleri'] },
            { title: 'Su Arıtma ve Sulama', href: '/search?category=SuArtima', items: ['Su Arıtma ve Sulama'] },
            { title: 'Jeneratör', href: '/search?category=Jenerator', items: ['Jeneratör'] },
            { title: 'Mangal & Barbekü', href: '/search?category=Mangal', items: ['Mangal & Barbekü'] },
            { title: 'Bahçe Makinesi', href: '/search?category=BahceMakine', items: ['Bahçe Makinesi'] },
            { title: 'Bahçe Dekorasyonu', href: '/search?category=BahceDekor', items: ['Bahçe Dekorasyonu'] },
            { title: 'Çiçek Bakımı & Bitki Yetiştirme', href: '/search?category=Cicek', items: ['Çiçek Bakımı & Bitki Yetiştirme'] }
        ]
    },
    {
        id: 'pet', title: 'Pet Shop', icon: Cat, href: '/search?category=Pet',
        subCategories: [
            { title: 'Köpek Ürünleri', href: '/search?category=Kopek', items: ['Köpek Oyuncağı', 'Köpek Kıyafeti', 'Köpek Tasması', 'Köpek Yatağı', 'Köpek Çiti', 'Köpek Kulübesi', 'Köpek Taşıma Çantası', 'Mama & Su Kapları'] },
            { title: 'Kedi Ürünleri', href: '/search?category=Kedi', items: ['Kedi Oyuncağı', 'Kedi Kıyafeti', 'Kedi Tasması', 'Kedi Yatağı', 'Kedi Tuvaleti', 'Kedi Taşıma Çantası', 'Kedi Evi & Kafesi', 'Mama & Su Kapları'] },
            { title: 'Balık Ürünleri', href: '/search?category=Balik', items: ['Akvaryum', 'Akvaryum Motoru', 'Akvaryum Dekor & Aksesuarı'] },
            { title: 'Kuş Ürünleri', href: '/search?category=Kus', items: ['Kuş Oyuncağı', 'Kuş Kafesi', 'Kuş Yemlik & Mamalığı'] },
            { title: 'Diğer Evcil Hayvan Ürünleri', href: '/search?category=PetDiger', items: ['Diğer Evcil Hayvan Ürünleri'] }
        ]
    },
    {
        id: 'antika', title: 'Antika', icon: History, href: '/search?category=Antika',
        subCategories: [
            { title: 'Mobilya', href: '/search?category=AntikaMobilya', items: ['Mobilya'] },
            { title: 'Dekorasyon Ürünleri', href: '/search?category=AntikaDekor', items: ['Dekorasyon Ürünleri'] },
            { title: 'Makine', href: '/search?category=AntikaMakine', items: ['Makine'] },
            { title: 'Aydınlatma', href: '/search?category=AntikaAydinlatma', items: ['Aydınlatma'] },
            { title: 'Enstrüman', href: '/search?category=AntikaEnstruman', items: ['Enstrüman'] },
            { title: 'Tekstil Ürünleri', href: '/search?category=AntikaTekstil', items: ['Tekstil Ürünleri'] }
        ]
    }
];
