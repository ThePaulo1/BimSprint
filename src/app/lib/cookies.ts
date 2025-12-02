"use server"

import {cookies} from "next/headers";
import {Theme} from "../../components/ThemePicker";

export const getTheme = async (): Promise<Theme> =>
    ((await cookies()).get("theme")?.value ?? "system") as Theme;

export async function setTheme(theme: Theme) {
    (await cookies()).set({
        name: 'theme',
        value: theme,
        maxAge: 60 * 60 * 24 * 365 * 10,
        sameSite: "strict",
    })
}

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