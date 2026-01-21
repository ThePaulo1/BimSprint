import {create} from 'zustand';
import {persist} from "zustand/middleware";
import {z} from "zod";
import {PreferenceSchema, ScheduleSchema} from "@/components/Settings/ImportButton";

type Preference = z.infer<typeof PreferenceSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;

type UserPreferencesStore = Preference & {
    setSignalColor: (key: "red" | "yellow" | "green", color: string) => void;
    setFavourites: (diva: string) => void;
    importPreferences: (preferences: Preference) => void;
    setSchedule: (schedule: Schedule) => void;
    removeSchedule: (diva: string, line: string, dir: string) => void;
}

const DEFAULT_COLORS = {
    red: "#ef4444",
    yellow: "#eab308",
    green: "#22c55e"
};

export const useUserPreferencesStore = create<UserPreferencesStore>()(
    persist(
        (set, get) => ({
            favourites: [],
            colors: DEFAULT_COLORS,
            schedules: [],
            setSignalColor: (key, color) => set((state) => ({
                colors: {
                    ...state.colors,
                    [key]: color
                }
            })),
            setFavourites: (diva) => set((state) => ({
                favourites: state.favourites.includes(diva)
                    ? state.favourites.filter((id) => id !== diva)
                    : [...state.favourites, diva]
            })),
            importPreferences: (preferences) => set(() => ({
                ...preferences
            })),
            setSchedule: (schedule) => set((state) => {
                const schedules = state.schedules || [];

                const existingIndex = schedules.findIndex(s =>
                    s.diva === schedule.diva &&
                    s.line === schedule.line &&
                    s.dir === schedule.dir
                );

                if (existingIndex >= 0) {
                    const updatedSchedules = [...schedules];
                    updatedSchedules[existingIndex] = schedule;
                    return {schedules: updatedSchedules};
                }
                return {schedules: [...schedules, schedule]};
            }),
            removeSchedule: (diva, line, dir) => set((state) => ({
                schedules: state.schedules?.filter(s =>
                    !(s.diva === diva && s.line === line && s.dir === dir)
                )
            }))
        }),
        {
            name: 'preferences',
        }
    )
);