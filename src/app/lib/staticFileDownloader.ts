import { parse } from "csv-parse/sync";
import * as fs from "fs";
import next from "next";


// These names are to stay since they are given as such by the Wiener Linien.
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

type StopDetails = {
    name: string;
    location: Location;
};
type Stop = {
    diva: string;
    stop: StopDetails;
    lines: Line[];
};
type Stops = {
    stops: Stop[];
};
type Lines = {
    lines: LineEndstop[];
}
type temp = {
    stopID: string;
    location: Location;
}


export async function downloadCSV(url: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store" // prevents Next from caching the    CSV
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

function stops(dataStore: CsvDataMap){
    const stopsCollection: Stops = {
        stops: []
    };


    dataStore.haltestellen.forEach(haltestelle => {
        let stop: Stop = {
            diva: haltestelle.DIVA,
            stop: {
                name: haltestelle.PlatformText,
                location: {
                    lat: Number(haltestelle.Latitude),
                    lon: Number(haltestelle.Latitude)
                }
            },
            lines: []
        }

        const temp: temp[] = [];
        dataStore.haltepunkte.forEach(haltepunkte => {
            if(haltestelle.DIVA == haltepunkte.DIVA){
                temp.push(
                    {
                        stopID : haltepunkte.StopID, 
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
                d => d.num === fahrwegverlauf.Direction
            );

            if (!directionExists) {
                lineTest.directions.push({
                    num: fahrwegverlauf.Direction,
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
        JSON.stringify(data, null, 0),
        "utf-8"
    );
}

function lines(dataStore: CsvDataMap){

    let linesCollection: Lines = {
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
                return;
            }


            if(linesCollection.lines.some(line => line.lineID === element.LineID)){
                let line = linesCollection.lines.find(line => line.lineID === element.LineID);
                
                
                if(line == undefined){
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
        JSON.stringify(data, null, 0),
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
