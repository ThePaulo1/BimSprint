"use server"

import {cookies} from "next/headers";

export const getBannerOpen = async () =>
    (await cookies()).get("isBannerOpen")?.value ?? "true";

export async function setBannerOpen() {
    (await cookies()).set({
        name: 'isBannerOpen',
        value: 'false',
        maxAge: 60 * 60 * 24 * 365 * 10,
        sameSite: "strict",
    })
}