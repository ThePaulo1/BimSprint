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

export async function setTheme(theme: string) {
    (await cookies()).set({
        name: 'theme',
        value: theme,
        maxAge: 60 * 60 * 24 * 365 * 10,
        sameSite: "strict",
    })
}

export const getTheme = async () =>
    (await cookies()).get("theme")?.value
