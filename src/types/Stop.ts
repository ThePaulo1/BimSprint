import type {Line} from "./Line";
import type {Location} from "./Direction";

export type StopDetails = {
    name: string;
    location: Location;
}

export type Stop = {
    diva: string;
    stop: StopDetails;
    lines: Line[];
}