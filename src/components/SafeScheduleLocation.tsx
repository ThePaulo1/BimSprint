"use client"

import {useScheduleStore} from "@/store/userScheduleLocationStore"
import {useLocationStore} from "@/store/userLocationStore";
import {useShallow} from "zustand/react/shallow";


import {useSearchParams} from "next/navigation"

import {TimePicker} from "@mantine/dates"
import {useState} from "react"


interface MetricsProps {
    diva: string;
}

export default function SafeTime({diva}: MetricsProps) {
      

    const {lat, lon} = useLocationStore(useShallow((s) => ({lat: s.lat, lon: s.lon, speed: s.speed})));
    const searchParams = useSearchParams()

    const line = searchParams.get("line") ?? ""
    const dir = searchParams.get("dir") ?? ""

    const [startTime, setStartTime] = useState<string>("")
    const [endTime, setEndTime] = useState<string>("")
    const [resultMessage, setResultMessage] = useState("");


    const { items, addItem } = useScheduleStore()

    const handleScheduleSafe = () => {
        console.log("trying to save");
        if (diva && line && dir && startTime && endTime) {
            setResultMessage("Saved"); // <-- React state instead of DOM
            addItem({ diva, line, dir, startTime, endTime });
        } else {
            setResultMessage("An error occurred");
        }
    };  

    const handleLocationSafe = () => {
        console.log("trying to save");
        if (diva && line && dir && lat && lon) {
            setResultMessage("Saved");
            addItem({ diva, line, dir, lat, lon });
        } else {
            setResultMessage("An error occurred");
        }
    };


    return (
        
        <div className="flex flex-col gap-4 max-w-sm">

            
            <TimePicker
                label="Start time"
                value={startTime}
                onChange={setStartTime}
            />

            <TimePicker
                label="End time"
                value={endTime}
                onChange={setEndTime}
            />
            

                    
            <button onClick={handleScheduleSafe}>
                Save Time
            </button>
            <button onClick={handleLocationSafe}>
                Save Location
            </button>
            <p id="result">{resultMessage}</p>

        </div>
  );
}