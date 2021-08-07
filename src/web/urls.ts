import { Gen } from "..";
import { genDate } from "../basic/dates";
import { elements, oneOf, sequenceJ, chooseInt } from "../utils";

export function uri(protocol: string, host: string, path?: string): Gen<URL> {
    return new Gen((r, n) => new URL(`${protocol}//${host}${path}`));
}

export function genProtocol() { return elements(['file:', 'http:', 'https:']); }
export function genHost() { return elements(['example.com', 'internal.test', 'special.text']); }

export function genPath() {
    return oneOf(
        genBlogPath()
    );

    function genBlogPath() {
        return sequenceJ(
            Gen.of('/blog/'),
            genDate(),
            Gen.of('/'),
            chooseInt(10 ** 9, 10 ** 10).map(n => n.toString())
        );
    }
}

export function genLocalizedPath() {
    return sequenceJ(
        elements(['/nl', '/de', '/en', '/fr']),
        genPath()
    );
}