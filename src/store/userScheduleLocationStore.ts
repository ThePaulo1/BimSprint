import { create } from "zustand"
import { persist } from "zustand/middleware"

type ScheduleLocationItem = {
  diva: string
  line: string
  dir: string
  startTime?: string | null
  endTime?: string | null
  lon?: number | null
  lat?: number | null
}

type ScheduleLocationItemStore = {
  items: ScheduleLocationItem[]
  addItem: (item: ScheduleLocationItem) => void
}


export const useScheduleStore = create(
  persist<ScheduleLocationItemStore>(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
    }),
    {
      name: "schedule-storage", // key in localStorage
    }
  )
)

