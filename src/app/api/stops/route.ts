import { NextResponse } from 'next/server';

export async function GET() {
    // Stabile OGD-Schnittstelle der Stadt Wien
    const URL = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:HALTESTELLEWLOGD&srsName=EPSG:4326&outputFormat=json';

    try {
        const res = await fetch(URL, {
            next: { revalidate: 86400 },
            headers: {
                // Simuliert einen echten Browser, damit der Server nicht blockiert
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Wien API antwortet mit Status: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (e) {
        console.error("Fetch Fehler:", e); // Schau in dein Terminal/Konsole!

        return NextResponse.json({
            error: "Originaler Service nicht erreichbar",
            features: [
                { properties: { BEZEICHNUNG: "Stephansplatz (Fallback)", WL_NUMMER: "60200104" }, geometry: { coordinates: [16.3725, 48.2086] } },
                { properties: { BEZEICHNUNG: "Wien Hauptbahnhof (Fallback)", WL_NUMMER: "60200639" }, geometry: { coordinates: [16.3762, 48.1851] } }
            ]
        });
    }
}