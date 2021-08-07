import { Gen, Rng, sequence, resize } from ".";

export function generate<T>(generator: Gen<T>, rng: Rng, n = 30): T {
    return generator.effect(rng, n);
}

export function sample<T>(generator: Gen<T>, rng: Rng, n = 30): T[] {
    return generate(sequence(...(new Array(10).fill(1).map((_, i) => resize(i * 2, generator)))), rng, n);
}