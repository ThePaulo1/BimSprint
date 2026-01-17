import {parse} from "csv-parse/sync";
import * as fs from "fs";


import type {LineEndstop, Location} from "@/types/Direction";
import type {Stop} from "@/types/Stop";
import { Line } from "@/types/Line";
import type {Steige, Haltestelle, Linie} from "@/app/lib/wl-types/features";

import {setTimeout as sleep} from 'node:timers/promises';
import { setegid } from "node:process";


type CsvDataMap = {
    haltestellen: Haltestelle[];
    linien: Linie[];
    steige: Steige[];
}

type temp = {
    stopID: string;
    location: Location;
    linieID: string;
    richtung: string;
}

async function downloadCSV(url: string): Promise<string> {
    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Failed to download CSV: ${response.status} ${response.statusText}`);
    }

    return response.text();
}


function csvToJson(csvText: string) {
    const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        relax_quotes: true,
        trim: true,
        delimiter: ";"
    });

    return records;
}

function stops(dataStore: CsvDataMap) {
    let stops = new Array<Stop>();

    dataStore.haltestellen.forEach(haltestelle => {
        let stop: Stop = {
            diva: haltestelle.DIVA,
            stop: {
                name: haltestelle.NAME,
                location: {
                    lat: Number(haltestelle.WGS84_LAT),
                    lon: Number(haltestelle.WGS84_LON)
                }
            },
            lines: []
        }

        const temp: temp[] = [];
        dataStore.steige.forEach(steig => {
            if (haltestelle.HALTESTELLEN_ID == steig.FK_HALTESTELLEN_ID) {
                temp.push(
                    {
                        stopID: steig.STEIG_ID,
                        linieID: steig.FK_LINIEN_ID,
                        richtung: steig.RICHTUNG,
                        location: {
                            lat: Number(steig.STEIG_WGS84_LAT),
                            lon: Number(steig.STEIG_WGS84_LON)
                        }
                    }
                );
            }
        });

        dataStore.linien.forEach(linie => {
            const linieFromTemp = temp.find(item => item.linieID === linie.LINIEN_ID);
            if (!linieFromTemp) return;

            let lineTest = stop.lines.find(stop => stop.lineID === linie.LINIEN_ID);
            let line: Line; 
            if (!lineTest) {
                let lineText = linie.BEZEICHNUNG



                line = {
                    lineID: linie.LINIEN_ID,
                    lineText,
                    directions: []
                };

                stop.lines.push(line);

            } else{
                line = lineTest;
            }

            let targetDir = linieFromTemp.richtung
            const directionExists = line.directions.some(
                direction => direction.dir === targetDir
            );

            if (!directionExists) {
                line.directions.push({
                    dir: targetDir,
                    location: linieFromTemp.location
                });
            }
        });



        stops.push(stop);
    });

    fs.writeFileSync(
        "./src/data/stops.json",
        JSON.stringify(stops, null, 0),
        "utf-8"
    );
}

function lines(dataStore: CsvDataMap) {
    let lines = new Array<LineEndstop>();

    dataStore.steige.forEach(element => {
        if (Number(element.REIHENFOLGE) === 1) {

            let lineText: string | undefined;
            let endstop: string | undefined;

            for (const linie of dataStore.linien) {
                if (linie.LINIEN_ID === element.FK_LINIEN_ID) {
                    lineText = linie.BEZEICHNUNG;
                    break;
                }
            }

            const sameLine = dataStore.steige.filter(
                s => s.FK_LINIEN_ID === element.FK_LINIEN_ID
            )

            if (sameLine.length === 0) return null

            let minItem = sameLine.reduce((max, current) => {
                return Number(current.REIHENFOLGE) < Number(max.REIHENFOLGE) && current.RICHTUNG === max.RICHTUNG
                ? current
                : max
            })

            let maxItem = sameLine.reduce((max, current) => {
                return Number(current.REIHENFOLGE) > Number(max.REIHENFOLGE) && current.RICHTUNG === max.RICHTUNG
                ? current
                : max
            })

            if(element.RICHTUNG === "H"){
                endstop = dataStore.haltestellen.find(line => line.HALTESTELLEN_ID === maxItem.FK_HALTESTELLEN_ID)?.NAME;

            } else {
                endstop = dataStore.haltestellen.find(line => line.HALTESTELLEN_ID === minItem.FK_HALTESTELLEN_ID)?.NAME;

            }

            if (lineText == undefined || endstop == undefined) {
                return;
            }

            if (lines.some(line => line.lineID === element.FK_LINIEN_ID)) {
                let line = lines.find(line => line.lineID === element.FK_LINIEN_ID);

                if (line == undefined) {
                    return;
                }

                line.directions.push({
                    num: element.RICHTUNG,
                    endstop
                });
            } else {
                lines.push({
                    lineID: element.FK_LINIEN_ID,
                    lineText,
                    directions: [
                        {
                            num: element.RICHTUNG,
                            endstop
                        }
                    ]
                })
            }
        }

    });

    fs.writeFileSync(
        "./src/data/lines.json",
        JSON.stringify(lines, null, 0),
        "utf-8"
    );
}

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000;
let attempt = 0
const delay = RETRY_DELAY_MS * attempt;

while (attempt < MAX_RETRIES) {
    try {
        const csvBaseUrl = "https://data.wien.gv.at/csv/wienerlinien-ogd-";

        const dataStore: CsvDataMap = {
            haltestellen: [],
            steige: [],
            linien: [],
        };

        const fileNamens = [
            "haltestellen",
            "linien",
            "steige",
        ];

        for (const fileName of fileNamens) {
            const csvUrl = csvBaseUrl + fileName + ".csv";
            const csvText = await downloadCSV(csvUrl);
            const jsonData = csvToJson(csvText);

            if (fileName === "haltestellen") {
                dataStore.haltestellen = jsonData as Haltestelle[];
            } else if (fileName === "steige") {
                dataStore.steige = jsonData as Steige[];
            } else {
                dataStore.linien = jsonData as Linie[];
            }
        }

        stops(dataStore);
        lines(dataStore);

        console.log("✅ Successfully downloaded lines & stops from Wiener Linien");
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