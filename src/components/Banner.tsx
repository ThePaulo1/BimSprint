"use client"

import {useEffect, useState} from "react";
import {setBannerOpen} from "../app/lib/cookies";
import {Button, CloseButton, Modal} from "@mantine/core";
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
    const [isBannerOpen, setIsBannerOpen] = useState(false);
    const [isModalOpen, {open, close}] = useDisclosure(false);
    const [beforeInstallPrompt, setBeforeInstallPrompt] = useState<Event>();

    useEffect(() => {
        setIsBannerOpen(requiresBanner())
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setBeforeInstallPrompt(e);
        });
    }, [])

    const requiresBanner = () => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches

        if (isInstalled) {
            return false;
        }

        return isBannerOpenInit && isMobile()
    }

    const isMobile = () => isIOS() || !!navigator.userAgent.match(/Android/i)

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
                <aside
                    className="flex w-full h-20 gap-x-2 items-center justify-between px-3 transition-all dark:bg-darkmode-gray">
                    <CloseButton className="w-1/3" variant="transparent" onClick={handleBannerClose}/>

                    <div className="flex flex-1 items-center" onClick={handleBannerClick}>
                        <img
                            src={'https://via.placeholder.com/64'}
                            alt={""}
                            className="mr-3 h-[48px] w-[48px] flex-shrink-0 rounded-[10px] border border-black/5 object-cover shadow-sm dark:border-white/10"
                        />
                        <div className="flex flex-col justify-center truncate">
                            <h3 className="truncate text-[15px] font-semibold leading-tight text-black dark:text-white">👀
                                We have an app!</h3>
                            <p className="truncate text-[13px] leading-tight text-gray-500 dark:text-gray-400">Click
                                here to download BimSprint</p>
                        </div>
                    </div>

                    <Button
                        variant="gradient"
                        color="pink"
                        size="md"
                        radius="xl"
                        onClick={handleBannerClick}
                        gradient={{from: "#4b6cb7 10%", to: "#253b67 90%", deg: 45}}
                    >
                        GET
                    </Button>
                </aside>
            }
            <Modal opened={isModalOpen} onClose={close} title="Installation" classNames={{body: "my-4"}} radius={16}>
                <ol className="space-y-4 list-decimal list-outside pl-6">
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