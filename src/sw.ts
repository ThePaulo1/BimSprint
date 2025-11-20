import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

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
    runtimeCaching: defaultCache,
});

const urlsToPrecache = ["/"];

self.addEventListener("install", async (event) => {
    await Promise.all(
        urlsToPrecache.map((entry) => {
            return serwist.handleRequest({ request: new Request(entry), event });
        }),
    );

    await serwist.handleInstall(event);
});


serwist.addEventListeners();