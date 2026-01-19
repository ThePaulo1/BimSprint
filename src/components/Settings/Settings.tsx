"use client"

import ThemePicker from "./ThemePicker";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import ColorPicker from "./ColorPicker";
import {useState} from 'react';
import {Popover} from '@mantine/core';
import {IconSettings} from '@tabler/icons-react';
import {useUserPreferencesStore} from "@/store/userPreferencesStore";
import {usePathname, useSearchParams} from 'next/navigation'
import SchedulePicker from "@/components/Settings/SchedulePicker";

export default function Settings() {
    const [opened, setOpened] = useState(false);
    const {colors, setSignalColor} = useUserPreferencesStore()
    const pathname = usePathname()
    const isOnMonitorSite = pathname.startsWith('/monitor');
    const diva = pathname.split('/').pop() ?? ""
    const searchParams = useSearchParams()

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
                <div className="p-4 pb-6 space-y-6">
                    <ThemePicker/>
                    <div className="flex flex-row items-center gap-3">
                        <ColorPicker
                            color={colors.green}
                            onChange={(color) => setSignalColor('green', color)}
                        />
                        <ColorPicker
                            color={colors.yellow}
                            onChange={(color) => setSignalColor('yellow', color)}
                        />
                        <ColorPicker
                            color={colors.red}
                            onChange={(color) => setSignalColor('red', color)}
                        />
                    </div>
                    {isOnMonitorSite &&
                        <SchedulePicker
                            diva={diva}
                            line={searchParams.get("line") ?? ""}
                            lineId={searchParams.get("lineId") ?? ""}
                            dir={searchParams.get("dir") ?? ""}
                        />
                    }
                </div>
                <div className="flex gap-x-8 bg-black/40 p-4 rounded-b-2xl">
                    <ExportButton/>
                    <ImportButton/>
                </div>
            </Popover.Dropdown>
        </Popover>
    )
}