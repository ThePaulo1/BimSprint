"use client"

import {useEffect, useState} from "react";

export default function OfflineHint() {
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

    return (
        <>
            {!isOnline &&
                <aside className="text-center px-2 py-4 text-red-600 bg-black/40 w-full text-lg">
                    🚨 Störung im Betriebsablauf – wir bitten um unbestimmte Geduld
                </aside>
            }
        </>
    )
}