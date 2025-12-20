
export interface SubCategory {
    id: string;
    name: string;
    slug: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: any; // Lucide icon or null
    subcategories: SubCategory[];
}

function slugify(text: string): string {
    const trMap: Record<string, string> = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u',
        'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o'
    };

    return text
        .split('')
        .map(c => trMap[c] || c)
        .join('')
        .toLowerCase()
        .replace(/\s*&\s*/g, '-') // Replace " & " with "-"
        .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with "-"
        .replace(/-+/g, '-') // Collapse multiple dashes
        .replace(/^-|-$/g, ''); // Trim dashes
}

export const ALL_CATEGORIES: Category[] = [
    {
        id: 'araba',
        name: 'Araba',
        slug: 'araba',
        subcategories: [
            { id: 'renault', name: 'Renault', slug: 'renault' },
            { id: 'volkswagen', name: 'Volkswagen', slug: 'volkswagen' },
            { id: 'fiat', name: 'Fiat', slug: 'fiat' },
            { id: 'ford', name: 'Ford', slug: 'ford' },
            { id: 'opel', name: 'Opel', slug: 'opel' },
            { id: 'peugeot', name: 'Peugeot', slug: 'peugeot' },
            { id: 'tumunu-gor-araba', name: 'Tümünü Gör', slug: 'araba' },
        ]
    },
    {
        id: 'oto-yedek-parca',
        name: 'Oto Yedek Parça',
        slug: 'oto-yedek-parca',
        subcategories: [
            { id: 'kaporta-karoser', name: 'Kaporta & Karoser', slug: slugify('Kaporta & Karoser') },
            { id: 'elektrik', name: 'Elektrik', slug: slugify('Elektrik') },
            { id: 'motor-mekanik', name: 'Motor & Mekanik', slug: slugify('Motor & Mekanik') },
            { id: 'yuruyen-direksiyon', name: 'Yürüyen & Direksiyon', slug: slugify('Yürüyen & Direksiyon') },
            { id: 'isitma-havalandirma-klima', name: 'Isıtma & Havalandırma & Klima', slug: slugify('Isıtma & Havalandırma & Klima') },
            { id: 'sanziman-vites', name: 'Şanzıman & Vites', slug: slugify('Şanzıman & Vites') },
            { id: 'atesleme-yakit', name: 'Ateşleme & Yakıt', slug: slugify('Ateşleme & Yakıt') },
            { id: 'fren-debriyaj', name: 'Fren & Debriyaj', slug: slugify('Fren & Debriyaj') },
            { id: 'tumunu-gor-yedek-parca', name: 'Tümünü Gör', slug: 'oto-yedek-parca' },
        ]
    },
    {
        id: 'jant-lastik',
        name: 'Jant & Lastik',
        slug: 'jant-lastik',
        subcategories: [
            { id: 'jant', name: 'Jant', slug: 'jant' },
            { id: 'lastik', name: 'Lastik', slug: 'lastik' },
            { id: 'jant-lastik-takimlari', name: 'Jant & Lastik Takımları', slug: slugify('Jant & Lastik Takımları') },
            { id: 'jant-kapaklari', name: 'Jant Kapakları', slug: slugify('Jant Kapakları') },
        ]
    },
    {
        id: 'aksesuar-ekipman',
        name: 'Aksesuar & Ekipman',
        slug: slugify('Aksesuar & Ekipman'),
        subcategories: [
            { id: 'aksesuar-tuning', name: 'Aksesuar & Tuning', slug: slugify('Aksesuar & Tuning') },
            { id: 'ic-aksesuar', name: 'İç Aksesuar', slug: slugify('İç Aksesuar') },
            { id: 'dis-aksesuar', name: 'Dış Aksesuar', slug: slugify('Dış Aksesuar') },
            { id: 'performans', name: 'Performans', slug: 'performans' },
            { id: 'elektronik-aksesuar', name: 'Elektronik', slug: 'elektronik' },
            { id: 'bakim-onarim-urunleri', name: 'Bakım & Onarım Ürünleri', slug: slugify('Bakım & Onarım Ürünleri') },
            { id: 'ses-goruntu-sistemleri', name: 'Ses & Görüntü Sistemleri', slug: slugify('Ses & Görüntü Sistemleri') },
            { id: 'kiralik-araclar', name: 'Kiralık Araçlar', slug: slugify('Kiralık Araçlar') },
        ]
    },
    {
        id: 'telefon',
        name: 'Telefon',
        slug: 'telefon',
        subcategories: [
            { id: 'iphone-ios', name: 'iPhone İOS Telefon', slug: slugify('iPhone İOS Telefon') },
            { id: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max', slug: slugify('iPhone 17 Pro Max') },
            { id: 'iphone-17-pro', name: 'iPhone 17 Pro', slug: slugify('iPhone 17 Pro') },
            { id: 'iphone-11', name: 'iPhone 11', slug: 'iphone-11' },
            { id: 'iphone-13', name: 'iPhone 13', slug: 'iphone-13' },
            { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', slug: slugify('iPhone 16 Pro Max') },
            { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', slug: slugify('iPhone 15 Pro Max') },
            { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', slug: slugify('iPhone 14 Pro Max') },
            { id: 'iphone-12', name: 'iPhone 12', slug: 'iphone-12' },
            { id: 'iphone-16-pro', name: 'iPhone 16 Pro', slug: slugify('iPhone 16 Pro') },
            { id: 'iphone-15-pro', name: 'iPhone 15 Pro', slug: slugify('iPhone 15 Pro') },
            { id: 'iphone-15', name: 'iPhone 15', slug: 'iphone-15' },
            { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', slug: slugify('iPhone 13 Pro Max') },
            { id: 'iphone-16', name: 'iPhone 16', slug: 'iphone-16' },
            { id: 'tumunu-gor-iphone', name: 'Tümünü Gör (iPhone)', slug: slugify('iPhone İOS Telefon') },
            { id: 'android-telefon', name: 'Android Telefon', slug: slugify('Android Telefon') },
            { id: 'samsung', name: 'Samsung', slug: 'samsung' },
            { id: 'xiaomi', name: 'Xiaomi', slug: 'xiaomi' },
            { id: 'huawei', name: 'Huawei', slug: 'huawei' },
            { id: 'oppo', name: 'Oppo', slug: 'oppo' },
            { id: 'poco', name: 'Poco', slug: 'poco' },
            { id: 'infinix', name: 'Infinix', slug: 'infinix' },
            { id: 'tecno', name: 'Tecno', slug: 'tecno' },
            { id: 'realme', name: 'Realme', slug: 'realme' },
            { id: 'vivo', name: 'Vivo', slug: 'vivo' },
            { id: 'tumunu-gor-android', name: 'Tümünü Gör (Android)', slug: slugify('Android Telefon') },
            { id: 'diger-cep-telefonlari', name: 'Diğer Cep Telefonları', slug: slugify('Diğer Cep Telefonları') },
            { id: 'telsiz-masaustu-telefon', name: 'Telsiz & Masaüstü Telefon', slug: slugify('Telsiz & Masaüstü Telefon') },
            { id: 'telefon-aksesuarlari', name: 'Telefon Aksesuarları', slug: slugify('Telefon Aksesuarları') },
            { id: 'sarj-cihazi', name: 'Şarj Cihazı', slug: slugify('Şarj Cihazı') },
            { id: 'bluetooth-kulaklik', name: 'Bluetooth Kulaklık', slug: slugify('Bluetooth Kulaklık') },
            { id: 'kablolu-kulaklik', name: 'Kablolu Kulaklık', slug: slugify('Kablolu Kulaklık') },
            { id: 'telefon-kilifi', name: 'Telefon Kılıfı', slug: slugify('Telefon Kılıfı') },
            { id: 'ekran-koruyucu', name: 'Ekran Koruyucu', slug: slugify('Ekran Koruyucu') },
            { id: 'selfie-cubugu-stand', name: 'Selfie Çubuğu & Stand', slug: slugify('Selfie Çubuğu & Stand') },
            { id: 'telefon-yedek-parcalari', name: 'Telefon Yedek Parçaları', slug: slugify('Telefon Yedek Parçaları') },
            { id: 'batarya', name: 'Batarya', slug: 'batarya' },
            { id: 'ekran', name: 'Ekran', slug: 'ekran' },
            { id: 'anakart', name: 'Anakart', slug: 'anakart' },
            { id: 'kasa-kapak', name: 'Kasa & Kapak', slug: slugify('Kasa & Kapak') },
            { id: 'diger-telefon', name: 'Diğer', slug: 'diger-telefon' },
        ]
    },
    {
        id: 'bilgisayar',
        name: 'Bilgisayar',
        slug: 'bilgisayar',
        subcategories: [
            { id: 'dizustu-bilgisayar', name: 'Dizüstü Bilgisayar', slug: slugify('Dizüstü Bilgisayar') },
            { id: 'masaustu-bilgisayar', name: 'Masaüstü Bilgisayar', slug: slugify('Masaüstü Bilgisayar') },
            { id: 'monitor', name: 'Monitör', slug: 'monitor' },
            { id: 'sunucu', name: 'Sunucu', slug: 'sunucu' },
            { id: 'yazici-tarayici', name: 'Yazıcı & Tarayıcı', slug: slugify('Yazıcı & Tarayıcı') },
            { id: 'bilgisayar-aksesuarlari', name: 'Bilgisayar Aksesuarları', slug: slugify('Bilgisayar Aksesuarları') },
            { id: 'modem', name: 'Modem', slug: 'modem' },
            { id: 'bilgisayar-bilesenleri', name: 'Bilgisayar Bileşenleri', slug: slugify('Bilgisayar Bileşenleri') },
            { id: 'tablet', name: 'Tablet', slug: 'tablet' },
            { id: 'tablet-cihaz', name: 'Tablet', slug: 'tablet' },
            { id: 'e-kitap-okuyucu', name: 'E-Kitap Okuyucu', slug: slugify('E-Kitap Okuyucu') },
            { id: 'tablet-aksesuarlari', name: 'Tablet Aksesuarları', slug: slugify('Tablet Aksesuarları') },
            { id: 'oyunculara-ozel', name: 'Oyunculara Özel', slug: slugify('Oyunculara Özel') },
            { id: 'oyun-konsolu', name: 'Oyun Konsolu', slug: slugify('Oyun Konsolu') },
            { id: 'konsol-oyunu', name: 'Konsol Oyunu', slug: slugify('Konsol Oyunu') },
            { id: 'konsol-aksesuarlari', name: 'Konsol Aksesuarları', slug: slugify('Konsol Aksesuarları') },
            { id: 'oyun-bilgisayari', name: 'Oyun Bilgisayarı', slug: slugify('Oyun Bilgisayarı') },
            { id: 'bilgisayar-oyunu', name: 'Bilgisayar Oyunu', slug: slugify('Bilgisayar Oyunu') },
            { id: 'oyuncu-donanimlari', name: 'Oyuncu Donanımları', slug: slugify('Oyuncu Donanımları') },
        ]
    },
    {
        id: 'tv-ses',
        name: 'TV, Görüntü & Ses Sistemi',
        slug: slugify('TV, Görüntü & Ses Sistemi'),
        subcategories: [
            { id: 'televizyon', name: 'Televizyon', slug: 'televizyon' },
            { id: 'hoparlor-ev-sinema', name: 'Hoparlör & Ev Sinema Sistemi', slug: slugify('Hoparlör & Ev Sinema Sistemi') },
            { id: 'media-player', name: 'Media Player & Akıllı TV Kutusu', slug: slugify('Media Player & Akıllı TV Kutusu') },
            { id: 'guvenlik-kamera', name: 'Güvenlik Kamera Sistemi', slug: slugify('Güvenlik Kamera Sistemi') },
            { id: 'uydu-ekipmanlari', name: 'Uydu Ekipmanları', slug: slugify('Uydu Ekipmanları') },
            { id: 'tv-aksesuarlari', name: 'Televizyon Aksesuarları', slug: slugify('Televizyon Aksesuarları') },
        ]
    },
    {
        id: 'elektrikli-ev-aletleri',
        name: 'Elektrikli Ev Aletleri',
        slug: slugify('Elektrikli Ev Aletleri'),
        subcategories: [
            { id: 'icecek-hazirlama', name: 'İçecek Hazırlama', slug: slugify('İçecek Hazırlama') },
            { id: 'yiyecek-hazirlama', name: 'Yiyecek Hazırlama', slug: slugify('Yiyecek Hazırlama') },
            { id: 'pisirme', name: 'Pişirme', slug: slugify('Pişirme') },
            { id: 'utu', name: 'Ütü', slug: 'utu' },
            { id: 'supurge', name: 'Süpürge', slug: 'supurge' },
            { id: 'dikis-makinesi', name: 'Dikiş Makinesi', slug: slugify('Dikiş Makinesi') },
            { id: 'yedek-parca-ev-aletleri', name: 'Yedek Parça & Aksesuar', slug: slugify('Yedek Parça & Aksesuar') },
        ]
    },
    {
        id: 'beyaz-esya',
        name: 'Beyaz Eşya',
        slug: slugify('Beyaz Eşya'),
        subcategories: [
            { id: 'buzdolabi', name: 'Buzdolabı', slug: 'buzdolabi' },
            { id: 'camasir-makinesi', name: 'Çamaşır Makinesi', slug: slugify('Çamaşır Makinesi') },
            { id: 'bulasik-makinesi', name: 'Bulaşık Makinesi', slug: slugify('Bulaşık Makinesi') },
            { id: 'ocak', name: 'Ocak', slug: 'ocak' },
            { id: 'firin', name: 'Fırın', slug: 'firin' },
            { id: 'camasir-kurutma-makinesi', name: 'Çamaşır Kurutma Makinesi', slug: slugify('Çamaşır Kurutma Makinesi') },
            { id: 'aspirator-davlumbaz', name: 'Aspiratör & Davlumbaz', slug: slugify('Aspiratör & Davlumbaz') },
            { id: 'mikrodalga-firin', name: 'Mikrodalga Fırın', slug: slugify('Mikrodalga Fırın') },
            { id: 'tumunu-gor-beyaz-esya', name: 'Tümünü Gör', slug: slugify('Beyaz Eşya') },
        ]
    },
    {
        id: 'isitma-sogutma',
        name: 'Isıtma & Soğutma',
        slug: slugify('Isıtma & Soğutma'),
        subcategories: [
            { id: 'klima', name: 'Klima', slug: 'klima' },
            { id: 'kombi', name: 'Kombi', slug: 'kombi' },
            { id: 'soba-isitici', name: 'Soba & Isıtıcı', slug: slugify('Soba & Isıtıcı') },
            { id: 'vantilator', name: 'Vantilatör', slug: 'vantilator' },
            { id: 'hava-temizleyici', name: 'Hava Temizleyici ve Nemlendirici', slug: slugify('Hava Temizleyici ve Nemlendirici') },
            { id: 'sofben-termosifon', name: 'Şofben & Termosifon', slug: slugify('Şofben & Termosifon') },
            { id: 'elektrikli-somine', name: 'Elektrikli Şömine', slug: slugify('Elektrikli Şömine') },
            { id: 'yedek-parca-isitma', name: 'Yedek Parça', slug: 'yedek-parca-isitma' },
        ]
    },
    {
        id: 'fotograf-kamera',
        name: 'Fotoğraf & Kamera',
        slug: slugify('Fotoğraf & Kamera'),
        subcategories: [
            { id: 'dijital-fotograf-makinesi', name: 'Dijital Fotoğraf Makinesi', slug: slugify('Dijital Fotoğraf Makinesi') },
            { id: 'analog-fotograf-makinesi', name: 'Analog Fotoğraf Makinesi', slug: slugify('Analog Fotoğraf Makinesi') },
            { id: 'video-kamera', name: 'Video Kamera', slug: slugify('Video Kamera') },
            { id: 'lens-filtre', name: 'Lens & Filtre', slug: slugify('Lens & Filtre') },
            { id: 'aksiyon-kamerasi-gimbal', name: 'Aksiyon Kamerası & Gimbal', slug: slugify('Aksiyon Kamerası & Gimbal') },
            { id: 'durbun-teleskop', name: 'Dürbün & Teleskop', slug: slugify('Dürbün & Teleskop') },
            { id: 'studyo-isik', name: 'Stüdyo & Işık Ekipmanları', slug: slugify('Stüdyo & Işık Ekipmanları') },
            { id: 'fotograf-kamera-aksesuarlari', name: 'Fotoğraf & Kamera Aksesuarları', slug: slugify('Fotoğraf & Kamera Aksesuarları') },
        ]
    },
    {
        id: 'giyilebilir-teknoloji',
        name: 'Giyilebilir Teknoloji',
        slug: slugify('Giyilebilir Teknoloji'),
        subcategories: [
            { id: 'akilli-bileklik', name: 'Akıllı Bileklik', slug: slugify('Akıllı Bileklik') },
            { id: 'akilli-saat', name: 'Akıllı Saat', slug: slugify('Akıllı Saat') },
            { id: 'sanal-gerceklik-gozlugu', name: 'Sanal Gerçeklik Gözlüğü', slug: slugify('Sanal Gerçeklik Gözlüğü') },
        ]
    },
    {
        id: 'mobilya',
        name: 'Mobilya',
        slug: 'mobilya',
        subcategories: [
            { id: 'oturma-odasi-salon', name: 'Oturma Odası & Salon', slug: slugify('Oturma Odası & Salon') },
            { id: 'yatak-odasi', name: 'Yatak Odası', slug: 'yatak-odasi' },
            { id: 'yemek-odasi', name: 'Yemek Odası', slug: 'yemek-odasi' },
            { id: 'mutfak-banyo-mobilya', name: 'Mutfak & Banyo', slug: slugify('Mutfak & Banyo') },
            { id: 'cocuk-genc-odasi', name: 'Çocuk & Genç Odası', slug: slugify('Çocuk & Genç Odası') },
            { id: 'bahce-mobilyasi', name: 'Bahçe Mobilyası', slug: slugify('Bahçe Mobilyası') },
            { id: 'antre-hol', name: 'Antre & Hol', slug: slugify('Antre & Hol') },
        ]
    },
    {
        id: 'mutfak-gerecleri',
        name: 'Mutfak Gereçleri & Sofra',
        slug: slugify('Mutfak Gereçleri & Sofra'),
        subcategories: [
            { id: 'bardak-kadeh', name: 'Bardak & Kadeh', slug: slugify('Bardak & Kadeh') },
            { id: 'tabak-kase', name: 'Tabak & Kase', slug: slugify('Tabak & Kase') },
            { id: 'catal-kasik-bicak', name: 'Çatal & Kaşık & Bıçak', slug: slugify('Çatal & Kaşık & Bıçak') },
            { id: 'tencere-tava', name: 'Tencere & Tava', slug: slugify('Tencere & Tava') },
            { id: 'caydanlik', name: 'Çaydanlık', slug: 'caydanlik' },
            { id: 'cezve', name: 'Cezve', slug: 'cezve' },
            { id: 'baharat-takimi', name: 'Baharat Takımı', slug: slugify('Baharat Takımı') },
            { id: 'yemek-takimi', name: 'Yemek Takımı', slug: slugify('Yemek Takımı') },
            { id: 'tumunu-gor-mutfak', name: 'Tümünü Gör', slug: slugify('Mutfak Gereçleri & Sofra') },
        ]
    },
    {
        id: 'ev-tekstili',
        name: 'Ev Tekstili',
        slug: slugify('Ev Tekstili'),
        subcategories: [
            { id: 'banyo-tekstili', name: 'Banyo Tekstili', slug: slugify('Banyo Tekstili') },
            { id: 'mutfak-tekstili', name: 'Mutfak Tekstili', slug: slugify('Mutfak Tekstili') },
            { id: 'yatak-odasi-tekstili', name: 'Yatak Odası Tekstili', slug: slugify('Yatak Odası Tekstili') },
            { id: 'salon-tekstili', name: 'Salon Tekstili', slug: slugify('Salon Tekstili') },
            { id: 'hali-kilim', name: 'Halı & Kilim', slug: slugify('Halı & Kilim') },
            { id: 'perde', name: 'Perde', slug: 'perde' },
            { id: 'bohca-hurc', name: 'Bohça & Hurç', slug: slugify('Bohça & Hurç') },
            { id: 'seccade', name: 'Seccade', slug: 'seccade' },
        ]
    },
    {
        id: 'ev-dekorasyonu',
        name: 'Ev Dekorasyonu',
        slug: slugify('Ev Dekorasyonu'),
        subcategories: [
            { id: 'duvar-masa-saati', name: 'Duvar & Masa Saati', slug: slugify('Duvar & Masa Saati') },
            { id: 'ayna', name: 'Ayna', slug: 'ayna' },
            { id: 'tablo', name: 'Tablo', slug: 'tablo' },
            { id: 'biblo', name: 'Biblo', slug: 'biblo' },
            { id: 'vazo', name: 'Vazo', slug: 'vazo' },
            { id: 'cerceve', name: 'Çerçeve', slug: 'cerceve' },
            { id: 'samdan-mumluk', name: 'Şamdan & Mumluk', slug: slugify('Şamdan & Mumluk') },
            { id: 'dekoratif-saksi', name: 'Dekoratif Saksı', slug: slugify('Dekoratif Saksı') },
            { id: 'tumunu-gor-dekorasyon', name: 'Tümünü Gör', slug: slugify('Ev Dekorasyonu') },
        ]
    },
    {
        id: 'aydinlatma',
        name: 'Aydınlatma',
        slug: 'aydinlatma',
        subcategories: [
            { id: 'lambader', name: 'Lambader', slug: 'lambader' },
            { id: 'abajur-masa-lambasi', name: 'Abajur & Masa Lambası', slug: slugify('Abajur & Masa Lambası') },
            { id: 'ampul', name: 'Ampul', slug: 'ampul' },
            { id: 'aplik', name: 'Aplik', slug: 'aplik' },
            { id: 'avize', name: 'Avize', slug: 'avize' },
        ]
    },
    {
        id: 'ev-gerecleri',
        name: 'Ev Gereçleri',
        slug: slugify('Ev Gereçleri'),
        subcategories: [
            { id: 'utu-masasi', name: 'Ütü Masası', slug: slugify('Ütü Masası') },
            { id: 'cop-kutusu', name: 'Çöp Kutusu', slug: slugify('Çöp Kutusu') },
            { id: 'camasirlik', name: 'Çamaşırlık', slug: 'camasirlik' },
            { id: 'aski', name: 'Askı', slug: 'aski' },
            { id: 'pazar-arabasi', name: 'Pazar Arabası & Çantası', slug: slugify('Pazar Arabası & Çantası') },
            { id: 'pratik-ev-esyalar', name: 'Pratik Ev Eşyaları', slug: slugify('Pratik Ev Eşyaları') },
            { id: 'temizlik-malzemeleri', name: 'Temizlik Malzemeleri', slug: slugify('Temizlik Malzemeleri') },
        ]
    },
    {
        id: 'motosiklet',
        name: 'Motosiklet',
        slug: 'motosiklet',
        subcategories: [
            { id: 'honda', name: 'Honda', slug: 'honda' },
            { id: 'mondial', name: 'Mondial', slug: 'mondial' },
            { id: 'kuba', name: 'Kuba', slug: 'kuba' },
            { id: 'arora', name: 'Arora', slug: 'arora' },
            { id: 'rks', name: 'RKS', slug: 'rks' },
            { id: 'yamaha', name: 'Yamaha', slug: 'yamaha' },
            { id: 'tumunu-gor-motosiklet', name: 'Tümünü Gör', slug: 'motosiklet' },
            { id: 'motosiklet-aksesuarlar', name: 'Aksesuarlar', slug: slugify('Aksesuarlar') },
            { id: 'elektronik-urunler', name: 'Elektronik Ürünler', slug: slugify('Elektronik Ürünler') },
            { id: 'ozel-dis-aksesuar', name: 'Dış Aksesuar', slug: slugify('Dış Aksesuar') },
            { id: 'koruma', name: 'Koruma', slug: 'koruma' },
            { id: 'bakim-urunleri', name: 'Bakım Ürünleri', slug: slugify('Bakım Ürünleri') },
            { id: 'baglama-tasima', name: 'Bağlama & Taşıma', slug: slugify('Bağlama & Taşıma') },
            { id: 'reflektif-urunler', name: 'Reflektif Ürünler', slug: slugify('Reflektif Ürünler') },
            { id: 'motosiklet-yedek-parca', name: 'Yedek Parça', slug: 'yedek-parca' },
            { id: 'jant-lastik-motor', name: 'Jant & Lastik', slug: slugify('Jant & Lastik') },
            { id: 'jant-motor', name: 'Jant', slug: 'jant' },
            { id: 'lastik-motor', name: 'Lastik', slug: 'lastik' },
            { id: 'jant-lastik-takimi-motor', name: 'Jant & Lastik Takımı', slug: slugify('Jant & Lastik Takımı') },
            { id: 'kask', name: 'Kask', slug: 'kask' },
            { id: 'acik-kask', name: 'Açık Kask', slug: slugify('Açık Kask') },
            { id: 'kapali-kask', name: 'Kapalı Kask', slug: slugify('Kapalı Kask') },
            { id: 'ceneden-acilir-kask', name: 'Çeneden Açılır Kask', slug: slugify('Çeneden Açılır Kask') },
            { id: 'kross-kask', name: 'Kross Kask', slug: slugify('Kross Kask') },
            { id: 'motosiklet-chopper-kask', name: 'Motosiklet Chopper Kask', slug: slugify('Motosiklet Chopper Kask') },
            { id: 'cocuk-kask', name: 'Çocuk Kask', slug: slugify('Çocuk Kask') },
            { id: 'vizor', name: 'Vizör', slug: 'vizor' },
            { id: 'kask-askisi', name: 'Kask Askısı', slug: slugify('Kask Askısı') },
            { id: 'tumunu-gor-kask', name: 'Tümünü Gör (Kask)', slug: 'kask' },
            { id: 'giyim-ekipman', name: 'Giyim & Ekipman', slug: slugify('Giyim & Ekipman') },
            { id: 'boyunluk', name: 'Boyunluk', slug: 'boyunluk' },
            { id: 'bellik', name: 'Bellik', slug: 'bellik' },
            { id: 'dirseklik', name: 'Dirseklik', slug: 'dirseklik' },
            { id: 'dizlik', name: 'Dizlik', slug: 'dizlik' },
            { id: 'sirtlik', name: 'Sırtlık', slug: 'sirtlik' },
            { id: 'ayakkabi-bot', name: 'Ayakkabı & Bot', slug: slugify('Ayakkabı & Bot') },
            { id: 'mont', name: 'Mont', slug: 'mont' },
            { id: 'pantolon', name: 'Pantolon', slug: 'pantolon' },
            { id: 'tumunu-gor-ekipman', name: 'Tümünü Gör (Ekipman)', slug: slugify('Giyim & Ekipman') },
        ]
    },
    {
        id: 'giyim-kadin',
        name: 'Giyim (Kadın)',
        slug: slugify('Giyim Kadın'),
        subcategories: [
            { id: 'kadin-ust-giyim', name: 'Üst Giyim', slug: slugify('Üst Giyim') },
            { id: 'kadin-alt-giyim', name: 'Alt Giyim', slug: slugify('Alt Giyim') },
            { id: 'kadin-dis-giyim', name: 'Dış Giyim', slug: slugify('Dış Giyim') },
            { id: 'kadin-ev-giyim', name: 'Ev Giyim', slug: slugify('Ev Giyim') },
            { id: 'kadin-plaj-giyim', name: 'Plaj Giyim', slug: slugify('Plaj Giyim') },
            { id: 'tesettur-giyim', name: 'Tesettür Giyim', slug: slugify('Tesettür Giyim') },
            { id: 'hamile-giyim', name: 'Hamile Giyim', slug: slugify('Hamile Giyim') },
            { id: 'kadin-elbise', name: 'Elbise', slug: 'elbise' },
            { id: 'kadin-ayakkabi', name: 'Ayakkabı', slug: 'ayakkabi' },
            { id: 'tumunu-gor-kadin', name: 'Tümünü Gör', slug: slugify('Giyim Kadın') },
        ]
    },
    {
        id: 'giyim-erkek',
        name: 'Giyim (Erkek)',
        slug: slugify('Giyim Erkek'),
        subcategories: [
            { id: 'erkek-ust-giyim', name: 'Üst Giyim', slug: slugify('Üst Giyim') },
            { id: 'erkek-alt-giyim', name: 'Alt Giyim', slug: slugify('Alt Giyim') },
            { id: 'erkek-dis-giyim', name: 'Dış Giyim', slug: slugify('Dış Giyim') },
            { id: 'erkek-ev-giyim', name: 'Ev Giyim', slug: slugify('Ev Giyim') },
            { id: 'erkek-plaj-giyim', name: 'Plaj Giyim', slug: slugify('Plaj Giyim') },
            { id: 'takim-elbise', name: 'Takım Elbise', slug: slugify('Takım Elbise') },
            { id: 'damatlik', name: 'Damatlık', slug: 'damatlik' },
            { id: 'erkek-ayakkabi', name: 'Ayakkabı', slug: 'ayakkabi' },
            { id: 'tumunu-gor-erkek', name: 'Tümünü Gör', slug: slugify('Giyim Erkek') },
        ]
    },
    {
        id: 'giyim-cocuk',
        name: 'Kız & Erkek Çocuk',
        slug: slugify('Giyim Çocuk'),
        subcategories: [
            { id: 'kiz-cocuk-ust', name: 'Kız - Üst Giyim', slug: slugify('Kız Üst Giyim') },
            { id: 'kiz-cocuk-alt', name: 'Kız - Alt Giyim', slug: slugify('Kız Alt Giyim') },
            { id: 'kiz-cocuk-dis', name: 'Kız - Dış Giyim', slug: slugify('Kız Dış Giyim') },
            { id: 'kiz-cocuk-elbise', name: 'Kız - Elbise', slug: slugify('Kız Elbise') },
            { id: 'erkek-cocuk-ust', name: 'Erkek - Üst Giyim', slug: slugify('Erkek Üst Giyim') },
            { id: 'erkek-cocuk-alt', name: 'Erkek - Alt Giyim', slug: slugify('Erkek Alt Giyim') },
            { id: 'erkek-cocuk-dis', name: 'Erkek - Dış Giyim', slug: slugify('Erkek Dış Giyim') },
            { id: 'erkek-cocuk-takim', name: 'Erkek - Takım Elbise', slug: slugify('Erkek Takım Elbise') },
            { id: 'cocuk-ayakkabi', name: 'Ayakkabı', slug: 'cocuk-ayakkabi' },
        ]
    },
    {
        id: 'kisisel-bakim',
        name: 'Kişisel Bakım',
        slug: slugify('Kişisel Bakım'),
        subcategories: [
            { id: 'sac-kurutma', name: 'Saç Kurutma Makinesi', slug: slugify('Saç Kurutma Makinesi') },
            { id: 'sac-duzlestirici', name: 'Saç Düzleştirici', slug: slugify('Saç Düzleştirici') },
            { id: 'sac-masasi', name: 'Saç Maşası', slug: slugify('Saç Maşası') },
            { id: 'yuz-temizleme', name: 'Yüz Temizleme Cihazı', slug: slugify('Yüz Temizleme Cihazı') },
            { id: 'epilasyon', name: 'Epilasyon Aleti', slug: slugify('Epilasyon Aleti') },
            { id: 'tiras-makinesi', name: 'Tıraş Makinesi', slug: slugify('Tıraş Makinesi') },
            { id: 'makyaj', name: 'Makyaj', slug: 'makyaj' },
            { id: 'dudak', name: 'Dudak', slug: 'dudak' },
            { id: 'goz', name: 'Göz', slug: 'goz' },
            { id: 'yuz', name: 'Yüz', slug: 'yuz' },
            { id: 'fircha-aksesuar', name: 'Fırça & Aksesuar', slug: slugify('Fırça & Aksesuar') },
            { id: 'cilt-bakimi', name: 'Cilt Bakımı', slug: slugify('Cilt Bakımı') },
            { id: 'gunes-urunleri', name: 'Güneş Ürünleri', slug: slugify('Güneş Ürünleri') },
            { id: 'krem-serum', name: 'Krem & Serum', slug: slugify('Krem & Serum') },
            { id: 'maske-peeling', name: 'Maske & Peeling', slug: slugify('Maske & Peeling') },
            { id: 'sac-bakimi', name: 'Saç Bakımı', slug: slugify('Saç Bakımı') },
            { id: 'boya', name: 'Boya', slug: 'boya' },
            { id: 'sac-firaca-tarak', name: 'Fırça & Tarak', slug: slugify('Fırça & Tarak') },
            { id: 'sampuan-krem', name: 'Şampuan & Saç Kremi', slug: slugify('Şampuan & Saç Kremi') },
            { id: 'sprey-jole', name: 'Sprey & Jöle', slug: slugify('Sprey & Jöle') },
            { id: 'peruk-kaynak', name: 'Peruk & Kaynak', slug: slugify('Peruk & Kaynak') },
            { id: 'tirnak-bakimi', name: 'Tırnak Bakımı', slug: slugify('Tırnak Bakımı') },
            { id: 'oje-tirnak', name: 'Oje & Tırnak', slug: slugify('Oje & Tırnak') },
            { id: 'manikur-pedikur', name: 'Manikür & Pedikür Aletleri', slug: slugify('Manikür & Pedikür Aletleri') },
            { id: 'parfum', name: 'Parfüm', slug: 'parfum' },
            { id: 'deodorant', name: 'Deodorant', slug: 'deodorant' },
        ]
    },
    {
        id: 'anne-bebek',
        name: 'Anne & Bebek',
        slug: slugify('Anne & Bebek'),
        subcategories: [
            { id: 'bebek-arabasi-puset', name: 'Bebek Arabası & Puset', slug: slugify('Bebek Arabası & Puset') },
            { id: 'oto-koltugu-ana-kucagi', name: 'Oto Koltuğu & Ana Kucağı', slug: slugify('Oto Koltuğu & Ana Kucağı') },
            { id: 'mama-sandalyesi', name: 'Mama Sandalyesi', slug: slugify('Mama Sandalyesi') },
            { id: 'yurutec', name: 'Yürüteç', slug: 'yurutec' },
            { id: 'kanguru', name: 'Kanguru', slug: 'kanguru' },
            { id: 'park-yatak', name: 'Park Yatak', slug: slugify('Park Yatak') },
            { id: 'bebek-telsizi-kamera', name: 'Bebek Telsizi & Kamera', slug: slugify('Bebek Telsizi & Kamera') },
            { id: 'anne-bebek-bakim', name: 'Anne & Bebek Bakım', slug: slugify('Anne & Bebek Bakım') },
            { id: 'bebek-banyo-gerecleri', name: 'Bebek Banyo Gereçleri', slug: slugify('Bebek Banyo Gereçleri') },
            { id: 'bebek-kozmetik', name: 'Bebek Kozmetik', slug: slugify('Bebek Kozmetik') },
            { id: 'bebek-bezi', name: 'Bebek Bezi', slug: slugify('Bebek Bezi') },
            { id: 'bebek-beslenme', name: 'Bebek Beslenme Gereçleri', slug: slugify('Bebek Beslenme Gereçleri') },
            { id: 'emzirme-urunleri', name: 'Emzirme Ürünleri', slug: slugify('Emzirme Ürünleri') },
            { id: 'bebek-odasi-mobilya', name: 'Bebek Odası & Mobilya', slug: slugify('Bebek Odası & Mobilya') },
            { id: 'bebek-giyim', name: 'Bebek Giyim', slug: slugify('Bebek Giyim') },
        ]
    },
    {
        id: 'oyuncak-hobi',
        name: 'Oyuncak & Hobi',
        slug: slugify('Oyuncak & Hobi'),
        subcategories: [
            { id: 'pelus-oyuncak', name: 'Pelüş Oyuncak', slug: slugify('Pelüş Oyuncak') },
            { id: 'egitici-oyuncak', name: 'Eğitici Oyuncak', slug: slugify('Eğitici Oyuncak') },
            { id: 'figur-oyuncak', name: 'Figür Oyuncak', slug: slugify('Figür Oyuncak') },
            { id: 'oyuncak-bebek', name: 'Oyuncak Bebek', slug: slugify('Oyuncak Bebek') },
            { id: 'oyuncak-araba', name: 'Oyuncak Araba', slug: slugify('Oyuncak Araba') },
            { id: 'akulu-arac', name: 'Akülü Araç', slug: slugify('Akülü Araç') },
            { id: 'yapi-oyuncak', name: 'Yapı Oyuncak', slug: slugify('Yapı Oyuncak') },
            { id: 'ahsap-oyuncak', name: 'Ahşap Oyuncak', slug: slugify('Ahşap Oyuncak') },
            { id: 'tumunu-gor-oyuncak', name: 'Tümünü Gör (Oyuncak)', slug: slugify('Oyuncak') },
            { id: 'kutu-masa-oyunlari', name: 'Kutu ve Masa Oyunları', slug: slugify('Kutu ve Masa Oyunları') },
            { id: 'puzzle', name: 'Puzzle', slug: 'puzzle' },
            { id: 'film-muzik', name: 'Film & Müzik', slug: slugify('Film & Müzik') },
            { id: 'koleksiyon', name: 'Koleksiyon', slug: 'koleksiyon' },
            { id: 'model-araclar', name: 'Model Araçlar', slug: slugify('Model Araçlar') },
            { id: 'orgu-el-isi', name: 'Örgü & El İşi', slug: slugify('Örgü & El İşi') },
            { id: 'drone', name: 'Drone', slug: 'drone' },
            { id: 'nargile-aksesuarlari', name: 'Nargile Aksesuarları', slug: slugify('Nargile Aksesuarları') },
            { id: 'kitap', name: 'Kitap', slug: 'kitap' },
            { id: 'muzik-aletleri', name: 'Müzik & Müzik Aletleri', slug: slugify('Müzik & Müzik Aletleri') },
        ]
    },
    {
        id: 'ofis-kirtasiye',
        name: 'Ofis & Kırtasiye',
        slug: slugify('Ofis & Kırtasiye'),
        subcategories: [
            { id: 'ofis-mobilyalari', name: 'Ofis Mobilyaları', slug: slugify('Ofis Mobilyaları') },
            { id: 'okul-kirtasiye', name: 'Okul & Kırtasiye', slug: slugify('Okul & Kırtasiye') },
            { id: 'ofis-teknolojileri', name: 'Ofis Teknolojileri', slug: slugify('Ofis Teknolojileri') },
            { id: 'fotokopi-kagidi', name: 'Fotokopi Kağıdı', slug: slugify('Fotokopi Kağıdı') },
            { id: 'yazi-tahtasi', name: 'Yazı Tahtası & Pano', slug: slugify('Yazı Tahtası & Pano') },
            { id: 'masa-ustu-gerecler', name: 'Masa Üstü Gereçleri', slug: slugify('Masa Üstü Gereçleri') },
            { id: 'sanatsal-malzeme', name: 'Sanatsal Boya & Malzeme', slug: slugify('Sanatsal Boya & Malzeme') },
        ]
    },
    {
        id: 'spor-outdoor',
        name: 'Spor & Outdoor',
        slug: slugify('Spor & Outdoor'),
        subcategories: [
            { id: 'bisiklet', name: 'Bisiklet', slug: 'bisiklet' },
            { id: 'fitness', name: 'Fitness Sporları', slug: slugify('Fitness Sporları') },
            { id: 'kis-sporlari', name: 'Kış Sporları', slug: slugify('Kış Sporları') },
            { id: 'su-sporlari', name: 'Su Sporları', slug: slugify('Su Sporları') },
            { id: 'doga-sporlari', name: 'Doğa Sporları', slug: slugify('Doğa Sporları') },
            { id: 'takim-sporlari', name: 'Takım Sporları', slug: slugify('Takım Sporları') },
            { id: 'raket-sporlari', name: 'Raket Sporları', slug: slugify('Raket Sporları') },
            { id: 'salon-oyunlari', name: 'Salon Oyunları', slug: slugify('Salon Oyunları') },
        ]
    },
    {
        id: 'deniz-araclari',
        name: 'Deniz Araçları',
        slug: slugify('Deniz Araçları'),
        subcategories: [
            { id: 'tekne', name: 'Tekne', slug: 'tekne' },
            { id: 'motoryat', name: 'Motoryat', slug: 'motoryat' },
            { id: 'yelkenli', name: 'Yelkenli', slug: 'yelkenli' },
            { id: 'katamaran', name: 'Katamaran', slug: 'katamaran' },
            { id: 'surat-teknesi', name: 'Sürat Teknesi', slug: slugify('Sürat Teknesi') },
            { id: 'bot', name: 'Bot', slug: 'bot' },
            { id: 'jet-ski', name: 'Jet Ski', slug: slugify('Jet Ski') },
            { id: 'sandal', name: 'Sandal', slug: 'sandal' },
            { id: 'gezi-teknesi', name: 'Gezi Teknesi', slug: slugify('Gezi Teknesi') },
            { id: 'tumunu-gor-deniz', name: 'Tümünü Gör', slug: slugify('Deniz Araçları') },
        ]
    },
    {
        id: 'yapi-market-bahce',
        name: 'Yapı Market & Bahçe',
        slug: slugify('Yapı Market & Bahçe'),
        subcategories: [
            { id: 'el-aletleri', name: 'El Aletleri', slug: slugify('El Aletleri') },
            { id: 'hirdavat', name: 'Hırdavat', slug: 'hirdavat' },
            { id: 'banyo-yapi', name: 'Banyo Yapı Malzemeleri', slug: slugify('Banyo Yapı Malzemeleri') },
            { id: 'elektrik-tesisat', name: 'Elektrik & Tesisat Malzemeleri', slug: slugify('Elektrik & Tesisat Malzemeleri') },
            { id: 'guvenlik-urunleri', name: 'Güvenlik Ürünleri', slug: slugify('Güvenlik Ürünleri') },
            { id: 'su-aritma', name: 'Su Arıtma ve Sulama', slug: slugify('Su Arıtma ve Sulama') },
            { id: 'jenerator', name: 'Jeneratör', slug: 'jenerator' },
            { id: 'mangal', name: 'Mangal & Barbekü', slug: slugify('Mangal & Barbekü') },
            { id: 'bahce-makinesi', name: 'Bahçe Makinesi', slug: slugify('Bahçe Makinesi') },
            { id: 'bahce-dekorasyonu', name: 'Bahçe Dekorasyonu', slug: slugify('Bahçe Dekorasyonu') },
            { id: 'cicek-bakimi', name: 'Çiçek Bakımı & Bitki Yetiştirme', slug: slugify('Çiçek Bakımı & Bitki Yetiştirme') },
        ]
    },
    {
        id: 'evcil-hayvan',
        name: 'Evcil Hayvan',
        slug: slugify('Evcil Hayvan'),
        subcategories: [
            { id: 'kopek-urunleri', name: 'Köpek Ürünleri', slug: slugify('Köpek Ürünleri') },
            { id: 'kedi-urunleri', name: 'Kedi Ürünleri', slug: slugify('Kedi Ürünleri') },
            { id: 'balik-urunleri', name: 'Balık Ürünleri', slug: slugify('Balık Ürünleri') },
            { id: 'kus-urunleri', name: 'Kuş Ürünleri', slug: slugify('Kuş Ürünleri') },
            { id: 'diger-evcil', name: 'Diğer Evcil Hayvan Ürünleri', slug: slugify('Diğer Evcil Hayvan Ürünleri') },
        ]
    },
    {
        id: 'antika',
        name: 'Antika',
        slug: 'antika',
        subcategories: [
            { id: 'antika-mobilya', name: 'Mobilya', slug: slugify('Antika Mobilya') },
            { id: 'antika-dekorasyon', name: 'Dekorasyon Ürünleri', slug: slugify('Antika Dekorasyon') },
            { id: 'antika-makine', name: 'Makine', slug: slugify('Antika Makine') },
            { id: 'antika-aydinlatma', name: 'Aydınlatma', slug: slugify('Antika Aydınlatma') },
            { id: 'antika-enstruman', name: 'Enstrüman', slug: slugify('Antika Enstrüman') },
            { id: 'antika-tekstil', name: 'Tekstil Ürünleri', slug: slugify('Antika Tekstil') },
        ]
    }
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return ALL_CATEGORIES.find(c => c.slug === slug);
}

export function getCategoryName(slug: string): string {
    const cat = ALL_CATEGORIES.find(c => c.slug === slug);
    return cat ? cat.name : '';
}

export function findCategoryBySlug(slug: string): { category: Category | SubCategory, parent?: Category } | null {
    for (const cat of ALL_CATEGORIES) {
        if (cat.slug === slug) return { category: cat };
        if (cat.subcategories) {
            const sub = cat.subcategories.find(s => s.slug === slug);
            if (sub) return { category: sub, parent: cat };
        }
    }
    return null;
}
