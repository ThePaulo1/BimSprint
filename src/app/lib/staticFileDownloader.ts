import {parse} from "csv-parse/sync";
import * as fs from "fs";
import type {LineEndstop, Location} from "@/types/Direction";
import type {Stop} from "@/types/Stop";
import type {Fahrwegverlauf, Haltepunkt, Haltestelle, Linie} from "./wl-types";
import {setTimeout as sleep} from 'node:timers/promises';

type CsvDataMap = {
    haltepunkte: Haltepunkt[];
    haltestellen: Haltestelle[];
    fahrwegverlaeufe: Fahrwegverlauf[];
    linien: Linie[];
}

type temp = {
    stopID: string;
    location: Location;
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
                name: haltestelle.PlatformText,
                location: {
                    lat: Number(haltestelle.Latitude),
                    lon: Number(haltestelle.Longitude)
                }
            },
            lines: []
        }

        const temp: temp[] = [];
        dataStore.haltepunkte.forEach(haltepunkte => {
            if (haltestelle.DIVA == haltepunkte.DIVA) {
                temp.push(
                    {
                        stopID: haltepunkte.StopID,
                        location: {
                            lat: Number(haltepunkte.Latitude),
                            lon: Number(haltepunkte.Longitude)
                        }
                    }
                );
            }
        });

        dataStore.fahrwegverlaeufe.forEach(fahrwegverlauf => {
            const stopFromTemp = temp.find(item => item.stopID === fahrwegverlauf.StopID);
            if (!stopFromTemp) return;

            let lineTest = stop.lines.find(line => line.lineID === fahrwegverlauf.LineID);

            // if line does NOT exist → create it
            if (!lineTest) {
                let lineText: string | undefined;

                for (const linie of dataStore.linien) {
                    if (linie.LineID === fahrwegverlauf.LineID) {
                        lineText = linie.LineText;
                        break;
                    }
                }

                lineTest = {
                    lineID: fahrwegverlauf.LineID,
                    lineText,
                    directions: []
                };

                stop.lines.push(lineTest);

            }

            // line already exists here (found or created)

            const directionExists = lineTest.directions.some(
                direction => direction.num === fahrwegverlauf.Direction
            );

            if (!directionExists) {
                lineTest.directions.push({
                    num: fahrwegverlauf.Direction,
                    location: stopFromTemp.location
                });
            }

        });

        stops.push(stop);
    });

    fs.writeFileSync(
        "./public/stops.json",
        JSON.stringify(stops, null, 0),
        "utf-8"
    );
}

function lines(dataStore: CsvDataMap) {
    let lines = new Array<LineEndstop>();

    dataStore.fahrwegverlaeufe.forEach(element => {
        if (Number(element.PatternID) <= 2 && Number(element.StopSeqCount) === 0) {

            let lineText: string | undefined;
            let endstop: string | undefined;

            for (const linie of dataStore.linien) {
                if (linie.LineID === element.LineID) {
                    lineText = linie.LineText;
                    break;
                }
            }

            const maxItem = dataStore.fahrwegverlaeufe
                .filter(item => item.StopID === element.StopID)
                .reduce((max, current) =>
                    Number(current) > Number(max) ? current : max
                );

            endstop = dataStore.haltepunkte.find(line => line.StopID === maxItem.StopID)?.StopText;

            if (lineText == undefined || endstop == undefined) {
                return;
            }

            if (lines.some(line => line.lineID === element.LineID)) {
                let line = lines.find(line => line.lineID === element.LineID);

                if (line == undefined) {
                    return;
                }

                line.directions.push({
                    num: element.Direction,
                    endstop
                });
            } else {
                lines.push({
                    lineID: element.LineID,
                    lineText,
                    directions: [
                        {
                            num: element.Direction,
                            endstop
                        }
                    ]
                })
            }
        }

    });

    fs.writeFileSync(
        "./public/lines.json",
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
        const csvBaseUrl = "https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-";

        const dataStore: CsvDataMap = {
            haltepunkte: [],
            haltestellen: [],
            fahrwegverlaeufe: [],
            linien: [],
        };

        const fileNamens = [
            "haltepunkte",
            "haltestellen",
            "fahrwegverlaeufe",
            "linien",
        ];

        for (const fileName of fileNamens) {
            const csvUrl = csvBaseUrl + fileName + ".csv";
            const csvText = await downloadCSV(csvUrl);
            const jsonData = csvToJson(csvText);

            if (fileName === "haltepunkte") {
                dataStore.haltepunkte = jsonData as Haltepunkt[];
            } else if (fileName === "haltestellen") {
                dataStore.haltestellen = jsonData as Haltestelle[];
            } else if (fileName === "fahrwegverlaeufe") {
                dataStore.fahrwegverlaeufe = jsonData as Fahrwegverlauf[];
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
            await sleep(delay);
        }
    }
}