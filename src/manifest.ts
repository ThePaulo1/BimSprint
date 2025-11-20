import type { MetadataRoute } from "next";
import {constants} from "./constants";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    return {
        name: constants.name,
        short_name: constants.shortName,
        description: constants.description,
        start_url: "/",
        display: "fullscreen",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icons/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
        orientation: "any",
    };
}