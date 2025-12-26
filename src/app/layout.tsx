import type {Metadata, Viewport} from "next";
import type {ReactNode} from "react";
import "./globals.css";
import {constants} from "../constants";
import Menu from "../components/Menu";
import '@mantine/core/styles.css';
import {MantineProvider, ColorSchemeScript} from '@mantine/core';
import Banner from "../components/Banner";
import {getBannerOpen, getTheme} from "./lib/cookies";

export const metadata: Metadata = {
    applicationName: constants.name,
    title: { default: constants.name, template: "%s - " + constants.name },
    description: constants.description,
    manifest: "/manifest.json",
    appleWebApp: { capable: true, statusBarStyle: "default", title: constants.name },
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
    return { themeColor };
}

export default async function RootLayout({children}: { children: ReactNode }) {
    const isBannerOpen = await getBannerOpen() === "true";

    return (
        <html lang="de" suppressHydrationWarning>
        <head>
            {/* Wichtig für Mantine, verhindert das weiße Blitzen beim Laden */}
            <ColorSchemeScript defaultColorScheme="auto" />
        </head>
        <body className="min-h-screen bg-zinc-50 antialiased" suppressHydrationWarning>
        <MantineProvider defaultColorScheme="auto">
            <Banner isBannerOpenInit={isBannerOpen}/>
            <Menu/>
            {children}
        </MantineProvider>
        </body>
        </html>
    );
}