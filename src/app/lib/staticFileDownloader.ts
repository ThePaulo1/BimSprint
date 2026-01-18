import { parse } from "csv-parse/sync";
import * as fs from "fs";
import { setTimeout as sleep } from 'node:timers/promises';

// Types
import type { LineEndstop, Location } from "@/types/Direction";
import type { Stop } from "@/types/Stop";
import type { Line } from "@/types/Line";
import type { Haltestelle, Linie, Steige } from "@/app/lib/wl-types/features";

// --- CONFIGURATION ---
const URL_BASE = "https://data.wien.gv.at/csv/wienerlinien-ogd-";
const FILES = ["haltestellen", "linien", "steige"] as const;
const OUTPUT_DIR = "./src/data";

// --- HELPER TYPES ---
type SteigeGroupedByStop = Map<string, Steige[]>; // Key: HALTESTELLEN_ID
type SteigeGroupedByLine = Map<string, Steige[]>; // Key: LINIEN_ID
type LinieMap = Map<string, Linie>; // Key: LINIEN_ID
type StopMap = Map<string, Haltestelle>; // Key: HALTESTELLEN_ID

async function downloadCSV(url: string): Promise<string> {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    return response.text();
}

function parseCsv<T>(csvText: string): T[] {
    return parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        relax_quotes: true,
        trim: true,
        delimiter: ";",
    });
}

/**
 * PRE-PROCESSING: Create Lookup Maps to make the main logic O(1) instead of O(N^2)
 */
function indexData(
    haltestellen: Haltestelle[],
    linien: Linie[],
    steige: Steige[]
) {
    const stopMap: StopMap = new Map();
    haltestellen.forEach(h => stopMap.set(String(h.HALTESTELLEN_ID), h));

    const lineMap: LinieMap = new Map();
    linien.forEach(l => lineMap.set(String(l.LINIEN_ID), l));

    const steigeByStop: SteigeGroupedByStop = new Map();
    const steigeByLine: SteigeGroupedByLine = new Map();

    steige.forEach(s => {
        // Group by Stop ID
        const stopKey = String(s.FK_HALTESTELLEN_ID);
        if (!steigeByStop.has(stopKey)) steigeByStop.set(stopKey, []);
        steigeByStop.get(stopKey)!.push(s);

        // Group by Line ID
        const lineKey = String(s.FK_LINIEN_ID);
        if (!steigeByLine.has(lineKey)) steigeByLine.set(lineKey, []);
        steigeByLine.get(lineKey)!.push(s);
    });

    return { stopMap, lineMap, steigeByStop, steigeByLine };
}

/**
 * GENERATE STOPS.JSON
 */
function generateStops(
    haltestellen: Haltestelle[],
    steigeByStop: SteigeGroupedByStop,
    lineMap: LinieMap
) {
    const result: Stop[] = [];

    // Iterate every stop once
    for (const h of haltestellen) {
        const stopId = String(h.HALTESTELLEN_ID);

        // 1. Basic Stop Info
        const stop: Stop = {
            diva: h.DIVA,
            stop: {
                name: h.NAME,
                location: {
                    lat: Number(h.WGS84_LAT),
                    lon: Number(h.WGS84_LON)
                }
            },
            lines: []
        };

        // 2. Get all platforms (Steige) for this stop using the Lookup Map
        const relevantSteige = steigeByStop.get(stopId);

        if (relevantSteige) {
            // We use a Map to ensure we only add each Line once per stop,
            // but we can merge multiple directions into that single line entry.
            const linesForThisStop = new Map<string, Line>();

            for (const s of relevantSteige) {
                const lineId = String(s.FK_LINIEN_ID);
                const lineInfo = lineMap.get(lineId);

                if (!lineInfo) continue;

                // Create Line entry if not exists
                if (!linesForThisStop.has(lineId)) {
                    linesForThisStop.set(lineId, {
                        lineID: lineInfo.LINIEN_ID,
                        lineText: lineInfo.BEZEICHNUNG,
                        directions: []
                    });
                }

                const lineEntry = linesForThisStop.get(lineId)!;

                // Check if direction exists
                const dirExists = lineEntry.directions.some(d => d.dir === s.RICHTUNG);
                if (!dirExists) {
                    lineEntry.directions.push({
                        dir: s.RICHTUNG,
                        location: {
                            lat: Number(s.STEIG_WGS84_LAT),
                            lon: Number(s.STEIG_WGS84_LON)
                        }
                    });
                }
            }

            stop.lines = Array.from(linesForThisStop.values());
        }

        result.push(stop);
    }

    fs.writeFileSync(`${OUTPUT_DIR}/stops.json`, JSON.stringify(result), "utf-8");
    console.log(`   📝 Wrote ${result.length} stops to stops.json`);
}

/**
 * GENERATE LINES.JSON
 */
function generateLines(
    lineMap: LinieMap,
    steigeByLine: SteigeGroupedByLine,
    stopMap: StopMap
) {
    const result: LineEndstop[] = [];

    // Iterate through every Line we know about
    for (const [lineId, steigeList] of steigeByLine.entries()) {
        const lineInfo = lineMap.get(lineId);
        if (!lineInfo) continue;

        // Group Steige by Direction (usually "H" and "R")
        // Logic: For every direction, sort by REIHENFOLGE. Last item is the Destination.
        const directions = new Map<string, Steige[]>();

        steigeList.forEach(s => {
            if (!directions.has(s.RICHTUNG)) directions.set(s.RICHTUNG, []);
            directions.get(s.RICHTUNG)!.push(s);
        });

        const lineDirections: { num: string; endstop: string }[] = [];

        for (const [dir, steigeInDir] of directions.entries()) {
            if (steigeInDir.length === 0) continue;

            // Sort by Order (1, 2, 3...)
            steigeInDir.sort((a, b) => Number(a.REIHENFOLGE) - Number(b.REIHENFOLGE));

            // The last stop in the sequence is typically the "Destination" (Endstop)
            const lastSteig = steigeInDir[steigeInDir.length - 1];
            const endStopName = stopMap.get(String(lastSteig.FK_HALTESTELLEN_ID))?.NAME;

            if (endStopName) {
                lineDirections.push({
                    num: dir,
                    endstop: endStopName
                });
            }
        }

        if (lineDirections.length > 0) {
            result.push({
                lineID: lineInfo.LINIEN_ID,
                lineText: lineInfo.BEZEICHNUNG,
                directions: lineDirections
            });
        }
    }

    fs.writeFileSync(`${OUTPUT_DIR}/lines.json`, JSON.stringify(result), "utf-8");
    console.log(`   📝 Wrote ${result.length} lines to lines.json`);
}

// --- MAIN EXECUTION ---
async function main() {
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            console.log(`🔄 Attempt ${attempt + 1}: Downloading CSVs...`);

            // 1. Parallel Download
            const promises = FILES.map(file => downloadCSV(`${URL_BASE}${file}.csv`));
            const [rawHaltestellen, rawLinien, rawSteige] = await Promise.all(promises);

            console.log("   ✅ Download complete. Parsing...");

            // 2. Parse
            const haltestellen = parseCsv<Haltestelle>(rawHaltestellen);
            const linien = parseCsv<Linie>(rawLinien);
            const steige = parseCsv<Steige>(rawSteige);

            // 3. Indexing (The Optimization Magic)
            console.log("   ⚡ Indexing data...");
            const indexes = indexData(haltestellen, linien, steige);

            // 4. Generate Files
            generateStops(haltestellen, indexes.steigeByStop, indexes.lineMap);
            generateLines(indexes.lineMap, indexes.steigeByLine, indexes.stopMap);

            console.log("✅ Success! Exiting.");
            process.exit(0);

        } catch (err) {
            attempt++;
            console.error(`❌ Error (Attempt ${attempt}/${MAX_RETRIES}):`, err);

            if (attempt >= MAX_RETRIES) {
                console.error("❌ Max retries reached. Aborting.");
                process.exit(1);
            }

            const delay = 1000 * attempt;
            console.log(`   ⏳ Retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
}

await main();