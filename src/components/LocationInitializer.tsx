"use client";

import {JSX, useEffect} from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import {useLocationStore} from "@/store/userLocationStore";

export function LocationInitializer() {
    const updateStore = useLocationStore((s) => s.update);

    const geo = useGeolocation({
        enableHighAccuracy: true,
        timeout: 100,
    });

    useEffect(() => {
        updateStore(geo);
    }, [geo, updateStore]);

    return null;
}