import { create } from 'zustand';

interface LocationState {
    lat: number | null;
    lon: number | null;
    speed: number;
    error: Error | null;
    update: (data: any) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
    lat: null,
    lon: null,
    speed: 0,
    error: null,
    update: (data) => set({
        lat: data.coords?.latitude || null,
        lon: data.coords?.longitude || null,
        speed: data.coords?.speed ? Number((data.coords.speed * 3.6).toFixed(2)) : 0,
        error: data.error || null,
    }),
}));