import { Gen } from "..";
import { chooseInt } from "../utils";

export function genHex(): Gen<string> {
    return chooseInt(0, 255).map(val => val.toString(16));
}

export function genPercentage(): Gen<string> {
    return chooseInt(0, 100).map(val => val.toString() + '%');
}

export function genFraction(): Gen<number> {
    return chooseInt(0, 100).map(val => val / 100);
}