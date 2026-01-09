"use client"

import Link from "next/link";
import {IconChevronRight, IconMapPin} from "@tabler/icons-react";
import {useLocationStore} from "@/store/userLocationStore";
import {useEffect, useMemo, useState} from "react";
import {getNearestStops} from "@/app/lib/utils";
import {useShallow} from "zustand/react/shallow";

export default function Stops() {
    const { lat, lon } = useLocationStore(useShallow((s) => ({ lat: s.lat, lon: s.lon })));
    const [isMounted, setIsMounted] = useState(false);

    // Verhindert den Hydration-Error:
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const stops = useMemo(() => {
        if (!lat || !lon) return [];
        return getNearestStops([lon, lat], 10);
    }, [lat, lon]);

    // Wenn wir noch auf dem Server sind oder GPS fehlt
    if (!isMounted || !lat || !lon) {
        return (
            <div className="flex flex-col h-full bg-[#121212] items-center justify-center">
                <p className="text-slate-400 animate-pulse">Suche Standort...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <header className="p-6 pb-4 flex-none border-b border-slate-100 dark:border-[#2e2e2e]">
                <h1 className="text-3xl font-extrabold tracking-tight">Stationen</h1>
                <p className="text-slate-500 dark:text-slate-400">Wähle eine Haltestelle</p>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                {stops.map((stop) => (
                    <Link
                        key={stop.diva}
                        href={`/stop/${encodeURIComponent(stop.diva)}`}
                        className="flex group items-center justify-between p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-2xl hover:bg-slate-100 dark:hover:bg-[#252525] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <IconMapPin size={20} className="text-yellow-400 dark:text-yellow-300"/>
                            <span className="font-semibold">{stop.stop.name}</span>
                        </div>
                        <IconChevronRight size={20}
                                          className="text-slate-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"/>
                    </Link>
                ))}
            </div>
        </div>
    );
}