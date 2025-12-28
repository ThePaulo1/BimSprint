import {defaultCache} from "@serwist/next/worker";
import {
    CacheFirst,
    ExpirationPlugin,
    NetworkOnly,
    PrecacheEntry,
    SerwistGlobalConfig,
    StaleWhileRevalidate
} from "serwist";
import {Serwist} from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        // Change this attribute's name to your `injectionPoint`.
        // `injectionPoint` is an InjectManifest option.
        // See https://serwist.pages.dev/docs/build/configuring
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: false,
    runtimeCaching: [
        {
            matcher({request}) {
                return request.mode === "navigate";
            },
            handler: new NetworkOnly(),
        },
        {
            matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: new StaleWhileRevalidate({
                cacheName: "static-image-assets",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 12,
                        maxAgeFrom: "last-used",
                    }),
                ],
            }),
        },
    ],
    fallbacks: {
        entries: [
            {
                url: "/offline",
                matcher({request}) {
                    return request.destination === "document";
                },
            },
        ],
    }
});

serwist.addEventListeners();