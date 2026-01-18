import {create} from 'zustand';
import {persist} from "zustand/middleware";
import {z} from "zod";
import {PreferenceSchema} from "@/components/ImportButton";

type Preference = z.infer<typeof PreferenceSchema>;

type UserPreferencesStore = Preference & {
    setSignalColor: (key: "red" | "yellow" | "green", color: string) => void;
    setFavourites: (diva: string) => void;
    importPreferences: (preferences: Preference) => void;
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
                colors: preferences.colors,
                favourites: preferences.favourites
            })),
        }),
        {
            name: 'preferences',
        }
    )
);