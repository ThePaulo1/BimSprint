"use client"

import {useMantineColorScheme} from '@mantine/core';
import {IconBrightnessFilled, IconMoonFilled, IconSunLowFilled} from '@tabler/icons-react';
import {setTheme} from "../app/lib/cookies";

export default function ThemePicker() {
    const {colorScheme, setColorScheme} = useMantineColorScheme();

    const toggleTheme = async () => {
        if (colorScheme === 'light') {
            const darkThemeColor = window.getComputedStyle(document.body).getPropertyValue('--color-darkmode-gray');
            await setTheme(darkThemeColor);
            setColorScheme('dark');
        } else if (colorScheme === 'dark') {
            await setTheme("");
            setColorScheme('auto');
        } else {
            const lightThemeColor = window.getComputedStyle(document.body).getPropertyValue('--color-lightmode-white');
            await setTheme(lightThemeColor);
            setColorScheme('light');
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