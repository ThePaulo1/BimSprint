export interface ApiResponse {
    data: {
        monitors: Monitor[];
    };
}

type Monitor = {
    lines: Line[];
}

type Line = {
    lineId: number;
    direction: string;
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