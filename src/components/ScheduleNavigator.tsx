"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";

const timeToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
}

export default function ScheduleNavigator() {
    const router = useRouter();
    const pathname = usePathname();
    const schedules = useUserPreferencesStore((state) => state.schedules);
    const {removeSchedule} = useUserPreferencesStore()
    useEffect(() => {
        if (pathname !== "/") return;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes()


        const activeSchedule = schedules?.find((s) => {
            if (!s.time?.start || !s.time?.end) return false;
            return currentMinutes >= timeToMinutes(s.time.start) && currentMinutes <= timeToMinutes(s.time.end);
        });

        if (activeSchedule) {
<<<<<<< HEAD

            const targetUrl = `/monitor/${activeSchedule.diva}?line=${activeSchedule.line}&lineId&${activeSchedule.lineId}dir=${activeSchedule.dir}`;
=======
            const targetUrl = `/monitor/${activeSchedule.diva}?line=${activeSchedule.line}&dir=${activeSchedule.dir}`;
>>>>>>> main
            console.log("Auto-navigating to:", activeSchedule.line);
            router.replace(targetUrl);
            
            removeSchedule(activeSchedule.diva, activeSchedule.line, activeSchedule.dir)
        }

    }, [pathname, schedules, router]);

    return null;
}