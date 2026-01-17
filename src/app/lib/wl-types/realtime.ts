export interface ApiResponse {
    data: {
        monitors: Monitor[];
    };
}

export type Monitor = {
    locationStop: {
        properties: {
            title: string;
        }
    }
    lines: Line[];
}

type Line = {
    name: string;
    towards: string;
    lineId: number;
    richtungsId: string;
    departures: Departures;
}

type Departures = {
    departure: Departure[];
}

type Departure = {
    departureTime: DepartureTime;
}

type DepartureTime = {
    timeReal: string;
}