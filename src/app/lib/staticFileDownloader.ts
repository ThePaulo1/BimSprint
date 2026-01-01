import { parse } from "csv-parse/sync";
import * as fs from "fs";

type Haltepunkt = {
    StopID: string,
    DIVA: string,
    StopText: string,
    Municipality: string,
    MunicipalityID: string,
    Longitude: string,
    Latitude: string
}
type Haltestelle = {

    DIVA: string,
    PlatformText: string,
    Municipality: string,
    MunicipalityID: string,
    Longitude: string,
    Latitude: string

}
type Fahrwegverlauf = {
    LineID: string,
    PatternID: string,
    StopSeqCount: string,
    StopID: string,
    Direction: string
}
type Linie = {

    LineID: string,
    LineText: string,
    SortingHelp: string,
    Realtime: string,
    MeansOfTransport: string
}
type CsvDataMap = {
    haltepunkte: Haltepunkt[];
    haltestellen: Haltestelle[];
    fahrwegverlaeufe: Fahrwegverlauf[];
    linien: Linie[];
};
type Location = {
    lat: number;
    lon: number;
};
type Direction = {
    num: string;
    location: Location;
};
type Line = {
    lineID: string;
    lineText?: string;
    directions: Direction[];
};

type LineEndstop = {
    lineID: string;
    lineText: string;
    directions: DirectionEndstop[];
};
type DirectionEndstop = {
    num: string;
    endstop: string;
}

type Stop = {
    name: string;
    location: Location;
};
type StopEntry = {
    diva: string;
    stop: Stop;
    lines: Line[];
};
type StopsCollection = {
    stops: StopEntry[];
};
type LinesCollection = {
    lines: LineEndstop[];
}
type temp = {
    stopID: string;
    location: Location;
}


async function downloadCSV(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download CSV: ${response.statusText}`);
  }

  return await response.text();
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

function stops(dataStore: CsvDataMap){
    const stopsCollection: StopsCollection = {
        stops: []
    };


    dataStore.haltestellen.forEach(hs => {
        let stop: StopEntry = {
            diva: hs.DIVA,
            stop: {
                name: hs.PlatformText,
                location: {
                    lat: Number(hs.Latitude),
                    lon: Number(hs.Latitude)
                }
            },
            lines: []
        }

        const temp: temp[] = [];
        dataStore.haltepunkte.forEach(hp => {
            if(hs.DIVA == hp.DIVA){
                temp.push(
                    {
                        stopID : hp.StopID, 
                        location: {
                            lat: Number(hp.Latitude), 
                            lon: Number(hp.Longitude)
                        }
                    }
                );
            }
        });

        dataStore.fahrwegverlaeufe.forEach(fwv => {
        
            const stopFromTemp = temp.find(item => item.stopID === fwv.StopID);
            if (!stopFromTemp) return;


            let line = stop.lines.find(l => l.lineID === fwv.LineID);

            // if line does NOT exist → create it
            if (!line) {
                let lineText: string | undefined;

                for (const linie of dataStore.linien) {
                    if (linie.LineID === fwv.LineID) {
                        lineText = linie.LineText;
                        break;
                    }
                }

                line = {
                    lineID: fwv.LineID,
                    lineText,
                    directions: []
                };

                stop.lines.push(line);

            }

            // line already exists here (found or created)

            const directionExists = line.directions.some(
                d => d.num === fwv.Direction
            );

            if (!directionExists) {
                line.directions.push({
                    num: fwv.Direction,
                    location: stopFromTemp.location
                });
            }

        });

        dataStore.linien.forEach(li => {
            //if(li.)

            let item = {
                lineID: li.LineID,
                directions: []
            }

        });

        stopsCollection.stops.push(stop);
    });

    const data = stopsCollection; // or whatever object you want

    fs.writeFileSync(
        "./public/stops.json",
        JSON.stringify(data, null, 4),
        "utf-8"
    );
}

function lines(dataStore: CsvDataMap){

    let linesCollection: LinesCollection = {
        lines: []
    }

    dataStore.fahrwegverlaeufe.forEach(element => {
        if(Number(element.PatternID) <= 2 && Number(element.StopSeqCount) === 0){

            let ltTextFill : string | undefined;
            let hpFill : string | undefined;

            for (const linie of dataStore.linien) {
                if (linie.LineID === element.LineID) {
                    ltTextFill = linie.LineText;
                    break;
                }
            }


            const maxItem = dataStore.fahrwegverlaeufe
                .filter(item => item.StopID === element.StopID)
                .reduce((max, current) =>
                    Number(current) > Number(max) ? current : max
                );

            hpFill = dataStore.haltepunkte.find(line => line.StopID === maxItem.StopID)?.StopText; 

            if(ltTextFill == undefined || hpFill == undefined){
                console.log(ltTextFill);
                console.log(hpFill);
                return;
            }


            if(linesCollection.lines.some(line => line.lineID === element.LineID)){
                console.log("found a line");
                let line = linesCollection.lines.find(line => line.lineID === element.LineID);
                
                
                if(line == undefined){
                    console.log("undefined");
                    return;
                } 
                

                line.directions.push({
                    num: element.Direction,
                    endstop: hpFill
                });
            } else{

                linesCollection.lines.push({
                    lineID: element.LineID,
                    lineText: ltTextFill,
                    directions: [
                        {
                            num: element.Direction,
                            endstop: hpFill
                        }
                    ]
                })
            }
        }

    });

    const data = linesCollection; // or whatever object you want

    fs.writeFileSync(
        "./public/lines.json",
        JSON.stringify(data, null, 4),
        "utf-8"
    );
}

async function main() {
    const csvUrlMainpart = "https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-";

    type CsvKey = typeof csvUrls[number];
    const dataStore: CsvDataMap = {
        haltepunkte: [],
        haltestellen: [],
        fahrwegverlaeufe: [],
        linien: [],
    };
    
    const csvUrls = [
        "haltepunkte",
        "haltestellen",
        "fahrwegverlaeufe",
        "linien",
    ] as const;


    for (let index = 0; index < csvUrls.length; index++) {
        const element = csvUrls[index];

        const csvUrl = csvUrlMainpart + element + ".csv";
        const csvText = await downloadCSV(csvUrl);
        const jsonData = csvToJson(csvText);

        if (element === "haltepunkte") {
            dataStore.haltepunkte = jsonData as Haltepunkt[];
        } else if (element === "haltestellen") {
            dataStore.haltestellen = jsonData as Haltestelle[];
        } else if (element === "fahrwegverlaeufe") {
            dataStore.fahrwegverlaeufe = jsonData as Fahrwegverlauf[];
        } else if (element === "linien") {
            dataStore.linien = jsonData as Linie[];
        }        
    }

    stops(dataStore);
    lines(dataStore);
}

main().catch(console.error);
