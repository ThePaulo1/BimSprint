"use client"

import {useState} from "react";
import {setTheme} from "../app/lib/cookies";

export type Theme = "light" | "dark" | "system";

export default function ThemePicker({defaultTheme}: { defaultTheme: Theme }) {
    const [currentTheme, setCurrentTheme] = useState(defaultTheme);

    const toggleTheme = async () => {
        const nextTheme = getNextTheme()
        setCurrentTheme(nextTheme)
        await setTheme(nextTheme === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : nextTheme)
    };

    const getNextTheme = (): Theme => {
        if (currentTheme === "dark") return "light";
        if (currentTheme === "light") return "system";
        return "dark";
    };


    return (
        <button onClick={toggleTheme}>
            {currentTheme}
        </button>
    )
}