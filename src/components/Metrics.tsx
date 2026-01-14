"use client"

import {useEffect, useState} from "react";
import distance from "@turf/distance";


export default function Metrics() {
    const [speed, setSpeed] = useState(0);
    const [speedNotRetrieved, setSpeedNotRetrieved] = useState(false);
    const [distanceToStop, setDistanceToStop] = useState(0);
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [activeColor, setActiveColor] = useState("yellow");
    const [statusText, setStatusText] = useState("Beeilung");
    const [userLat, setUserLat] = useState(0);
    const [userLong, setUserLong] = useState(0);
    const santa = [66.543966, 25.845279]




    useEffect(() => {

        const timestamps: string[] = [];

        const params = new URLSearchParams(window.location.search);

        const line = params.get("line");
        const direction = params.get("dir");
        const diva = params.get("id"); // only if it's also in URL

        const result: string[] = [];

        console.log("getting Data");
        fetch(`/api/monitor/${diva}?line=${line}&dir=${direction}`)
        .then(res => res.json())
        .then((data: string[]) => {
            result.push(...data);
            console.log(result);
        });

        console.log("got data");

        const targetTime = timestamps
            .map(ts => new Date(ts).getTime()) // convert to unix timestamp
            .find(tsTime => tsTime - Date.now() > 60 * 1000);
        console.log(targetTime);                
        if(!targetTime) {return;}

        const interval = setInterval(() => {
            setMinutesLeft(Math.floor((targetTime - Date.now()) / (60 * 1000))); 
            console.log(targetTime);
            console.log(Date.now());
            console.log("updated");
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    /*
    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0
        };

        const speedObserver = navigator.geolocation.watchPosition(parsePosition,
            () => console.log("error"), options);
        return () => navigator.geolocation.clearWatch(speedObserver)
    }, []);
    */

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

    return (
            <div className="flex flex-col items-center justify-center h-full overflow-hidden">

                {/* Breathing Orb */}
                <div className="relative flex items-center justify-center w-96 h-96">
                    {/* Core */}
                    <div
                        className="w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-1000"
                        style={{ backgroundColor: activeColor }}
                    />
                    <div
                        className="w-48 h-48 rounded-full animate-breathing dark:shadow-black/50 shadow-gray-300/50 shadow-[0_0_60px] flex items-center justify-center transition-colors duration-1000 relative z-10"
                        style={{ backgroundColor: activeColor }}
                    >
                        {/* Distance in center of orb */}
                        <div className="text-center z-20 text-black/80 dark:text-black/80 font-bold mix-blend-multiply flex flex-col items-center">
                            <div className="text-5xl leading-none tracking-tighter mb-1">{Math.round(distanceToStop)}</div>
                            <div className="text-xs uppercase font-bold tracking-wide opacity-80">Meter</div>
                        </div>
                    </div>

                    {/* Outer Rings */}
                    <div className="absolute inset-0 border border-gray-600 rounded-full opacity-10 scale-100 pointer-events-none" />
                    <div className="absolute inset-0 border border-gray-600 rounded-full opacity-10 scale-125 pointer-events-none" />
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