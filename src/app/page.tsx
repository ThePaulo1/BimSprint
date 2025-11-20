"use client"

import {useEffect, useState} from "react";

export default function Home() {
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        const options = {
            enableHighAccuracy: true
        };

        const speedObserver = navigator.geolocation.watchPosition(parsePosition,
            null, options);
    }, [])

    const parsePosition = (position: GeolocationPosition) => {
         setSpeed(Math.round((position?.coords?.speed || 0) * 3.6));
    };

    return (
        <div className="text-2xl">
            hi(gh) speed {speed} km/h
        </div>
    )
}