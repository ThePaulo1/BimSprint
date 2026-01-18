export type Haltestelle = {
    HALTESTELLEN_ID: string,
    TYP: string
    DIVA: string,
    NAME: string,
    GEMEINDE: string,
    GEMEINDE_ID: string,
    WGS84_LON: string,
    WGS84_LAT: string
    STAND: string
}

export type Steige = {
    STEIG_ID : string,
    FK_LINIEN_ID : string,
    FK_HALTESTELLEN_ID : string,
    RICHTUNG : string,
    REIHENFOLGE : string,
    RBL_NUMMER : string,
    BEREICH	: string,
    STEIG : string,
    STEIG_WGS84_LAT	: string,
    STEIG_WGS84_LON	: string,
    STAND : string
}

export type Linie = {
    LINIEN_ID: string,
    BEZEICHNUNG: string,
    REIHENFOLGE: string,
    ECHTZEIT: string,
    VERKEHRSMITTEL: string,
    STAND: string
}

