import { NextResponse } from 'next/server';

export async function GET() {
    const URL = 'https://digitales.wien.gv.at/data/haltestellen-oeffentlicher-verkehr-geojson.json';
    try {
        const res = await fetch(URL, { next: { revalidate: 86400 } });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        // Fallback: Wenn der Proxy scheitert, senden wir eine Minimal-Struktur
        return NextResponse.json({
            features: [
                { properties: { BEZEICHNUNG: "Stephansplatz", WL_NUMMER: "60200104" }, geometry: { coordinates: [16.3725, 48.2086] } },
                { properties: { BEZEICHNUNG: "Wien Hauptbahnhof", WL_NUMMER: "60200639" }, geometry: { coordinates: [16.3762, 48.1851] } }
            ]
        });
    }
}