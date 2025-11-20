"use client"

import {useEffect, useState} from "react";

export default function Home() {
    const [speed, setSpeed] = useState(0);
    const [speedNotRetrieved, setSpeedNotRetrieved] = useState(false);

    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0
        };

        const speedObserver = navigator.geolocation.watchPosition(parsePosition,
            () => console.log("error"), options);
        return () => navigator.geolocation.clearWatch(speedObserver)
    }, [])

    useEffect(() => {
        console.log(speed);
    }, [speed]);

    const parsePosition = (position: GeolocationPosition) => {
        const currentSpeed = position.coords.speed;

        if (currentSpeed === null) {
            console.log("Speed is null (not moving enough or no lock)");
            setSpeed(0);
            setSpeedNotRetrieved(true);
        } else {
            setSpeed(Math.round(currentSpeed * 3.6));
            setSpeedNotRetrieved(false);
        }
        console.log(position.coords);
    };

    return (
        <div className="text-2xl">
            hi(gh) speed {speed} km/h
            <div className="text-gray-500 text-lg">{speedNotRetrieved ? "(Speed is null - not moving enough or no lock)" : ""}</div>
        </div>
    )
}