import type {Direction, LineEndstop} from "./Direction";

export type Line = {
    lineID: string;
    lineText?: string;
    directions: Direction[];
}