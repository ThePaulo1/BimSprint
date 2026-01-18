import stops from "@/data/stops.json";
import {Stop} from "@/types/Stop";
import Flatbush from 'flatbush';
import {around} from 'geoflatbush';
import {Direction} from "@/types/Direction";
import {ApiResponse} from "@/app/lib/wl-types/realtime";

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

export const getStopLineByDivaLineDirection = (diva: string, lineId: string, direction: string) =>
    getStopByDiva(diva).lines
        .find(line => line.lineID === lineId)
        ?.directions
        .find(line => line.dir === direction) as Direction

export const getMonitorsForStop = async (diva: string) =>
    await fetch("https://www.wienerlinien.at/ogd_realtime/monitor?diva=" + diva,
        {
            next: {revalidate: 180},
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "BimSprint (first public transport fortune teller)",
            },
        })
        .then(res => res.json())
        .then((data: ApiResponse) => data.data?.monitors ?? [])

export const getMonitorByDivaLineDirection = async (diva: string, lineId: string, direction: string) =>
    await getMonitorsForStop(diva)
        .then(monitors =>
            monitors.find(monitor =>
                monitor.lines.some(line => line.name === lineId && line.direction === direction)
            )
        )