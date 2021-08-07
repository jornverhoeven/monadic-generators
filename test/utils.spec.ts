import { chooseInt, Gen, oneOf, resize, Rng, sequence, sequenceJ, sized, suchThat, suchThatMap, suchThatMaybe } from "../src";
import { generate } from "../src/output";

const REPEAT = 10000;


function repeatTimes(n: number, fn: () => void) {
    let i = 0;
    while (i++ <= n) {
        fn();
    }
}

function isEven(x: number): boolean {
    return x % 2 === 0;
}

describe('sized', () => {
    it('can be used as a scalar for numbers', () => {
        const gen = sized(n => Gen.of(n * 10));

        repeatTimes(REPEAT, () => {
            const size = Math.floor(Math.random() * 100000);
            const output = generate(gen, new Rng(), size);
            expect(output).toEqual(size * 10);
        });
    });

    it('can be used as a scalar for collections', () => {
        const gen = sized(n => Gen.of(new Array(n).fill(1)));

        repeatTimes(REPEAT, () => {
            const size = Math.floor(Math.random() * 100);
            const output = generate(gen, new Rng(), size);
            expect(output.length).toEqual(size)
        })
    })
});

describe('resize', () => {
    it('can resize an existing scaled generator', () => {
        const gen = new Gen((r, size) => size * r.nextInt());

        repeatTimes(REPEAT, () => {
            const seed = Math.random();
            const output = generate(resize(10, gen), new Rng(seed), 2);
            expect(output).toEqual(new Rng(seed).nextInt() * 10);
        });
    });
});

describe('chooseInt', () => {

    it('will select the correct lower and upperbound', () => {
        const gen = chooseInt(10, 11);

        repeatTimes(REPEAT, () => {
            const output = generate(gen, new Rng());
            expect(output).toEqual(10);
        });
    })

    it('will not go out of bounds', () => {
        const gen = chooseInt(0, 1000);

        repeatTimes(REPEAT, () => {
            const output = generate(gen, new Rng());
            expect(output).toBeLessThan(1000);
            expect(output).toBeGreaterThanOrEqual(0);
        });
    })

    it.todo('negative lowerbound');
    it.todo('negative upperbound');
    it.todo('upperbound lower that lowerbound');
});

describe('sequence', () => {
    it('will combine generators into one', () => {
        const gen = sequence(Gen.of(1), Gen.of(2), Gen.of(3));

        const output = generate(gen, new Rng());
        expect(output).toEqual([1, 2, 3]);
    })

    it('will combine generators of multiple types into one', () => {
        const gen = sequence<any>(Gen.of(1), Gen.of('a'), Gen.of({ test: 12 }));

        const output = generate(gen, new Rng());
        expect(output).toEqual([1, 'a', { test: 12 }]);
    })
});

describe('sequenceJ', () => {
    it('will combine generators into one', () => {
        const gen = sequenceJ(Gen.of(1), Gen.of(2), Gen.of(3));

        const output = generate(gen, new Rng());
        expect(output).toEqual('123');
    })

    it('will combine generators of multiple types into one', () => {
        const gen = sequenceJ(Gen.of(1), Gen.of('a'));

        const output = generate(gen, new Rng());
        expect(output).toEqual('1a');
    })
});

describe('suchThat', () => {
    it('will return a generator when the predicate holds', () => {
        const gen = suchThat(chooseInt(0, 1000), isEven);

        repeatTimes(REPEAT, () => {
            const output = generate(gen, new Rng());
            expect(isEven(output)).toBeTruthy();
        })
    });
});

describe('suchThatMap', () => {
    it('will return a generator when mapper yields a value', () => {
        const gen = suchThatMap(chooseInt(0, 1000), x => isEven(x) ? 'value' : undefined);

        repeatTimes(REPEAT, () => {
            const output = generate(gen, new Rng());
            expect(output).toEqual('value');
        })
    });
});

describe('suchThatMaybe', () => {
    it('could return a generator that returns undefined after one attempt', () => {
        const gen = suchThatMaybe(chooseInt(0, 10000), isEven);

        repeatTimes(REPEAT, () => {
            const output = generate(gen, new Rng(), 1); // with a size of 1, it will attempt once.
            if (output !== undefined) expect(isEven(output)).toBeTruthy();
            else expect(output).toEqual(undefined);
        })
    })

    it('could return a generator that returns undefined after multiple attempt', () => {
        const gen = suchThatMaybe(chooseInt(0, 10000), isEven);

        repeatTimes(REPEAT, () => {
            const output = generate(gen, new Rng(), 4); 
            if (output !== undefined) expect(isEven(output)).toBeTruthy();
            else expect(output).toEqual(undefined);
        })
    })
});

describe('oneOf', () => {
    it('selects the only generator from a singleton list', () => {
        const gen = oneOf(Gen.of(12));

        repeatTimes(REPEAT, () => {
            const output = generate(gen, new Rng());
            expect(output).toEqual(12);
        })
    })

    it('selects one of the elements from the list of generators', () => {
        const generators = [Gen.of(1), Gen.of(2), Gen.of(3), Gen.of(4)];
        const gen = oneOf(...generators);

        repeatTimes(REPEAT, () => {
            const seed = Math.floor(Math.random() * 100000);
            
            const output = generate(gen, new Rng(seed), 10);
            const index = new Rng(seed).nextRange(0, 4);
            
            expect(output).toEqual(generators[index].effect(new Rng(seed), 10));
        })
    })

});

describe('listOf', () => {

});

describe('listOf1', () => {

});

describe('vectorOf', () => {

});

describe('elements', () => {

});
describe('chance', () => {

});