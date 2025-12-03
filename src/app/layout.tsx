import type {Metadata, Viewport} from "next";
import type {ReactNode} from "react";
import "./globals.css";
import {constants} from "../constants";
import Menu from "../components/Menu";
import {cookies} from "next/headers";
import '@mantine/core/styles.css';
import {ColorSchemeScript, MantineProvider, mantineHtmlProps} from '@mantine/core';
import Banner from "../components/Banner";
import {getBannerOpen} from "./lib/cookies";

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

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
};

export default async function RootLayout({children}: { children: ReactNode }) {
    const cookieStore = await cookies();
    const theme = cookieStore.get('theme')?.value || 'system';
    const isBannerOpen = await getBannerOpen() === "true";

    return (
        <html lang="en" dir="ltr" className={theme}>
        <body className="w-screen max-w-screen dark:bg-darkmode-gray h-screen max-h-screen flex flex-col gap-y-3">
        <MantineProvider defaultColorScheme="auto">
            <Banner isBannerOpen={isBannerOpen}/>
            <Menu/>
            {children}
        </MantineProvider>
        </body>
        </html>
    );
}