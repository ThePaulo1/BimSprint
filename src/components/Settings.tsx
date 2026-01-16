"use client"

import ThemePicker from "./ThemePicker";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import {useState} from 'react';
import {Popover, Divider} from '@mantine/core';
import {IconSettings} from '@tabler/icons-react';

export default function Settings() {
    const [opened, setOpened] = useState(false);

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
                <div className="space-y-6">
                    <div className="p-4">
                        <ThemePicker/>
                        {/*  further settings here (eg color picker)  */}
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