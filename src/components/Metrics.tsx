"use client"

import {useEffect, useMemo, useState} from "react";
import distance from "@turf/distance";
import {useLocationStore} from "@/store/userLocationStore";
import {useShallow} from "zustand/react/shallow";
import {Location} from "@/types/Direction";

interface MetricsProps {
    name: string;
    lineText: string;
    direction: string;
    location: Location;
    monitors: number[];
}

const STATUS = {
    UNREACHABLE: "#aa2525",
    MAYBE_REACHABLE: "#d0a838",
    REACHABLE: "#90c874"
};

export default function Metrics({name, location, lineText, direction, monitors}: MetricsProps) {
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [activeColor, setActiveColor] = useState("yellow");
    const [statusText, setStatusText] = useState("Beeilung");
    const {lat, lon, speed} = useLocationStore(useShallow((s) => ({lat: s.lat, lon: s.lon, speed: s.speed})));
    const speeds = [1.4] // init with average adult walking speed in m/s

    const distanceToStop = useMemo(() => {
        if (!lat || !lon) return 0;

        return distance([lat, lon], [location.lat, location.lon], {units: "meters"})
    }, [lat, lon, lineText, direction]);

    const timeUntilDeparture = () => {
        const now = Date.now();
        let departureTime = monitors.find(departure => departure - now > 0)

        if (!departureTime) {
            // fetch()
            departureTime = 0
            console.log("missing departure times");
        }

        return (departureTime - now) / 1000;
    }

    const reachabilityStatus = useMemo(() => {
        if (!lat || !lon) return STATUS.UNREACHABLE;

        if (speed > 0.2)
            speeds.push(speed / 3.6) // speed in m/s

        const movingAverage = speeds.reduce((a, b) => a + b) / speeds.length;
        const timeToReachStop = distanceToStop / movingAverage
        const ratio = timeUntilDeparture() / timeToReachStop;

        console.log("timeUntilDeparture:", timeUntilDeparture(), movingAverage, "timeToReachStop:", timeToReachStop)

        if (ratio >= 1.1) {
            return STATUS.REACHABLE;
        } else if (ratio >= 0.85) {
            return STATUS.MAYBE_REACHABLE;
        }
        return STATUS.UNREACHABLE;
    }, [speed]);

    useEffect(() => {
        const update = () => setMinutesLeft(Math.floor(timeUntilDeparture() / 60))
        update()
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [timeUntilDeparture]);

    return (
        <div className="flex flex-col items-center justify-center h-full overflow-hidden">

            {/* Breathing Orb */}
            <div className="relative flex items-center justify-center w-96 h-96">
                {/* Core */}
                <div
                    className="w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-1000"
                    style={{backgroundColor: reachabilityStatus}}
                />
                <div
                    className="w-48 h-48 rounded-full animate-breathing dark:shadow-black/50 shadow-gray-300/50 shadow-[0_0_60px] flex items-center justify-center transition-colors duration-1000 relative z-10"
                    style={{backgroundColor: reachabilityStatus}}
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