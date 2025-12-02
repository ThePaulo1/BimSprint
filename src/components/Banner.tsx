"use client"

import {useEffect, useState} from "react";
import {setBannerOpen} from "../app/lib/cookies";
import {Alert} from "@mantine/core";

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

    const handleBannerClick = async () => {
        console.log("banner clicked")
    }

    return (
        <>
            {open &&
                <Alert
                    variant="transparent"
                    withCloseButton
                    closeButtonLabel="Dismiss"
                    onClick={()=>handleBannerClick()}
                    onClose={() => handleBannerClose()}
                    className="text-pretty"
                    classNames={{message: "!text-xs sm:!text-sm", wrapper: "!flex-row-reverse", body: "!flex" }}
                >
                    <span className="font-bold">👀 We have an app!</span> Click to download BimSprint here
                   <div>Laden</div>
                </Alert>
            }
        </>
    )
}