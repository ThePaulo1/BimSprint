import type {NextConfig} from "next";
import withSerwistInit from "@serwist/next";
import {execSync} from "child_process";

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
    disable: process.env.NODE_ENV === "development",
    reloadOnOnline: false,
    scope: "/",
});


export default withSerwist(nextConfig);