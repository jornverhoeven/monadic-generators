import { Gen } from "..";
import { sequence, chooseInt } from "../utils";

export function genDateTime(): Gen<Date> {
    return sequence(
        chooseInt(1980, 2040),
        chooseInt(0, 11),
        chooseInt(1, 31),
        chooseInt(0, 23),
        chooseInt(0, 59),
        chooseInt(0, 59),
        chooseInt(0, 999)
    ) ['>>='] (([yyyy, mm, dd, h, m, s, ms]) => Gen.of(new Date(yyyy, mm, dd, h, m, s, ms)));
}

export function genDate(): Gen<string> {
    return genDateTime().map(d => d.toISOString().substr(0, 10));
}