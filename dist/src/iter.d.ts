declare function stream<T>(arr: T[]): Generator<T>;
declare function map<T, U>(i: Generator<T>, f: (arg: T) => U): Generator<U>;
declare const a: number[];
declare const b: Generator<number, any, unknown>;
