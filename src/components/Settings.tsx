"use client"

import ThemePicker from "./ThemePicker";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import ColorPicker from "./ColorPicker";
import {useEffect, useState} from 'react';
import {Popover, Divider} from '@mantine/core';
import {IconSettings} from '@tabler/icons-react';
import { getPreferences, updateSignalColor } from "../app/lib/utils";

export default function Settings() {
    const [opened, setOpened] = useState(false);
    const [colors, setColors] = useState({ red: "", yellow: "", green: "" });

    useEffect(() => {
        setColors(getPreferences().colors);
    }, []);

    const handleColorChange = (key: 'red' | 'yellow' | 'green', hex: string) => {
        updateSignalColor(key, hex);
        setColors(prev => ({ ...prev, [key]: hex }));
    };
    const handleReload = () => {
        setOpened(false);
        window.location.reload();
    };

    return (
        <Popover
            width="auto"
            opened={opened}
            onChange={setOpened}
            position="bottom-end"
            transitionProps={{duration: 150, transition: 'pop-top-right'}}
            radius={16}
            classNames={{dropdown: "p-0!"}}
        >
            <Popover.Target>
                <button onClick={() => setOpened(!opened)}>
                    <IconSettings/>
                </button>
            </Popover.Target>
            <Popover.Dropdown>
                <div className="space-y-2">
                    <div className="p-4 pb-2">
                        <ThemePicker/>
                    </div>

                    {/*  further settings here (eg color picker)  */}
                    <div className="px-4 pb-4 flex flex-row items-center justify-between gap-3">                        <ColorPicker
                            color={colors.green}
                            onChange={(color) => handleColorChange('green', color)}
                        />
                        <ColorPicker
                            color={colors.yellow}
                            onChange={(color) => handleColorChange('yellow', color)}
                        />
                        <ColorPicker
                            color={colors.red}
                            onChange={(color) => handleColorChange('red', color)}
                        />

                        </div>
                    <div className="flex gap-x-8 bg-black/40 p-4 rounded-b-2xl">
                        <ExportButton/>
                        <ImportButton onImportSuccess={handleReload}/>
                    </div>
                </div>
            </Popover.Dropdown>
        </Popover>
    )
}