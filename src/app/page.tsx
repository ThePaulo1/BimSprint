"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getNearbyStops } from "./lib/apiHandler";

export default function Page() {
    const [stops, setStops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Position abfragen
        navigator.geolocation.getCurrentPosition((pos) => {
            // 2. Haltestellen holen
            getNearbyStops(pos.coords.latitude, pos.coords.longitude)
                .then(res => {
                    setStops(res);
                    setLoading(false);
                });
        });
    }, []);

    return (
        <main className="p-6 max-w-md mx-auto min-h-screen bg-zinc-50">
            <h1 className="text-4xl font-black italic text-blue-600 mb-8 tracking-tighter uppercase">
                BIMSPRINT 🏃
            </h1>

            <div className="grid gap-4">
                {loading ? (
                    <p className="animate-pulse text-zinc-400 font-bold uppercase text-xs text-center p-10">
                        Suche Stationen...
                    </p>
                ) : (
                    stops.map((stop) => (
                        <Link
                            key={stop.id}
                            href={`/stop/${stop.id}?lat=${stop.lat}&lon=${stop.lon}`}
                            className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm active:scale-95 transition-all block"
                        >
                            <div className="font-black text-xl text-zinc-800">{stop.name}</div>
                            <div className="text-blue-500 font-mono text-xs font-bold mt-1">
                                {(stop.dist * 1000).toFixed(0)}m ENTFERNT
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </main>
    );
}