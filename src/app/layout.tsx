import type {Metadata, Viewport} from "next";
import type {ReactNode} from "react";
import "./globals.css";
import Home from "./page";
import {constants} from "../constants";


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

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en" dir="ltr">
        <body>
        <Home/>
        </body>
        </html>
    );
}