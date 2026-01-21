import Link from "next/link";
import {IconArrowRight, IconTrain} from "@tabler/icons-react";
import {getMonitorsForStop, getStopByDiva} from "@/app/lib/utils";
import linesData from "@/data/lines.json";

interface StopProps {
    params: Promise<{ id: string }>;
}

export default async function StopDetail({params}: StopProps) {
    const {id} = await params;
    const diva = decodeURIComponent(id);
    const stop = getStopByDiva(diva);
    const stopName = stop.stop.name;
    const monitors = await getMonitorsForStop(diva) // prefetch for monitor site

    if (!stop || !stopName) {
        return (
            <div className="flex flex-col h-full items-center justify-center p-10">
                <h1 className="text-xl font-bold text-white">
                    Haltestelle nicht gefunden
                </h1>
                <p className="text-slate-500">ID: {diva}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <header className="p-6 pb-4 flex-none border-b border-slate-100 dark:border-[#2e2e2e]">
                <h1 className="text-3xl font-extrabold tracking-tight uppercase">
                    {stopName}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Choose a line & direction
                </p>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-8">
                {stop.lines.map((line) => {
                    const lineInfo = (linesData as any[]).find(
                        (l) => String(l.lineID) === String(line.lineID)
                    );

                    const validDirections = line.directions.filter((dir) => {
                        const details = lineInfo?.directions?.find(
                            (d: any) => String(d.num) === String(dir.dir)
                        );
                        return details && details.endstop;
                    });

                    if (validDirections.length === 0) return null;

                    return (
                        <div key={line.lineID} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 px-1">
                                <IconTrain
                                    size={18}
                                    className="text-yellow-400 dark:text-yellow-300"
                                />
                                <span className="text-sm font-bold uppercase tracking-widest">
                                    Linie {line.lineText || lineInfo?.lineText || "Bahn"}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {validDirections.map((dir) => {
                                    const details = lineInfo!.directions.find(
                                        (d: any) =>
                                            String(d.num) === String(dir.dir)
                                    );

                                    return (
                                        <Link
                                            key={`${line.lineID}-${dir.dir}`}
                                            href={`/monitor/${stop.diva}?line=${line.lineText}&lineId=${line.lineID}&dir=${dir.dir}`}
                                            className="min-w-[150px] flex-1 sm:flex-none flex flex-col p-5 bg-slate-50 dark:bg-[#1e1e1e] rounded-2xl hover:bg-slate-100 dark:hover:bg-[#252525] transition-all duration-200 active:scale-[0.96] group"
                                            data-umami-event={"Monitor stop"}
                                            data-umami-event-stop={`${stopName}/${line.lineText}/${details.endstop}`}>
                                            <span
                                                className="text-[10px] text-yellow-400 dark:text-yellow-300 font-black uppercase tracking-widest mb-2 group-hover:text-yellow-300 dark:group-hover:text-yellow-200">
                                                Richtung
                                            </span>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="font-bold text-lg leading-tight">
                                                    {details.endstop}
                                                </span>
                                                <IconArrowRight
                                                    size={20}
                                                    className="text-slate-400 dark:text-slate-500 group-hover:text-yellow-400 dark:group-hover:text-yellow-300 group-hover:translate-x-1 transition-all"
                                                />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
