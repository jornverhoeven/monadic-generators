import { Rng } from "./Rng";

export type Effect<T> = (rng: Rng, size: number) => T;

export class Gen<T> {
    constructor(public readonly effect: Effect<T>) { }

    static of<O>(val: O) {
        return new Gen(() => val);
    }
    map<O>(f: (val: T) => O): Gen<O> {
        return new Gen((r, n) => f(this.effect(r, n)));
    }
    flatMap<O>(f: (val: T) => Gen<O>): Gen<O> {
        return new Gen((r, n) => f(this.effect(r, n)).effect(r, n));
    }
    '>>=': <O>(f: (val: T) => Gen<O>) => Gen<O> = function(this: Gen<T>, f) {
        return new Gen((r, n) => f(this.effect(r, n)).effect(r, n));
    }
}