
export class Rng {
    private readonly m: number = 0x80000000;
    private readonly a: number = 1103515245;
    private readonly c: number = 12345;
    public readonly seed: number;
    private state: number;

    constructor(seed?: number) {
        this.seed = seed ? seed : Math.floor(Math.random() * this.m - 1);
        this.state = this.seed;
    }
    
    nextInt(): number {
        this.state = (this.a * this.state + this.c) % this.m;
        return Math.floor(this.state);
    }

    nextRange(start: number, end: number): number {
        const range = end - start;
        const randNorm = this.nextInt() / this.m;
        return start + Math.floor(randNorm * range);
    }
}