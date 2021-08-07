import { Gen, Rng } from "../src";

describe('Gen.of', () => {
    it('can take simple primitives', () => {

        const initial = [undefined, null, true, false, 0, 1, 2, 'a', 'b', 'c', Symbol('test'), [], [1, 2, 3], { test: 12 }];
        initial.forEach(value => {
            const gen = Gen.of(value);
            const output = gen.effect(new Rng(), 0);
            expect(output).toEqual(value);
        })
    });
});

describe('Gen.map', () => {
    it('can map to other values', () => {
        const baseGen = Gen.of('test');
        const gen = baseGen.map(_ => 12);

        const value = gen.effect(new Rng(), 0);
        expect(value).toEqual(12);
    });

    it('can map values from effects to new values', () => {
        const randomInt = new Gen((r) => r.nextInt());
        const timesFour = randomInt.map(int => int * 4);

        const seed = Math.random() * 10000;
        expect(timesFour.effect(new Rng(seed), 0)).toEqual(randomInt.effect(new Rng(seed), 0) * 4);
    })

    it.todo('check the passing of sizes')
});

describe('Gen.flatMap', () => {
    it('can map to other generators', () => {
        const gen = Gen.of(4).flatMap(value => Gen.of(value * 100));

        const value = gen.effect(new Rng(), 0);
        expect(value).toEqual(400);
    })

    it('can map values from effects to new values', () => {
        const randomInt = new Gen((r) => r.nextInt());
        const sizedRandom = randomInt.flatMap(int => new Gen((r, n) => int * n));

        const seed = Math.random() * 10000;
        const sizes = new Array(100).fill(1).map(() => Math.floor(Math.random() * 10000000));
        sizes.forEach(s => {
            expect(sizedRandom.effect(new Rng(seed), s)).toEqual(randomInt.effect(new Rng(seed), 0) * s);
        });
    })
});