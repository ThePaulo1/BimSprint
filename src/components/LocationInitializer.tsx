"use client";

import {useEffect} from "react";
import {useLocationStore} from "@/store/userLocationStore";

export function LocationInitializer() {
    const update = useLocationStore((s) => s.update);

    useEffect(() => {
        update()
    }, [update]);

    return null;
}