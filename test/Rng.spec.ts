import { Rng } from "../src";

describe('Rng.nextInt()', () => {
    it('returns the same output with the same seed', () => {
        const seed = Math.random() * 100000;
        const rngs = new Array(100).fill(1).map(() => new Rng(seed));

        const result = rngs.map(rng => rng.nextInt());
        expect(result[0]).toBeTruthy();
        result.forEach(value => {
            expect(value).toEqual(result[0]);
        })
    });

    it.todo('has no fractal part');
});

describe('Rng.nextRange()', () => {
    it('returns the same output with the same seed', () => {
        const seed = Math.random() * 100000;
        const rngs = new Array(100).fill(1).map(() => new Rng(seed));

        const result = rngs.map(rng => rng.nextRange(0, 100));
        expect(result[0]).toBeTruthy();
        expect(result[0]).toBeLessThan(100);
        expect(result[0]).toBeGreaterThanOrEqual(0);
        result.forEach(value => {
            expect(value).toEqual(result[0]);
        })
    });

    it.todo('has no fractal part')
});