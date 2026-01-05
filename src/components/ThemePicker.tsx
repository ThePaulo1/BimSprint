"use client"

import {useMantineColorScheme} from '@mantine/core';
import {IconBrightnessFilled, IconMoonFilled, IconSunLowFilled} from '@tabler/icons-react';
import {setTheme} from "../app/lib/cookies";

export default function ThemePicker() {
    const {colorScheme, setColorScheme} = useMantineColorScheme();

    const toggleTheme = async () => {
        try {
            if (colorScheme === 'light') {
                const darkThemeColor = window.getComputedStyle(document.body).getPropertyValue('--color-darkmode-gray');
                setColorScheme('dark');
                await setTheme(darkThemeColor);
            } else if (colorScheme === 'dark') {
                setColorScheme('auto');
                await setTheme("");
            } else {
                const lightThemeColor = window.getComputedStyle(document.body).getPropertyValue('--color-lightmode-white');
                setColorScheme('light');
                await setTheme(lightThemeColor);
            }
        } catch (error) {
            // server unreachable (when served from offline cache)
        }
    }

    const getIcon = () => {
        if (colorScheme === 'light') {
            return <IconMoonFilled/>
        } else if (colorScheme === 'dark') {
            return <IconSunLowFilled/>
        } else {
            return <IconBrightnessFilled/>
        }
    }

    return (
        <button onClick={toggleTheme} className="flex gap-x-3">
            {getIcon()}
            <div>{colorScheme}</div>
        </button>
    )
}