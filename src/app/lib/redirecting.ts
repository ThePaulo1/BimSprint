"use client"

import {useScheduleLocationStore} from "@/store/userScheduleLocationStore"
import {useLocationStore} from "@/store/userLocationStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import distance from "@turf/distance";

export function Redirecting() {
  const items = useScheduleLocationStore((state) => state.items)
  const location = useLocationStore()
  const router = useRouter()


    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const match = items.find((item) => {
        if(item.startTime && item.endTime)
        {
            const start = timeToMinutes(item.startTime)
            const end = timeToMinutes(item.endTime)
            return currentMinutes >= start && currentMinutes <= end
        } else if (item.lat && item.lon){

            const pointA: [number, number] = [item.lon, item.lat]; // turf uses [lon, lat]
            const pointB: [number, number] = [location.lon? location.lon : 0.0, location.lat? location.lat : 0.0];

            const distInKm = distance(pointA, pointB, { units: "kilometers" });

            return distInKm <= 0.1; // 0.1 km = 100 meters
            //introduce distance
        }
      
    })

    if (match) {
        let forward = `/monitor/${match.diva}?line=${match.line}&dir=${match.dir}`
        console.log(forward) 
        router.push(forward) 
    }
  
}


const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

