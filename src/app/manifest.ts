import type { MetadataRoute } from "next";
import {constants} from "../constants";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    return {
        name: constants.name,
        short_name: constants.shortName,
        description: constants.description,
        start_url: "/",
        id: "/",
        display: "standalone",
        categories: ["lifestyle", "utilities"],
        icons: [
            {
                src: "/icons/apple-touch-icon.png",
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
        launch_handler: {
            client_mode: "navigate-existing"
        },
        // shortcuts: [
        //     {
        //         "name": "Today's agenda",
        //         "short_name": "Agenda",
        //         "description": "View your agenda for today",
        //         "url": "/today",
        //         "icons": [
        //             {
        //                 "src": "android-chrome-192x192.png",
        //                 "sizes": "192x192"
        //             }
        //         ]
        //     }
        // ]
    };
}