export const BANNED_WORDS = [
    // Küfür / Hakaret
    "amk", "aq", "sik", "yarrak", "orospu", "piç", "göt", "kahpe", "yavşak",
    "siktir", "sikiş", "amcık", "yarram", "sikik", "oç", "ananı", "bacını",
    "ibne", "puşt", "kavat",
    "kötü kelime1", "kötü kelime2", "dolandırıcı",

    // +18 / Adult
    "porno", "sex", "seks", "eskort", "escort", "travesti", "jigolo", "erotik",
    "nude", "çıplak", "adult", "yetiskin", "swinger", "masaj", "cinsel",

    // Yasa Dışı / Bahis / Kumar
    "bahis", "iddaa", "casino", "rulet", "poker", "slot", "bet", "kumar",
    "yasadışı bahis", "kaçak bahis", "canlı bahis",

    // Silah
    "silah", "tabanca", "tüfek", "mermi", "keleş", "glock", "pompalı",
    "kurusıkı", "bıçak", "kama", "sustalı", "mavzer", "silah satışı",

    // Uyuşturucu
    "uyuşturucu", "esrar", "eroin", "kokain", "hap", "bonzai", "met", "extacy",
    "kenevir", "marijuana", "torbacı",

    // Diğer Yasaklılar
    "kacak", "yasakli"
];

export function checkContent(text: string): { valid: boolean; reason?: string } {
    if (!text) return { valid: true };

    const lowerText = text.toLowerCase();

    for (const word of BANNED_WORDS) {
        if (lowerText.includes(word.toLowerCase())) {
            return {
                valid: false,
                reason: `Yasaklı içerik tespit edildi: ${word}`
            };
        }
    }

    return { valid: true };
}

// Geriye dönük uyumluluk için (Eğer başka yerlerde kullanılıyorsa)
export const checkText = checkContent;

// TensorFlow entegrasyonu buraya gelecek
export async function checkImage(file: File): Promise<boolean> {
    // Şimdilik her zaman true, kütüphane eklenince güncellenecek
    return true;
}
