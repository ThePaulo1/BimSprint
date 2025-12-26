export interface LineDirection {
    line: string;
    towards: string;
    rbl: string;
    type: string;
}

export interface Stop {
    name: string;
    id: string;
    coords: [number, number];
    distance?: number;
}

export async function getAllStops(): Promise<Stop[]> {
    try {
        const response = await fetch('/api/stops');
        const data = await response.json();

        // Wir greifen auf das 'features' Array aus deinem JSON zu
        const features = data.features || [];

        return features.map((f: any) => ({
            name: f.properties.BEZEICHNUNG, // "Absberggasse"
            id: f.properties.WL_NUMMER.toString(), // "1"
            // Umrechnung: f.geometry.coordinates[1] ist Breitengrad (48.17...)
            coords: [f.geometry.coordinates[1], f.geometry.coordinates[0]] as [number, number]
        }));
    } catch (e) {
        console.error("Mapping Fehler:", e);
        return [];
    }
}

// Hilfsfunktion für die Distanz (Haversine Formel)
export function calculateDist(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius der Erde in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function getNearbyStops(userLat: number, userLon: number) {
    const response = await fetch('/api/stops'); // Dein GeoJSON Endpunkt
    const data = await response.json();

    return data.features
        .map((f: any) => ({
            name: f.properties.BEZEICHNUNG,
            id: f.properties.WL_NUMMER,
            lat: f.geometry.coordinates[1], // GeoJSON hat [lon, lat]
            lon: f.geometry.coordinates[0],
            dist: calculateDist(userLat, userLon, f.geometry.coordinates[1], f.geometry.coordinates[0])
        }))
        .sort((a: any, b: any) => a.dist - b.dist) // Sortieren nach Nähe
        .slice(0, 10); // Nur die ersten 10
}

export async function getLinesForStop(divaId: string): Promise<LineDirection[]> {
    try {
        const response = await fetch(`/api/monitor?diva=${divaId}`);
        const json = await response.json();
        if (!json.data?.monitors) return [];

        const results: LineDirection[] = [];
        json.data.monitors.forEach((m: any) => {
            m.lines.forEach((l: any) => {
                results.push({
                    line: l.name, towards: l.towards, rbl: m.rbl.toString(), type: l.type
                });
            });
        });
        return results;
    } catch (error) {
        return [];
    }
}

export async function getCountdown(rbl: string): Promise<number> {
    try {
        const response = await fetch(`/api/monitor?rbl=${rbl}`);
        const json = await response.json();
        return json.data.monitors[0].lines[0].departures.departure[0].departureTime.countdown;
    } catch (error) {
        return 0;
    }
}