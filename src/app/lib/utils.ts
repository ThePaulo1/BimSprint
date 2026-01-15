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

export type Preferences = {
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

    const favs = localStorage.getItem('bimsprint_favorites');
    return favs ? JSON.parse(favs) : [];
};

export const toggleFavorite = (diva: string): string[] => {
    const favs = getFavorites();
    const isFav = favs.includes(diva);

    const newFavs = isFav
        ? favs.filter(id => id !== diva)
        : [...favs, diva];

    localStorage.setItem('bimsprint_favorites', JSON.stringify(newFavs));
    return newFavs;
};


export const savePreferences = () => {
    const favourites = JSON.parse(localStorage.getItem('bimsprint_favorites') || "[]");
    const colors = JSON.parse(localStorage.getItem('bimsprint_colors') || JSON.stringify(DEFAULT_COLORS));

    const data: Preferences = { favourites, colors };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bimsprint_settings.json`;
    link.click();
    URL.revokeObjectURL(url);
}

export const readPreferences = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const preferences = JSON.parse(e.target?.result as string) as Preferences;
                if (preferences.favourites) localStorage.setItem('bimsprint_favorites', JSON.stringify(preferences.favourites));
                if (preferences.colors) localStorage.setItem('bimsprint_colors', JSON.stringify(preferences.colors));
                resolve(true);
            } catch (err) {
                console.error("Fehler beim Lesen der Datei", err);
                resolve(false);
            }
        };
        reader.readAsText(file);
    });
};