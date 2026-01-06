import Link from "next/link";
import {IconArrowRight, IconTrain} from "@tabler/icons-react";
import {getStopNameByDiva} from "@/app/lib/utils";

const stopData: Record<string, string[]> = {
    "Stephansplatz": ["U1 Oberlaa", "U1 Leopoldau", "U3 Ottakring", "U3 Simmering"],
    "Börse": ["1 Prater Hauptallee", "1 Stefan-Fadinger-Platz", "71 Kaiserebersdorf", "D Nußdorf"],
    "Lassallestraße": ["80A Praterstern", "80A Neu Marx"],
    "Hauptbahnhof S U": ["U1 Oberlaa", "U1 Leopoldau", "18 Burggasse-Stadthalle", "18 Irgendwo-nirgendwo", "D Absberggasse"],
    "Julius-Raab-Platz": ["1 Prater Hauptallee", "2 Dornbach", "2 Friedrich-Engels-Platz"],
    "Stubentor U, Dr.-Karl-Lueger-Platz": ["U3 Ottakring", "U3 Simmering", "2 Dornbach"],
    "Weihburggasse": ["2 Dornbach", "2 Friedrich-Engels-Platz"],
    "Schwarzenbergplatz": ["2 Dornbach", "71 Kaiserebersdorf", "D Nußdorf"],
    "Oper, Karlsplatz U": ["U1 Oberlaa", "U4 Heiligenstadt", "1 Stefan-Fadinger-Platz", "62 Lainz"],
    "Burgring": ["1 Prater Hauptallee", "2 Dornbach", "71 Kaiserebersdorf", "D Nußdorf", "U1 Oberlaa", "U1 Leopoldau", "U3 Ottakring", "U3 Simmering"]
};

interface StopProps {
    params: Promise<{ id: string }>;
}

export default async function StopDetail({params}: StopProps) {
    const {id} = await params;
    const decodedId = getStopNameByDiva(decodeURIComponent(id));
    const directions = stopData[decodedId] || [];

    const grouped: Record<string, string[]> = {};
    directions.forEach(d => {
        const lineName = d.split(" ")[0];
        if (!grouped[lineName]) grouped[lineName] = [];
        grouped[lineName].push(d);
    });

    return (
        <div className="flex flex-col h-full">
            <header className="p-6 pb-4 flex-none border-b border-slate-100 dark:border-[#2e2e2e]">
                <h1 className="text-3xl font-extrabold tracking-tight uppercase">
                    {decodedId}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Wähle eine Linie & Richtung</p>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-8">
                {Object.entries(grouped).map(([lineName, allDirections]) => (
                    <div key={lineName} className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 px-1">
                            <IconTrain size={18} className="text-yellow-400 dark:text-yellow-300"/>
                            <span
                                className="text-sm font-bold uppercase tracking-widest">
                                Linie {lineName}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {allDirections.map((direction) => (
                                <Link
                                    key={direction}
                                    href={`/monitor/${encodeURIComponent(direction)}`}
                                    className="min-w-[150px] flex-1 sm:flex-none flex flex-col p-5 bg-slate-50 dark:bg-[#1e1e1e] rounded-2xl hover:bg-slate-100 dark:hover:bg-[#252525] transition-all duration-200 active:scale-[0.96] group"
                                >
                  <span
                      className="text-[10px] text-yellow-400 dark:text-yellow-300 font-black uppercase tracking-widest mb-2 group-hover:text-yellow-300 dark:group-hover:text-yellow-200">
                    Richtung
                  </span>
                                    <div className="flex items-center justify-between gap-4">
                            <span className="font-bold text-lg leading-tight">
                              {direction.replace(lineName, "").trim()}
                            </span>
                                        <IconArrowRight
                                            size={20}
                                            className="text-slate-400 dark:text-slate-500 group-hover:text-yellow-400 dark:group-hover:text-yellow-300 group-hover:translate-x-1 transition-all"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}