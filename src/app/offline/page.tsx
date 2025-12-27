"use client"

import NotFound from "../../components/NotFound";
import {useEffect, useState} from "react";

export default function Offline() {
    const [isOnline, setIsOnline] = useState(true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsOnline(navigator.onLine);
        }

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);


        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [])

    useEffect(() => {
        console.log(isOnline);
    }, [isOnline]);

    if (isOnline) {
        return <NotFound/>
    }

    return (
        <div>
            You are currently offline
        </div>
    )
}