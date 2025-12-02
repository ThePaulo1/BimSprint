"use client"

import {useMantineColorScheme} from '@mantine/core';
import cx from 'clsx';
import {IconMoonFilled, IconSunLowFilled, IconBrightnessFilled} from '@tabler/icons-react';

export type Theme = "light" | "dark" | "system";

export default function ThemePicker() {
    const {colorScheme, setColorScheme} = useMantineColorScheme();

    const toggleTheme = () => {
        if (colorScheme === 'light') {
            setColorScheme('dark');
        } else if (colorScheme === 'dark') {
            setColorScheme('auto');
        } else {
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