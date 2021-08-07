import { Gen } from ".";

/**
 * Helper function to create a generator that can be sized. 
 * 
 * @param f function to be sized
 * @returns the sized generator
 */
export function sized<T>(f: (size: number) => Gen<T>): Gen<T> {
    return new Gen((r, n) => f(n).effect(r, n));
}

/**
 * Resize size parameter for the given generator.
 * 
 * @param size      the new size to be used
 * @param generator the generator to be resized
 * @returns the resized generator
 */
export function resize<T>(size: number, generator: Gen<T>): Gen<T> {
    return new Gen((r, _) => generator.effect(r, size));
}

/**
 * Create simple bounded random number generator.
 * 
 * @param min the lowerbound of the generated number
 * @param max the upperbound of the generated number
 * @returns the bounded random number generator
 */
export function chooseInt(min: number, max: number): Gen<number> {
    return new Gen((r, _) => r.nextRange(min, max));
}

/**
 * Combine a list of generators into one generator.
 * 
 * @param generators the generators to combine
 * @returns the combined generator
 */
export function sequence<T>(...generators: Gen<T>[]): Gen<T[]> {
    return new Gen((r, n) => generators.map(g => g.effect(r, n)));
}

/**
 * Combine a list of generators into one generator.
 * The output will be joined into a string
 * 
 * @param generators the generators to combine
 * @returns the combined generator
 */
export function sequenceJ(...generators: Gen<any>[]): Gen<string> {
    return new Gen((r, n) => generators.map(g => g.effect(r, n).toString()).join(''));
}


/**
 * Forcefully keep trying a generator until the predicate holds.
 * 
 * NOTE: It will keep trying... until the predicate holds... potentially forever if you made a mistake...
 * Please be carefull!! Like really forever... thats a long time... or untill the stack runs out
 * 
 * @param generator the generator to attempt
 * @param pred      the predicate that should hold
 * @returns a generator that returns a value for which the predicate holds
 */
export function suchThat<T>(generator: Gen<T>, pred: (val: T) => boolean): Gen<T> {
    return new Gen((r, n) => {
        const val = suchThatMaybe(generator, pred).effect(r, n);
        if (val) return val;
        return resize(n + 1, suchThat(generator, pred)).effect(r, n);
    });
}

/**
 * Will try to map a generator untill the output of the transforming function is not undefined.
 * 
 * @param generator the generator to attempt
 * @param fn        the transforming function to use
 * @returns a generator that returns a value if and only if the transforming function did not return undefined
 */
export function suchThatMap<T, O>(generator: Gen<T>, fn: ((val: T) => undefined | O)): Gen<O> {
    return suchThat(generator.map(fn), x => x !== undefined).map(val => val as O);
}

/**
 * Will try to make a generator that holds a predicate. 
 * It will return a sized generator, where the size will affect the attempt it will try.
 * 
 * @param generator the generator to attempt
 * @param pred      the predicate that should hold
 * @returns a generator that might return a value that holds the predicate
 */
export function suchThatMaybe<T>(generator: Gen<T>, pred: (val: T) => boolean): Gen<undefined | T> {
    return sized(_n => new Gen((r, _) => {
        const _try = (m: number, n: number): undefined | T => {
            if (m >= n) return undefined;

            const val = resize(m, generator).effect(r, n);
            return pred(val) ? val : _try(m + 1, n);
        }
        return _try(_n, 2*_n);
    }));
}

/**
 * A generator that will randomly select one of the given generators.
 * 
 * @param generators the list of generators to choose from
 * @returns one of the given generators
 */
export function oneOf<T>(...generators: Gen<T>[]): Gen<T> {
    return chooseInt(0, generators.length) ['>>='] (k => generators[k]);
}

export function listOf<T>(generator: Gen<T>): Gen<T[]> {
    return sized(n => chooseInt(0, n) ['>>='] (k => vectorOf(k, generator)));
}

export function listOf1<T>(generator: Gen<T>): Gen<T[]> {
    return sized(n => chooseInt(1, n) ['>>='] (k => vectorOf(k, generator)));
}

export function vectorOf<T>(length: number, generator: Gen<T>): Gen<T[]> {
    return new Gen((r, n) => new Array(length).fill(0).map(_ => generator.effect(r, n)));
}

export function elements<T>(options: T[]): Gen<T> {
    return chooseInt(0, options.length) ['>>='] (k => Gen.of(options[k]));
}

export function chance<T>(p: number, generator: Gen<T>): Gen<undefined | T> {
    return new Gen((r, n) => {
        const val = r.nextRange(0, 100);
        if (val / 100 < p) return generator.effect(r, n);
        return undefined
    })
}

