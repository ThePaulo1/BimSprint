import {setTimeout as sleep} from 'node:timers/promises';
import * as fs from "fs";

export interface ApiResponse {
  data: {
    monitors: Monitor[];
  };
}

export interface Monitor {
  lines: Line[];
}

export interface Line {
  lineId: number; 
  richtungsId: string;
  departures: Departures;
}

export interface Departures {
  departure: Departure[];
}

export interface Departure {
  departureTime: DepartureTime;
}

export interface DepartureTime {
  timeReal: string;
}




export async function apiHandlerCore(diva: string, lineNum: string, direction: string ) : Promise<string[]>{
    let apiBase: string = "https://www.wienerlinien.at/ogd_realtime/monitor?diva=" + diva
    console.log(apiBase);

    const response = await fetch(apiBase, {
        cache: "no-store"
    });


    if (!response.ok) {
        console.log("error");
        throw new Error(`Failed to get the data: ${response.status} ${response.statusText}`);
    }

    let content :ApiResponse = await response.json();
    let monitors = content.data.monitors;

    for (const monitor of content.data.monitors) {
        for (const line of monitor.lines) {
            if (
                line.lineId === Number(lineNum) &&
                line.richtungsId === direction
            ) {

                return line.departures.departure.map(
                d => d.departureTime.timeReal
                );
            }
        }
    }
    return new Array<string>;
}


export async function apiHandler(diva: string, lineNum: string, direction: string ) : Promise<string[]>{
    const MAX_RETRIES = 3
    const RETRY_DELAY_MS = 1000;
    let attempt = 0


    while (attempt < MAX_RETRIES) {
        try {
            let data = await apiHandlerCore(diva, lineNum, direction);
            
            return (data);
        } catch (err) {
            const delay = RETRY_DELAY_MS * attempt;
            if (attempt + 1 === MAX_RETRIES) {

                process.exit(1);
            } else {
                console.error("❌ Could not download data from Wiener Linien - Retrying in " + delay, err);
                attempt++
                await sleep(delay);
            }
        }
    }
    return new Array<string>;
}

let data = await apiHandler("60200001", "111", "2");
console.log(data);