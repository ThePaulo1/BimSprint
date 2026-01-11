import stops from "@/data/stops.json";
import distance from "@turf/distance";
import {Stop} from "@/types/Stop";

export const getNearestStops = (user: [number, number], amount = 10): Stop[] =>
    stops
        .map((stop) => ({
            stop,
            distance: distance(user as [number, number], [stop.stop.location.lon, stop.stop.location.lat], {units: "meters"})
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, amount)
        .map((wrapper) => wrapper.stop) as Stop[]


export const getStopNameByDiva = (diva: string) =>
    (stops.find(stop => stop.diva === diva) as Stop).stop?.name ?? "Unbekannte Haltestelle"


export const getFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];
    const favs = localStorage.getItem('bimsprint_favorites');
    return favs ? JSON.parse(favs) : [];
};


export const toggleFavorite = (diva: string): string[] => {
    const favs = getFavorites();
    const divaStr = String(diva);
    const isFav = favs.includes(divaStr);

    const newFavs = isFav
        ? favs.filter(id => id !== divaStr)
        : [...favs, divaStr];

    localStorage.setItem('bimsprint_favorites', JSON.stringify(newFavs));
    return newFavs;
};