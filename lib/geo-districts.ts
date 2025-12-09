export type DistrictGeo = {
    city: string;
    district: string;
    lat: number;
    lng: number;
};

// Sample data - User will populate this with the full list from github: melihkorkmaz/il-ilce-mahalle-geolocation-rest-api
export const DISTRICT_LOCATIONS: DistrictGeo[] = [
    // İstanbul - Anadolu
    { city: "İstanbul", district: "Kadıköy", lat: 40.991, lng: 29.02 },
    { city: "İstanbul", district: "Üsküdar", lat: 41.021, lng: 29.016 },
    { city: "İstanbul", district: "Ataşehir", lat: 40.984, lng: 29.106 },
    { city: "İstanbul", district: "Ümraniye", lat: 41.022, lng: 29.088 },
    { city: "İstanbul", district: "Maltepe", lat: 40.925, lng: 29.13 },
    { city: "İstanbul", district: "Kartal", lat: 40.892, lng: 29.192 },
    { city: "İstanbul", district: "Pendik", lat: 40.877, lng: 29.233 },
    { city: "İstanbul", district: "Tuzla", lat: 40.816, lng: 29.303 },
    { city: "İstanbul", district: "Beykoz", lat: 41.119, lng: 29.086 },
    { city: "İstanbul", district: "Sancaktepe", lat: 40.99, lng: 29.22 },
    { city: "İstanbul", district: "Çekmeköy", lat: 41.035, lng: 29.172 },
    { city: "İstanbul", district: "Sultanbeyli", lat: 40.967, lng: 29.26 },
    { city: "İstanbul", district: "Şile", lat: 41.176, lng: 29.613 },

    // İstanbul - Avrupa
    { city: "İstanbul", district: "Beşiktaş", lat: 41.044, lng: 29.002 },
    { city: "İstanbul", district: "Şişli", lat: 41.056, lng: 28.985 },
    { city: "İstanbul", district: "Beyoğlu", lat: 41.028, lng: 28.974 },
    { city: "İstanbul", district: "Fatih", lat: 41.011, lng: 28.935 },
    { city: "İstanbul", district: "Zeytinburnu", lat: 40.988, lng: 28.904 },
    { city: "İstanbul", district: "Bakırköy", lat: 40.98, lng: 28.872 },
    { city: "İstanbul", district: "Bahçelievler", lat: 41.002, lng: 28.841 },
    { city: "İstanbul", district: "Güngören", lat: 41.021, lng: 28.872 },
    { city: "İstanbul", district: "Bağcılar", lat: 41.034, lng: 28.857 },
    { city: "İstanbul", district: "Küçükçekmece", lat: 41.001, lng: 28.78 },
    { city: "İstanbul", district: "Avcılar", lat: 40.979, lng: 28.723 },
    { city: "İstanbul", district: "Beylikdüzü", lat: 41.003, lng: 28.636 },
    { city: "İstanbul", district: "Esenyurt", lat: 41.034, lng: 28.68 },
    { city: "İstanbul", district: "Sarıyer", lat: 41.168, lng: 29.055 },
    { city: "İstanbul", district: "Kağıthane", lat: 41.082, lng: 28.973 },
    { city: "İstanbul", district: "Eyüpsultan", lat: 41.047, lng: 28.929 },
    { city: "İstanbul", district: "Başakşehir", lat: 41.097, lng: 28.807 },

    // Ankara
    { city: "Ankara", district: "Çankaya", lat: 39.921, lng: 32.853 },
    { city: "Ankara", district: "Keçiören", lat: 40.003, lng: 32.864 },
    { city: "Ankara", district: "Yenimahalle", lat: 39.97, lng: 32.793 },
    { city: "Ankara", district: "Mamak", lat: 39.943, lng: 32.923 },
    { city: "Ankara", district: "Etimesgut", lat: 39.947, lng: 32.666 },
    { city: "Ankara", district: "Sincan", lat: 39.962, lng: 32.579 },

    // İzmir
    { city: "İzmir", district: "Konak", lat: 38.419, lng: 27.128 },
    { city: "İzmir", district: "Karşıyaka", lat: 38.461, lng: 27.112 },
    { city: "İzmir", district: "Bornova", lat: 38.466, lng: 27.218 },
    { city: "İzmir", district: "Buca", lat: 38.384, lng: 27.168 },
    { city: "İzmir", district: "Gaziemir", lat: 38.324, lng: 27.135 },
];
