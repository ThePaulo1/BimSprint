export type Location = {
    lat: number;
    lon: number;
}

export type Direction = {
    dir: string;
    location: Location;
}

export type LineEndstop = {
    lineID: string;
    lineText: string;
    directions: DirectionEndstop[];
}

export type DirectionEndstop = {
    num: string;
    endstop: string;
}