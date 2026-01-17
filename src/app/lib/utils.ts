import stops from "@/data/stops.json";
import {Stop} from "@/types/Stop";
import Flatbush from 'flatbush';
import {around} from 'geoflatbush';
import {Line} from "@/types/Line";
import {Direction} from "@/types/Direction";

const DEFAULT_COLORS = {
    red: "#ef4444",
    yellow: "#eab308",
    green: "#22c55e"
};

export type Preference = {
    favourites: string[];
    colors: {
        red: string;
        yellow: string;
        green: string;
    };
};

const index = new Flatbush(stops.length);

stops.forEach((stop) => {
    const {lon, lat} = stop.stop.location;
    index.add(lon, lat, lon, lat);
})
index.finish()

export const getNearestStops = (lon: number, lat: number, amount = 10): Stop[] => {
    const nearestIndices: number[] = around(index, lon, lat, amount);
    return nearestIndices.map(idx => stops[idx]) as Stop[];
}

export const getStopByDiva = (diva: string) =>
    (stops.find(stop => stop.diva === diva) as Stop)

export const getStopLineByDiva = (diva: string, lineId: string, direction: string) =>
    (getStopByDiva(diva).lines.find(line => line.lineID === lineId)?.directions.find(line => line.num === direction) as Direction)

export const getFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];

    const preferences = localStorage.getItem('bimsprint_preferences');
    return preferences ? JSON.parse(preferences).favourites : [];
};

export const getPreferences = (): Preference => {
    if (typeof window === 'undefined')
        return { favourites: [], colors: DEFAULT_COLORS };

    const raw = localStorage.getItem('bimsprint_preferences');
    return JSON.parse(raw || 'null') || { favourites: [], colors: DEFAULT_COLORS };
};

export const toggleFavorite = (diva: string): string[] => {
    const raw = localStorage.getItem('bimsprint_preferences');
    const preferences: Preference = JSON.parse(raw || 'null') || { favourites: [], colors: DEFAULT_COLORS};

    const newFavs = preferences.favourites.includes(diva)
        ? preferences.favourites.filter(id => id !== diva)
        : [...preferences.favourites, diva];

    localStorage.setItem('bimsprint_preferences', JSON.stringify({ ...preferences, favourites: newFavs }));

    return newFavs;
};


export const updateSignalColor = (key: 'red' | 'yellow' | 'green', newHex: string) => {
    const raw = localStorage.getItem('bimsprint_preferences');
    const preferences = JSON.parse(raw || 'null') || { favourites: [], colors: DEFAULT_COLORS };

    preferences.colors[key] = newHex;
    localStorage.setItem('bimsprint_preferences', JSON.stringify(preferences));
};

export const savePreferences = () => {
    const data = localStorage.getItem('bimsprint_preferences') || "";
    const blob = new Blob([data], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    link.download = "preferences.json";
    link.click();
};

export const readPreferences = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            localStorage.setItem('bimsprint_preferences', content);

            resolve(true);
        };
        reader.readAsText(file);
    });
};