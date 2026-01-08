//Get information - stop & line & direction
// Filter out stuff to the 

import {setTimeout as sleep} from 'node:timers/promises';

export async function apiHandler(diva: String, line: String, direction: String ){
    let apiBase: string = "https://www.wienerlinien.at/ogd_realtime/monitor?" + diva
    

    const response = await fetch(apiBase, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Failed to download CSV: ${response.status} ${response.statusText}`);
    }

    console.log(response.json);

    let array = new Array<Int16Array> ();
    return array;
}


const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000;
let attempt = 0
const delay = RETRY_DELAY_MS * attempt;

while (attempt < MAX_RETRIES) {
    try {
        apiHandler("", "", "");
        

            

        console.log("✅ Successfully gat");
        process.exit(0);
    } catch (err) {
        if (attempt + 1 === MAX_RETRIES) {
            process.exit(1);
        } else {
            console.error("❌ Could not download data from Wiener Linien - Retrying in " + delay, err);
            attempt++
            await sleep(delay);
        }
    }
}