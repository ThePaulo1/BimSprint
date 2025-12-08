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

        // Prüfen, ob wir das GeoJSON-Format haben
        const features = data.features || [];

        return features.map((f: any) => ({
            name: f.properties.BEZEICHNUNG || "Unbekannt",
            id: f.properties.WL_NUMMER?.toString() || "",
            coords: [f.geometry.coordinates[1], f.geometry.coordinates[0]] as [number, number]
        })).filter((stop: Stop) => stop.id && stop.id !== "0");
    } catch (e) {
        console.error("Fehler beim Mapping:", e);
        return [];
    }
}

export function calculateDist(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function getNearbyStops(lat: number, lon: number): Promise<Stop[]> {
    const allStops = await getAllStops();
    return allStops
        .map(stop => ({
            ...stop,
            distance: calculateDist(lat, lon, stop.coords[0], stop.coords[1])
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 10);
}

export async function getLinesForStop(divaId: string): Promise<LineDirection[]> {
    try {
        const response = await fetch(`/api/monitor?diva=${divaId}`, { cache: 'no-store' });
        const json = await response.json();
        if (!json.data?.monitors) return [];

        const results: LineDirection[] = [];
        json.data.monitors.forEach((m: any) => {
            m.lines.forEach((l: any) => {
                results.push({
                    line: l.name,
                    towards: l.towards,
                    rbl: m.rbl.toString(),
                    type: l.type
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
        const response = await fetch(`/api/monitor?rbl=${rbl}`, { cache: 'no-store' });
        const json = await response.json();
        return json.data.monitors[0].lines[0].departures.departure[0].departureTime.countdown;
    } catch (error) {
        return 0;
    }
}