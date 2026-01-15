"use client"

import ThemePicker from "./ThemePicker";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import {useState} from 'react';
import {Popover} from '@mantine/core';
import {IconSettings} from '@tabler/icons-react';

export default function Settings() {
    const [opened, setOpened] = useState(false);

    const handleReload = () => {
        setOpened(false);
        window.location.reload();
    };

    return (
        <Popover
            width={200}
            opened={opened}
            onChange={setOpened}
            position="bottom-end"
            transitionProps={{duration: 150, transition: 'pop-top-right'}}
            radius={16}
        >
            <Popover.Target>
                <button onClick={() => setOpened(!opened)}>
                    <IconSettings/>
                </button>
            </Popover.Target>
            <Popover.Dropdown>
                <ThemePicker/>
                <ExportButton/>
                <ImportButton onImportSuccess={handleReload}/>
            </Popover.Dropdown>
        </Popover>
    )
}