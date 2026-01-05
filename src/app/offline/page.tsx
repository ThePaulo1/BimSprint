"use client"

import NotFound from "../../components/NotFound";
import {useEffect, useState} from "react";
import {IconCloudOff} from "@tabler/icons-react";
import {useRouter} from "next/navigation";

export default function Offline() {
    const [isOnline, setIsOnline] = useState(true);
    const router = useRouter()

    const handleOnline = () => router.push('/');
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

    return <NotFound
        icon={<IconCloudOff/>}
        code={200}
        title={"Nächster Halt: Funkloch!"}
        message={"Heast, ohne Netz fahrt de Eisenbahn net. Irgendwer hot de Leitung g'fladert oder du bist grod im tiafsten Tunnel stecken bliebn. Sobald dei Verbindung wieder hinhaut, fahr' ma weiter."}
    />
}