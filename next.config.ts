import type {NextConfig} from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "standalone",
    experimental: {
        viewTransition: true,
    },
};

const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: true,
    additionalPrecacheEntries: [{ url: "/offline", revision: crypto.randomUUID() }],
});


export default withSerwist(nextConfig);