"use client"

import {useEffect, useState} from "react";
import {setBannerOpen} from "../app/lib/cookies";
import {CloseButton, Alert} from "@mantine/core";

type BannerProps = {
    label?: string,
    isBannerOpen: boolean
}
export default function Banner({isBannerOpen}: BannerProps) {
    const [open, setOpen] = useState(isBannerOpen);

    useEffect(() => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches
        console.log(isInstalled)
        setOpen(isBannerOpen && !isInstalled)
    }, [])

    const handleBannerClose = async () => {
        await setBannerOpen()
        setOpen(false);
    }

    return (
        <>
            {open &&
                <div className="h-12 flex flex-none justify-around w-full dark:bg-darkmode-gray items-center">
                    <CloseButton variant="transparent" onClick={handleBannerClose}/>
                    <div><span className="font-bold">👀 We have an app!</span> Click here to download BimSprint</div>
                    <div>Laden</div>
                </div>
            }
        </>
    )
}