import type {Metadata, Viewport} from "next";
import type {ReactNode} from "react";
import "./globals.css";
import {constants} from "@/constants";
import Menu from "../components/Menu";
import '@mantine/core/styles.css';
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from '@mantine/core';
import Banner from "../components/Banner";
import {getBannerOpen, getTheme} from "./lib/cookies";
import OfflineHint from "../components/OfflineHint";
import {UserLocationStoreProvider} from "@/components/UserLocationStoreProvider";
import ScheduleNavigator from "@/components/ScheduleNavigator";

export const metadata: Metadata = {
    applicationName: constants.name,
    title: {
        default: constants.name,
        template: "%s - " + constants.name,
    },
    description: constants.description,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: constants.name,
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        shortcut: "/favicon.ico",
        apple: [{url: "/icons/apple-touch-icon.png", sizes: "180x180"}],
    },
};

export async function generateViewport(): Promise<Viewport> {
    const themeColor = await getTheme() ?? [
        {media: "(prefers-color-scheme: dark)", color: "#212121"},
        {media: "(prefers-color-scheme: light)", color: "#ffffff"}
    ]

    return {
        themeColor: themeColor,
    }
}

export default async function RootLayout({children}: { children: ReactNode }) {
    const isBannerOpen = await getBannerOpen() === "true";

    return (
        <html lang="en" dir="ltr" {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript/>
        </head>
        <body className="w-screen max-w-screen dark:bg-darkmode-gray h-dvh max-h-dvh">
        <UserLocationStoreProvider/>
        <ScheduleNavigator/>
        <MantineProvider defaultColorScheme="auto">
            <div className="flex flex-col gap-y-3 max-h-full h-dvh">
                <Banner isBannerOpenInit={isBannerOpen}/>
                <OfflineHint/>
                <Menu/>
                <div className="flex justify-center flex-1 min-h-0">
                    <main className="max-w-4xl h-full w-full max-h-full">
                        {children}
                    </main>
                </div>
            </div>
        </MantineProvider>
        </body>
        </html>
    );
}