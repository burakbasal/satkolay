export const SELL_DATA = {
    categories: {
        telefon: {
            label: "Telefon",
            placeholder: "Örn: iPhone 13 Pro Max 128GB - Hatasız",
            brands: [
                { name: "Apple", models: ["iPhone 15 Pro Max", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11"] },
                { name: "Samsung", models: ["Galaxy S24 Ultra", "Galaxy S23", "Galaxy A54", "Galaxy Z Fold"] },
                { name: "Xiaomi", models: ["Redmi Note 12", "13 Ultra", "Poco X5"] }
            ],
            features: [
                { label: "Dahili Hafıza", key: "storage", type: "select", options: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"] },
                { label: "RAM", key: "ram", type: "select", options: ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"] },
                { label: "Renk", key: "color", type: "input" }
            ]
        },
        araba: {
            label: "Araba",
            placeholder: "Örn: Renault Clio 2018 Touch Paket - Boyasız",
            brands: [
                { name: "Renault", models: ["Clio", "Megane", "Symbol", "Taliant"] },
                { name: "Volkswagen", models: ["Passat", "Golf", "Polo", "Tiguan"] },
                { name: "Fiat", models: ["Egea", "Doblo", "Fiorino"] },
                { name: "Ford", models: ["Focus", "Fiesta", "Courier"] },
                { name: "BMW", models: ["3 Serisi", "5 Serisi", "1 Serisi"] }
            ],
            features: [
                { label: "Yıl", key: "year", type: "select", options: Array.from({ length: 30 }, (_, i) => (2024 - i).toString()) },
                { label: "KM", key: "km", type: "input" },
                { label: "Vites Tipi", key: "gear", type: "select", options: ["Manuel", "Otomatik", "Yarı Otomatik"] },
                { label: "Yakıt Tipi", key: "fuel", type: "select", options: ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"] }
            ]
        },
        elektronik: {
            label: "Elektronik",
            placeholder: "Örn: MacBook Air M1 8GB - Garantili",
            brands: [], // Genel kategori
            features: [
                { label: "Durumu", key: "condition", type: "select", options: ["Yeni", "Yeni Gibi", "İyi", "Makul"] }
            ]
        }
        // Diğer kategoriler için varsayılan placeholder
    }
};
