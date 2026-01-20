"use client"

import {useEffect, useMemo, useState} from "react";
import distance from "@turf/distance";
import {useUserLocationStore} from "@/store/userLocationStore";
import {useShallow} from "zustand/react/shallow";
import {Location} from "@/types/Direction";
import {useUserPreferencesStore} from "@/store/userPreferencesStore";
import {IconDeviceSpeaker, IconDeviceSpeakerOff, IconWalk} from "@tabler/icons-react";
import useSound from 'use-sound';

interface MetricsProps {
    name: string;
    lineText: string;
    direction: string;
    location: Location;
    monitors: number[];
}

export default function Metrics({name, location, lineText, direction, monitors}: MetricsProps) {
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [minutesLeftNext, setMinutesLeftNext] = useState(0);
    const [nextDeparture, setNextDeparture] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [statusTextNext, setStatusTextNext] = useState("");
    const [isAudioOff, setIsAudioOff] = useState(true);
    const {lat, lon, speed} = useUserLocationStore(useShallow((s) => ({lat: s.lat, lon: s.lon, speed: s.speed})));
    const speeds = [1.4] // init with average adult walking speed in m/s
    const {colors} = useUserPreferencesStore()
    const [colorNext, setColorNext] = useState(colors.red);
    const [play, {stop}] = useSound("/miss.wav");

    const distanceToStop = useMemo(() => {
        if (!lat || !lon) return 0;

        return distance([lat, lon], [location?.lat, location?.lon], {units: "meters"})
    }, [lat, lon, lineText, direction]);

    const timeUntilDeparture = () => {
        const now = Date.now();
        const departureTimeIndex = monitors.findIndex(departure => departure - now > 0)
        let departureTime = monitors[departureTimeIndex]
        setNextDeparture((monitors[departureTimeIndex + 1] - now) / 1000)

        if (!departureTime) {
            // fetch()
            departureTime = 0
            console.log("missing departure times");
        }

        return (departureTime - now) / 1000;
    }

    const calculateReachabilityRation = (departureTime: number) => {
        const movingAverage = speeds.reduce((a, b) => a + b) / speeds.length;
        const timeToReachStop = distanceToStop / movingAverage
        return timeUntilDeparture() / timeToReachStop;
    }

    const reachabilityStatus = useMemo(() => {
        if (!lat || !lon) return colors.red;

        if (speed > 0.2)
            speeds.push(speed / 3.6) // speed in m/s

        const ratio = calculateReachabilityRation(timeUntilDeparture())
        const nextRatio = calculateReachabilityRation(nextDeparture)
        console.log("nextRatio", ratio)
        if (nextRatio >= 1.1) {
            setStatusTextNext("No stress")
            setColorNext(colors.green)
        } else if (nextRatio >= 0.85) {
            setStatusTextNext("Hurry up")
            setColorNext(colors.yellow)
        }
        setStatusTextNext("Miracle needed")
        setColorNext(colors.red)

        if (ratio >= 1.1) {
            setStatusText("No stress")
            return colors.green;
        } else if (ratio >= 0.85) {
            setStatusText("Hurry up")
            return colors.yellow;
        }
        setStatusText("Miracle needed")
        return colors.red;
    }, [speed, colors]);

    useEffect(() => {
        const update = () => {
            setMinutesLeft(Math.floor(timeUntilDeparture() / 60))
            setMinutesLeftNext(Math.floor(nextDeparture / 60))
        }
        update()
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [timeUntilDeparture]);

    const handleAudio = () => {
        if (isAudioOff) {
            setIsAudioOff(false);
            play()
        } else {
            setIsAudioOff(true);
            stop()
        }
    }

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
                <p className="text-gray-600 dark:text-darkmode-soft-gray text-base">
                    {(speed || 0).toFixed(1)} km/h • {minutesLeft} min left
                </p>
                <p className="text-darkmode-soft-gray dark:text-gray-600  text-base">
                    {name}
                    <br/>
                    {lineText} {">"} {direction}
                </p>
            </div>

            {reachabilityStatus === colors.red && (
                <div
                    className="absolute justify-around bottom-6 mx-6 max-w-sm w-[90%] backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 rounded-2xl flex items-start gap-4 shadow-xl border border-white/20 dark:border-white/10 animate-in slide-in-from-bottom-6 fade-in duration-500 z-30"
                >
                    <div
                        className="p-2 rounded-full mt-0.5"
                        style={{backgroundColor: colorNext}}
                    >
                        <IconWalk size={20}/>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">
                            Next departure
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                            {minutesLeftNext
                                ? <span
                                    className="text-gray-900 dark:text-gray-200 font-medium"> {statusTextNext} • {minutesLeftNext} min left</span>
                                : " No later departures found."
                            }
                        </p>
                    </div>
                    <button
                        className="p-2 rounded-full mt-0.5"
                        onClick={() => handleAudio()}
                        data-umami-event="Audio button"
                        data-umami-event-enabled={!isAudioOff ? "enabled" : "disabled"}
                    >
                        {isAudioOff ? <IconDeviceSpeakerOff/> : <IconDeviceSpeaker/>}
                    </button>
                </div>
            )}
        </div>
    )
}