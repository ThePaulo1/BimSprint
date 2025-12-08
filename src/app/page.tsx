"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getNearbyStops, Stop } from "./lib/apiHandler";

export default function Page() {
    const [stops, setStops] = useState<Stop[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => getNearbyStops(pos.coords.latitude, pos.coords.longitude).then(setStops),
            () => getNearbyStops(48.1851, 16.3762).then(setStops) // Fallback Hbf
        );
    }, []);

    if (!mounted) return <div className="min-h-screen bg-zinc-50" />;

    return (
        <main className="p-6 max-w-md mx-auto min-h-screen bg-zinc-50">
            <h1 className="text-4xl font-black italic text-blue-600 mb-8">BIMSPRINT 🏃</h1>
            <div className="space-y-4">
                {stops.length === 0 && <p className="text-center p-10 opacity-30">Suche Stationen...</p>}
                {stops.map(stop => (
                    <Link key={stop.id} href={`/stop/${stop.id}?lat=${stop.coords[0]}&lon=${stop.coords[1]}`}
                          className="block p-6 bg-white rounded-[2rem] shadow-sm border border-zinc-100 active:scale-95 transition-all">
                        <div className="font-black text-xl text-zinc-800">{stop.name}</div>
                        <div className="text-blue-500 font-mono text-sm font-bold uppercase">
                            {((stop.distance || 0) * 1000).toFixed(0)}m entfernt
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}