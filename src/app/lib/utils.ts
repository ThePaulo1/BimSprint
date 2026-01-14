import stops from "@/data/stops.json";
import {Stop} from "@/types/Stop";
import Flatbush from 'flatbush';
import {around} from 'geoflatbush';
import {Line} from "@/types/Line";
import {Direction} from "@/types/Direction";

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