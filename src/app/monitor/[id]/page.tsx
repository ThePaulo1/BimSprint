import Metrics from "../../../components/Metrics";
import {getMonitorByDivaLineDirection, getStopLineByDivaLineDirection} from "@/app/lib/utils";

interface MonitorProps {
    params: Promise<{ id: string; }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Monitor({params, searchParams}: MonitorProps) {
    const {line, lineId, dir} = await searchParams
    const {id} = await params
    const monitor = await getMonitorByDivaLineDirection(id, String(line), String(dir))
    const stopLine = getStopLineByDivaLineDirection(id, String(lineId), String(dir))
    const monitors = monitor?.lines[0]
        .departures
        .departure
        .map(departure => new Date(departure.departureTime.timeReal).getTime()) ?? []

    return (
        <>
            <Metrics
                name={monitor?.locationStop.properties.title ?? "Haltestelle"}
                lineText={monitor?.lines[0].name ?? "Linie"}
                direction={monitor?.lines[0].towards ?? "Endstation"}
                location={stopLine?.location}
                monitors={monitors}
            />
        </>
    )
}