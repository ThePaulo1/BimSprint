"use client";

import {useEffect} from "react";
import {useUserLocationStore} from "@/store/userLocationStore";

export function UserLocationStoreProvider() {
    const update = useUserLocationStore((s) => s.update);

    useEffect(() => {
        update()
    }, [update]);

    return null;
}