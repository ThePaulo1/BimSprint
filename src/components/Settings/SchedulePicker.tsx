"use client"

import {useUserPreferencesStore} from "@/store/userPreferencesStore";
import {TimePicker} from "@mantine/dates"
import {IconClock, IconMap2} from "@tabler/icons-react";
import {useUserLocationStore} from "@/store/userLocationStore";

type SchedulePickerProps = {
    diva: string;
    lineId: string;
    line: string;
    dir: string;
}
export default function SchedulePicker({diva, line, lineId, dir}: SchedulePickerProps) {
    const {schedules, setSchedule} = useUserPreferencesStore()
    const {lat, lon} = useUserLocationStore()
    const schedule = schedules?.find(s =>
        s.diva === diva && s.line === line && s.dir === dir
    );
    const hasSavedLocation = !!schedule?.location;

    const startTime = schedule?.time?.start || "";
    const endTime = schedule?.time?.end || "";

    const handleTimeChange = (type: 'start' | 'end', value: string) => {
        setSchedule({
            diva,
            line,
            lineId,
            dir,
            location: schedule?.location,
            time: {
                start: type === 'start' ? value : startTime,
                end: type === 'end' ? value : endTime
            }
        });
    };

    const handleLocationChange = () => {
        if (lat === null || lon === null) return;

        const location = schedule?.location ? undefined : {lat, lon};

        setSchedule({
            diva,
            line,
            lineId,
            dir,
            location: location,
            time: schedule?.time
        });
    };

    return (
        <>
            <TimePicker
                label="Start time"
                value={startTime}
                leftSection={<IconClock size={16}/>}
                onChange={(time) => handleTimeChange('start', time)}
                className="max-w-fit"
                classNames={{field: "text-center!"}}
                clearable
                radius={"md"}
                data-umami-event="Time schedule picker"
                data-umami-event-start={startTime}
            />
            <TimePicker
                label="End time"
                value={endTime}
                leftSection={<IconClock size={16}/>}
                onChange={(time) => handleTimeChange('end', time)}
                className="max-w-fit"
                classNames={{field: "text-center!"}}
                clearable
                radius={"md"}
                data-umami-event="Time schedule picker"
                data-umami-event-end={endTime}
            />
            <button
                className="rounded-lg bg-black/20 hover:text-yellow-400 p-2 flex gap-x-2 h-fit"
                onClick={handleLocationChange}
                data-umami-event="Location schedule picker"
            >
                <IconMap2/>
                {hasSavedLocation ? "Clear location" : "Save location"}
            </button>
        </>
    )
}