import Link from "next/link";
import {IconArrowRight, IconTrain} from "@tabler/icons-react";
import {getStopNameByDiva} from "@/app/lib/utils";
import stopsData from "@/data/stops.json";
import linesData from "@/data/lines.json";

interface StopProps {
    params: Promise<{ id: string }>;
}

export default async function StopDetail({params}: StopProps) {
    const {id} = await params;
    const divaId = decodeURIComponent(id);

    // 1. Namen für den Header holen
    const stopName = getStopNameByDiva(divaId);

    // 2. EXAKTE Haltestelle aus der JSON suchen
    const currentStop = stopsData.find(s => String(s.diva) === divaId);

    if (!currentStop) {
        return (
            <div className="flex flex-col h-full items-center justify-center p-10">
                <h1 className="text-xl font-bold">Haltestelle nicht gefunden</h1>
                <p className="text-slate-500">ID: {divaId}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e]">
            <header className="p-6 pb-4 flex-none border-b border-[#2e2e2e]">
                <h1 className="text-3xl font-extrabold tracking-tight uppercase text-white">
                    {stopName}
                </h1>
                <p className="text-slate-400">Wähle eine Linie & Richtung</p>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-8">
                {currentStop.lines.map((line) => {
                    // Infos zur Linie (Name etc.) aus lines.json laden
                    const lineInfo = linesData.find(l => l.lineID === line.lineID);

                    return (
                        <div key={line.lineID} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 px-1">
                                <IconTrain size={18} className="text-yellow-400"/>
                                <span className="text-sm font-bold uppercase tracking-widest text-white">
                                    Linie {line.lineText || lineInfo?.lineText || "Bahn"}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {line.directions.map((dir) => {
                                    // Richtung aus lines.json holen
                                    const directionDetails = lineInfo?.directions.find(d => String(d.num) === String(dir.num));
                                    const endstopName = directionDetails?.endstop || `Richtung ${dir.num}`;

                                    return (
                                        <Link
                                            key={`${line.lineID}-${dir.num}`}
                                            href={`/monitor/${currentStop.diva}?line=${line.lineID}&dir=${dir.num}`}
                                            className="min-w-[150px] flex-1 sm:flex-none flex flex-col p-5 bg-[#1e1e1e] rounded-2xl hover:bg-[#252525] transition-all group"
                                        >
                                            <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest mb-2">
                                                Richtung
                                            </span>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="font-bold text-lg leading-tight text-white">
                                                    {endstopName}
                                                </span>
                                                <IconArrowRight
                                                    size={20}
                                                    className="text-slate-500 group-hover:text-yellow-400 transition-all"
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