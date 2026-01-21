"use client";

import {useEffect} from "react";
import {useRouter, usePathname} from "next/navigation";
import {Schedule, useUserPreferencesStore} from "@/store/userPreferencesStore";
import distance from "@turf/distance";
import {useUserLocationStore} from "@/store/userLocationStore";

const timeToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
}

export default function ScheduleNavigator() {
    const router = useRouter();
    const pathname = usePathname();
    const {removeSchedule, schedules} = useUserPreferencesStore()
    const {lat, lon} = useUserLocationStore()

    useEffect(() => {
        if (pathname !== "/") return;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes()


        const activeSchedule = schedules?.find((schedule) => {
            if (schedule.time?.start && schedule.time?.end) {
                return currentMinutes >= timeToMinutes(schedule.time.start) && currentMinutes <= timeToMinutes(schedule.time.end);
            }

            if (schedule.location?.lat && lat && lon) {
                return distance([lat, lon], [schedule.location.lat, schedule.location.lon], {units: "meters"}) < 100;
            }

            return false;
        });

        if (activeSchedule) {
            const {diva, line, lineId, dir} = activeSchedule;
            router.replace(`/monitor/${diva}?line=${line}&lineId=${lineId}&dir=${dir}`);
            removeSchedule(diva, line, dir);
        }

    }, [pathname, schedules]);

    return null;
}