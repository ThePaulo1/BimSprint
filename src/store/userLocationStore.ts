import { create } from 'zustand';

interface LocationState {
    lat: number | null;
    lon: number | null;
    speed: number;
    error: Error | null;
    update: () => void;
}

export const useUserLocationStore = create<LocationState>((set) => ({
    lat: null,
    lon: null,
    speed: 0,
    error: null,
    update: () => {
        if (typeof window === 'undefined') return;
        navigator.geolocation.watchPosition(
            (position) => {
                set({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    speed: position.coords.speed ? Number((position.coords.speed * 3.6).toFixed(2)) : 0
                });
            },
            (err) => {
                console.error("GPS Error:", err.code, err.message);
            },
            { enableHighAccuracy: true }
        );
    }
}));