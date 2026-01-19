import type {NextConfig} from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "standalone",
    experimental: {
        viewTransition: true,
    },
    rewrites: () =>
        process.env.NEXT_PUBLIC_ANALYTICS_URL ?
            [
                {
                    source: '/m.js',
                    destination: process.env.NEXT_PUBLIC_ANALYTICS_URL,
                },
                {
                    source: '/api/m',
                    destination: `${process.env.NEXT_PUBLIC_ANALYTICS_URL}/api/m`,
                },
            ] : []
};

const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: false,
    disable: process.env.NODE_ENV === "development",
    additionalPrecacheEntries: [{url: "/offline", revision: crypto.randomUUID()}],
});


export default withSerwist(nextConfig);