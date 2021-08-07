import { Gen } from "..";
import { chooseInt, sequenceJ } from "../utils";
import { genFraction, genHex, genPercentage } from "../basic/numbers";

export function genHexColor(): Gen<string> {
    return sequenceJ(
        Gen.of('#'),
        genHex(), genHex(), genHex()
    );
}

export function genRgbColor(): Gen<string> {
    return sequenceJ(
        Gen.of('rgb('),
        chooseInt(0, 255),
        Gen.of(', '),
        chooseInt(0, 255),
        Gen.of(', '),
        chooseInt(0, 255),
        Gen.of(')')
    );
}

export function genRgbaColor(): Gen<string> {
    return sequenceJ(
        Gen.of('rgba('),
        chooseInt(0, 255),
        Gen.of(', '),
        chooseInt(0, 255),
        Gen.of(', '),
        chooseInt(0, 255),
        Gen.of(', '),
        genFraction(),
        Gen.of(')')
    );
}

export function genHslColor(): Gen<string> {
    return sequenceJ(
        Gen.of('hsl('),
        chooseInt(0, 360),
        Gen.of(', '),
        genPercentage(),
        Gen.of(', '),
        genPercentage(),
        Gen.of(')')
    );
}

export function genHslaColor(): Gen<string> {
    return sequenceJ(
        Gen.of('hsl('),
        chooseInt(0, 360),
        Gen.of(', '),
        genPercentage(),
        Gen.of(', '),
        genPercentage(),
        Gen.of(', '),
        genFraction(),
        Gen.of(')')
    );
}