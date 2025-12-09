import { DISTRICT_LOCATIONS } from "./geo-districts";

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

function getDistanceInKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLng = degreesToRadians(lng2 - lng1);

    const lat1Rad = degreesToRadians(lat1);
    const lat2Rad = degreesToRadians(lat2);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

export function getDistrictsWithinRadius(
    userLat: number,
    userLng: number,
    radiusKm: number
): string[] {
    const nearbyDistricts: string[] = [];

    for (const location of DISTRICT_LOCATIONS) {
        const distance = getDistanceInKm(
            userLat,
            userLng,
            location.lat,
            location.lng
        );

        if (distance <= radiusKm) {
            // Only trigger unique district names to avoid duplicates if data is dirty, though Set would be better
            if (!nearbyDistricts.includes(location.district)) {
                nearbyDistricts.push(location.district);
            }
        }
    }

    return nearbyDistricts;
}
