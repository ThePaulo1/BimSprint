"use client"

import Link from "next/link";
import {IconChevronRight, IconHeart, IconHeartFilled, IconMapPin} from "@tabler/icons-react";
import {useUserLocationStore} from "@/store/userLocationStore";
import {MouseEvent, useMemo} from "react";
import {getNearestStops} from "@/app/lib/utils";
import {useShallow} from "zustand/react/shallow";
import {useUserPreferencesStore} from "@/store/userPreferencesStore";

export default function Stops() {
    const {lat, lon} = useUserLocationStore(useShallow((s) => ({lat: s.lat, lon: s.lon})));
    const {favourites, setFavourites} = useUserPreferencesStore()

    const handleToggleFav = (e: MouseEvent, diva: string) => {
        e.preventDefault(); // Verhindert Navigation zum Stop
        e.stopPropagation();
        setFavourites(diva);
    };

    const stops = useMemo(() => {
        if (!lat || !lon) return [];

        return getNearestStops(lon, lat)
            .sort((a, b) =>
                Number(favourites.includes(b.diva)) - Number(favourites.includes(a.diva)));
    }, [lat, lon, favourites]);

    if (!lat || !lon) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
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
                {stops.map((stop) => {
                    const isFav = favourites.includes(stop.diva);

                    return (
                        <Link
                            key={stop.diva}
                            href={`/stop/${encodeURIComponent(stop.diva)}`}
                            className="flex group items-center justify-between p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-2xl hover:bg-slate-100 dark:hover:bg-[#252525] transition-all"
                            data-umami-event={`Stop ${stop.stop.name}`}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => handleToggleFav(e, stop.diva)}
                                    className="focus:outline-none transition-transform active:scale-125"
                                    data-umami-event={`Toggle favourites for ${stop.stop.name}`}
                                >
                                    {isFav ? (
                                        <IconHeartFilled size={20} className="text-red-500"/>
                                    ) : (
                                        <IconHeart size={20}
                                                   className="text-slate-500 dark:text-slate-500 hover:text-red-500"/>
                                    )}
                                </button>

                                <div className="flex items-center gap-3">
                                    <IconMapPin size={20} className="text-yellow-400 dark:text-yellow-300"/>
                                    <span className="font-semibold">{stop.stop.name}</span>
                                    {isFav && (
                                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider"/>
                                    )}
                                </div>
                            </div>
                            <IconChevronRight size={20}
                                              className="text-slate-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"/>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}