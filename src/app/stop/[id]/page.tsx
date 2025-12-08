"use client";
import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getLinesForStop, getCountdown, LineDirection, calculateDist } from "../../lib/apiHandler";

export default function StopDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [lines, setLines] = useState<LineDirection[]>([]);
    const [selected, setSelected] = useState<LineDirection | null>(null);
    const [countdown, setCountdown] = useState(0);
    const [dist, setDist] = useState(0);

    const lat = parseFloat(searchParams.get("lat") || "0");
    const lon = parseFloat(searchParams.get("lon") || "0");

    useEffect(() => {
        getLinesForStop(id).then(setLines);
        const wId = navigator.geolocation.watchPosition(p =>
            setDist(calculateDist(p.coords.latitude, p.coords.longitude, lat, lon)));
        return () => navigator.geolocation.clearWatch(wId);
    }, [id, lat, lon]);

    useEffect(() => {
        if (!selected) return;
        const up = () => getCountdown(selected.rbl).then(setCountdown);
        up(); const i = setInterval(up, 10000); return () => clearInterval(i);
    }, [selected]);

    if (!selected) return (
        <div className="p-6 max-w-md mx-auto min-h-screen bg-zinc-50">
            <h2 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">Richtung wählen</h2>
            <div className="grid gap-3">
                {lines.map((l, i) => (
                    <button key={i} onClick={() => setSelected(l)} className="p-5 bg-white rounded-[2rem] shadow-sm border border-zinc-100 text-left flex justify-between items-center active:scale-95 transition-all">
                        <div>
                            <div className="text-3xl font-black italic text-zinc-800 leading-none">{l.line}</div>
                            <div className="text-[10px] font-bold opacity-40 uppercase mt-1">{l.towards}</div>
                        </div>
                        <span className="text-zinc-200 text-2xl">→</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const walkMin = (dist / 0.083) / 60; // 5km/h
    const diff = countdown - walkMin;
    const status = diff > 2 ? { c: "bg-emerald-500", t: "CHILLIG" } : diff >= 0 ? { c: "bg-orange-500", t: "RUN!" } : { c: "bg-red-600", t: "ZUSPÄT" };

    return (
        <div className={`${status.c} min-h-screen p-8 text-white flex flex-col items-center justify-between text-center transition-colors duration-500`}>
            <button onClick={() => setSelected(null)} className="w-full text-left font-bold text-[10px] uppercase opacity-50">← Zurück</button>
            <div className="text-[25vw] font-black italic leading-none tracking-tighter">{selected.line}</div>
            <div className="text-9xl font-black italic">{countdown}'</div>
            <div className="text-7xl font-black italic tracking-tighter leading-none">{status.t}</div>
            <div className="text-[10px] font-mono opacity-60 uppercase">Distanz: {(dist*1000).toFixed(0)}m</div>
        </div>
    );

}