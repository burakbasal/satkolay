// Bu dosya URL'den gelen bozuk karakterleri düzeltir.
// Örn: url'de "eskisehir" gelirse bunu "Eskişehir" yapar.

const CITY_MAP: Record<string, string> = {
    "istanbul": "İstanbul", "ıstanbul": "İstanbul",
    "izmir": "İzmir",
    "eskisehir": "Eskişehir",
    "sanliurfa": "Şanlıurfa",
    "diyarbakir": "Diyarbakır",
    "agri": "Ağrı",
    "kahramanmaras": "Kahramanmaraş",
    "canakkale": "Çanakkale",
    "corum": "Çorum",
    "duzce": "Düzce",
    "gumushane": "Gümüşhane",
    "igdir": "Iğdır",
    "kirikkale": "Kırıkkale",
    "kirklareli": "Kırklareli",
    "kirsehir": "Kırşehir",
    "kutahya": "Kütahya",
    "mugla": "Muğla",
    "mus": "Muş",
    "nevsehir": "Nevşehir",
    "nigde": "Niğde",
    "sirnak": "Şırnak",
    "tekirdag": "Tekirdağ",
    "usak": "Uşak",
    "zonguldak": "Zonguldak",
    "cankiri": "Çankırı",
    "balikesir": "Balıkesir",
    "elazig": "Elazığ",
    "bingol": "Bingöl"
    // Buraya diğer özel karakterli illeri ekleyebilirsiniz.
};

export function normalizeCityInput(input: string | undefined): string | undefined {
    if (!input) return undefined;

    // 1. URL'deki %20 vb karakterleri çöz
    const decoded = decodeURIComponent(input);

    // 2. Hepsini küçük harfe çevir
    const lower = decoded.toLocaleLowerCase('tr'); // Türkçe uyumlu küçük harf

    // 3. Haritada varsa doğrusunu al (eskisehir -> Eskişehir)
    // Yoksa baş harfini büyüt (ankara -> Ankara)
    return CITY_MAP[decoded.toLowerCase()] || CITY_MAP[lower] || (decoded.charAt(0).toUpperCase() + decoded.slice(1));
}
