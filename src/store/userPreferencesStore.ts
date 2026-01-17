import {create} from 'zustand';
import {Preference, PreferenceSchema} from "@/app/lib/utils";
import {persist} from "zustand/middleware";

type UserPreferencesStore = Preference & {
    setSignalColor: (key: "red" | "yellow" | "green", color: string) => void;
    getPreferences: () => Preference | undefined;
    setPreferences: (preferences: Preference) => void;
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
            setSignalColor: (key: 'red' | 'yellow' | 'green', color: string) => {
                if (typeof window === 'undefined') return;

                const preferences = get().getPreferences();
                if (!preferences) return;

                preferences.colors[key] = color;
                set({colors: preferences.colors});
                get().setPreferences(preferences);
            },
            getPreferences: () => {
                if (typeof window === 'undefined') return;

                const raw = localStorage.getItem('bimsprint_preferences')
                if (!raw) return;

                const json = JSON.parse(raw);
                return PreferenceSchema.parse(json);
            },
            setPreferences: (preferences: Preference) => {
                if (typeof window === 'undefined') return;

                localStorage.setItem('bimsprint_preferences', JSON.stringify(preferences))
            },
        }),
        {
            name: 'preferences',
        }
    )
);