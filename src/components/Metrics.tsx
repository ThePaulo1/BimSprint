"use client"

import {useEffect, useMemo, useState} from "react";
import distance from "@turf/distance";
import {useLocationStore} from "@/store/userLocationStore";
import {useShallow} from "zustand/react/shallow";
import {useSearchParams} from "next/navigation";
import {getNearestStops, getStopLineByDiva} from "@/app/lib/utils";
import { validMethods } from "serwist/dist/constants";

interface MetricsProps {
    diva: string;
}

export default function Metrics({diva}: MetricsProps) {
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [activeColor, setActiveColor] = useState("yellow");
    const [statusText, setStatusText] = useState("Beeilung");
    const {lat, lon, speed} = useLocationStore(useShallow((s) => ({lat: s.lat, lon: s.lon, speed: s.speed})));
    const searchParams = useSearchParams()
    const line = searchParams.get("line") ?? "";
    const direction = searchParams.get("dir") ?? "";

    const distanceToStop = useMemo(() => {
        if (!lat || !lon) return 0;

        const stopLine = getStopLineByDiva(diva, line, direction)
        return distance([lat, lon], [stopLine.location.lat, stopLine.location.lon], {units: "meters"})
    }, [lat, lon, diva, line, direction]);



    useEffect(() => {
        const timestamps: string[] = [];

        fetch(`/api/monitor/${diva}?line=${line}&dir=${direction}`)
        .then(res => {
            if (!res.ok) {throw new Error(`HTTP error! status: ${res.status}`); }
            return res.json();})
        .then((data: string[]) => {
            timestamps.push(...data);})
        .then(() => {
            let targetTime = 0;                
            const interval = setInterval(() => {
                

                let diff: number = (targetTime - Date.now())/1000;
                console.log(diff);

                if(diff <= 5){
                    targetTime = timestamps
                    .map(ts => new Date(ts).getTime())
                    .find(tsTime => tsTime - Date.now() > 60 * 1000) ?? 0;

                    console.log(targetTime);

                    if(!targetTime) {
                        console.log("none applicabe found");
                        return;
                    }
                } 
                    
                setMinutesLeft(Math.floor(diff / (60))); 
                
    
            }, 5000);
            
            return () => clearInterval(interval);
        })
        .catch((error: any) => {
            setMinutesLeft(0);
        });


    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full overflow-hidden">

            {/* Breathing Orb */}
            <div className="relative flex items-center justify-center w-96 h-96">
                {/* Core */}
                <div
                    className="w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-1000"
                    style={{backgroundColor: activeColor}}
                />
                <div
                    className="w-48 h-48 rounded-full animate-breathing dark:shadow-black/50 shadow-gray-300/50 shadow-[0_0_60px] flex items-center justify-center transition-colors duration-1000 relative z-10"
                    style={{backgroundColor: activeColor}}
                >
                    {/* Distance in center of orb */}
                    <div
                        className="text-center z-20 text-black/80 dark:text-black/80 font-bold mix-blend-multiply flex flex-col items-center">
                        <div className="text-5xl leading-none tracking-tighter mb-1">{Math.round(distanceToStop)}</div>
                        <div className="text-xs uppercase font-bold tracking-wide opacity-80">Meter</div>
                    </div>
                </div>

                {/* Outer Rings */}
                <div
                    className="absolute inset-0 border border-gray-600 rounded-full opacity-10 scale-100 pointer-events-none"/>
                <div
                    className="absolute inset-0 border border-gray-600 rounded-full opacity-10 scale-125 pointer-events-none"/>
            </div>

            {/* Text Status */}
            <div className="mt-8 text-center space-y-2">
                <h2 className="text-3xl font-semibold dark:text-darkmode-soft-white tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {statusText}
                </h2>
                <p className="text-darkmode-soft-gray text-base">
                    {(speed || 0).toFixed(1)} km/h • {minutesLeft} min bis Abfahrt
                </p>
            </div>

            {/* Dynamic Warning / Next Connection (ChatGPT Response Bubble Style) */}
            {/*{nextConnectionPreview && (*/}
            {/*    <div className="absolute bottom-10 mx-6 bg-[#2f2f2f] text-gpt-text p-4 rounded-xl flex items-start gap-3 shadow-lg border border-gpt-border/50 animate-in fade-in slide-in-from-bottom-4 z-20">*/}
            {/*        <div className="mt-0.5">*/}
            {/*            <RefreshCw size={16} className="text-gpt-textSecondary" />*/}
            {/*        </div>*/}
            {/*        <div className="text-sm">*/}
            {/*            <p className="font-medium mb-1">Empfehlung</p>*/}
            {/*            <p className="text-gpt-textSecondary leading-relaxed">*/}
            {/*                Sie werden diese Verbindung voraussichtlich verpassen. Die nächste Bahn kommt in {minutesLeft + 5} Minuten.*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    )
}