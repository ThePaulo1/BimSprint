"use client"

import {useEffect, useState} from "react";
import {setBannerOpen} from "../app/lib/cookies";
import {CloseButton, Modal} from "@mantine/core";
import {useDisclosure} from '@mantine/hooks';
import {
    IconDeviceMobileShare,
    IconDots,
    IconDotsCircleHorizontal,
    IconDotsVertical,
    IconShare2,
    IconSquarePlus
} from "@tabler/icons-react";

type BannerProps = {
    label?: string,
    isBannerOpenInit: boolean
}

export default function Banner({isBannerOpenInit}: BannerProps) {
    const [isBannerOpen, setIsBannerOpen] = useState(isBannerOpenInit);
    const [isModalOpen, {open, close}] = useDisclosure(false);
    const [beforeInstallPrompt, setBeforeInstallPrompt] = useState<Event>();

    useEffect(() => {
        setIsBannerOpen(requiresBanner())
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setBeforeInstallPrompt(e);
        });
        console.log(isSimplifiedSafariUI());
    }, [])

    const requiresBanner = () => {
        const userAgent = navigator.userAgent;
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches

        if (isInstalled) {
            return false;
        }

        return !!(isBannerOpen
            && isIOS() && !isInstalled
            || userAgent.match(/Android/i) && userAgent.match(/Firefox/i))
    }

    const isIOS = () => typeof navigator !== 'undefined'
        && !!navigator.userAgent.match(/iPhone|iPad|iPod/i)

    const isSimplifiedSafariUI = () => {
        if (typeof navigator !== 'undefined') {
            const version = navigator.userAgent.match(/OS\s(\d+)_/i)

            if (version) {
                return Number(version[1]) >= 26
            }
        }
        return false;
    }

    const handleBannerClose = async () => {
        await setBannerOpen()
        setIsBannerOpen(false);
    }

    const handleBannerClick = () => {
        console.log(beforeInstallPrompt)
        if (beforeInstallPrompt) {
            // @ts-ignore
            beforeInstallPrompt.prompt()
        } else {
            open()
        }
    }

    return (
        <>
            {isBannerOpen &&
                <div
                    className="flex h-20 gap-x-2 items-center justify-between border-gray-300/80 bg-white/80 px-3 backdrop-blur-md transition-all dark:border-gray-700/80 dark:bg-[#1C1C1E]/80">
                    <CloseButton className="w-1/3" variant="transparent" onClick={handleBannerClose}/>

                    <div className="flex flex-1 items-center" onClick={handleBannerClick}>
                        <img
                            src={'https://via.placeholder.com/64'}
                            alt={""}
                            className="mr-3 h-[48px] w-[48px] flex-shrink-0 rounded-[10px] border border-black/5 object-cover shadow-sm dark:border-white/10"
                        />
                        <div className="flex flex-col justify-center truncate">
                            <h3 className="truncate text-[15px] font-semibold leading-tight text-black dark:text-white">👀 We have an app!</h3>
                            <p className="truncate text-[13px] leading-tight text-gray-500 dark:text-gray-400">Click here to download BimSprint</p>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBannerClick();
                        }}
                        className="ml-2 flex-shrink-0 rounded-full bg-[#007AFF] px-4 py-1.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#0071E3] active:bg-[#0062C3]"
                    >
                        GET
                    </button>
                </div>
                // <aside className="h-14 justify-center   items-center flex dark:bg-darkmode-gray p-2"
                //        onClick={handleBannerClick}
                // >
                //     <div className="overflow-clip flex">
                //         <CloseButton className="w-1/3 flex-auto" variant="transparent" onClick={handleBannerClose}/>
                //         <div className="w-2/3 flex-auto"><span className="font-bold">👀 We have an app!</span> Click here
                //             to download BimSprint
                //         </div>
                //         <div className="w-1/3 flex-auto">Laden</div>
                //     </div>
                // </aside>
            }
            <Modal opened={isModalOpen} onClose={close} title="Installation" classNames={{body: "my-4"}} radius={16}>
                <ol className="space-y-4 list-decimal list-outside pl-4">
                    {isIOS() && isSimplifiedSafariUI() &&
                        <li>
                        <span className="inline-flex gap-x-1 align-middle">
                                Click <IconDotsCircleHorizontal/>
                            </span>
                        </li>
                    }
                    <li>
                        <span className="inline-flex gap-x-1 align-middle">
                            {isIOS() ? (isSimplifiedSafariUI() ? "Select" : "Click") : "Click"} {isIOS() ?
                            <IconShare2/> : <IconDotsVertical/>}
                        </span>
                    </li>
                    <li>
                        <span className="inline-flex gap-x-1 align-middle">
                            {isIOS() ? <IconSquarePlus/> : <IconDeviceMobileShare/>} Add BimSprint to your home screen
                        </span>
                    </li>
                </ol>
            </Modal>
        </>
    )
}