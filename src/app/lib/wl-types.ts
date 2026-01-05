export type Haltepunkt = {
    StopID: string,
    DIVA: string,
    StopText: string,
    Municipality: string,
    MunicipalityID: string,
    Longitude: string,
    Latitude: string
}

export type Haltestelle = {
    DIVA: string,
    PlatformText: string,
    Municipality: string,
    MunicipalityID: string,
    Longitude: string,
    Latitude: string
}

export type Fahrwegverlauf = {
    LineID: string,
    PatternID: string,
    StopSeqCount: string,
    StopID: string,
    Direction: string
}

export type Linie = {
    LineID: string,
    LineText: string,
    SortingHelp: string,
    Realtime: string,
    MeansOfTransport: string
}