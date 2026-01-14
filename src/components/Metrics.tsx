"use client"

import {useEffect, useMemo, useState} from "react";
import distance from "@turf/distance";
import {useLocationStore} from "@/store/userLocationStore";
import {useShallow} from "zustand/react/shallow";
import {useSearchParams} from "next/navigation";
import {getNearestStops, getStopLineByDiva} from "@/app/lib/utils";

<<<<<<< HEAD

export default function Metrics() {
    const [speed, setSpeed] = useState(0);
    const [speedNotRetrieved, setSpeedNotRetrieved] = useState(false);
    const [distanceToStop, setDistanceToStop] = useState(0);
=======
interface MetricsProps {
    diva: string;
}

export default function Metrics({diva}: MetricsProps) {
>>>>>>> main
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
        const timestamps: string[] = [
            "2026-01-14T18:00:00.000Z",
            "2026-01-14T21:30:00.000Z",
            "2026-01-15T09:15:00.000Z",
            "2026-01-15T14:45:00.000Z",
            "2026-01-15T20:00:00.000Z",
            "2026-01-16T07:30:00.000Z",
            "2026-01-16T12:00:00.000Z",
            "2026-01-16T16:45:00.000Z",
            "2026-01-17T10:15:00.000Z",
            "2026-01-17T18:30:00.000Z"
        ];

        const targetTime = timestamps
            .map(ts => new Date(ts).getTime()) // convert to unix timestamp
            .find(tsTime => tsTime - Date.now() > 60 * 1000);
                

        const interval = setInterval(() => {
            setMinutesLeft(Math.floor((targetTime - Date.now()) / (60 * 1000))); 
            console.log(targetTime);
            console.log(Date.now());
            console.log("updated");
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
<<<<<<< HEAD
        const options = {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0
        };

        const speedObserver = navigator.geolocation.watchPosition(parsePosition,
            () => console.log("error"), options);
        return () => navigator.geolocation.clearWatch(speedObserver)
    }, [])

    const parsePosition = (position: GeolocationPosition) => {
        const currentSpeed = position.coords.speed;
        setDistanceToStop(distance([position.coords.latitude, position.coords.longitude], santa, {units: "meters"}));
        
        
        if (currentSpeed === null) {
            console.log("Speed is null (not moving enough or no lock)");
            setSpeed(0);
            setSpeedNotRetrieved(true);
        } else {
            setSpeed(Number((currentSpeed * 3.6).toFixed(2)));
            setSpeedNotRetrieved(false);
        }
        console.log(position.coords);
    };
=======
        fetch(`/api/monitor/${diva}?line=${line}&dir=${direction}`).then(data => console.log("problemo", data));
    }, []);
>>>>>>> main

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