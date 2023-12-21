export interface Freeable extends Disposable {
    free: boolean;
    dispose(): void;
    [Symbol.dispose](): void;
}
export declare class PoolItem implements Freeable {
    free: boolean;
    dispose(): void;
    [Symbol.dispose](): void;
}
type RestFunction<T> = (obj: T) => void;
export declare class Pool<T extends Freeable> {
    private factory;
    private items;
    private reset?;
    constructor(factory: () => T);
    withReset(resetFunc: RestFunction<T>): Pool<T>;
    withInitialSize(size: number): void;
    compact(): void;
    cleanup(): void;
    get(): T;
}
export {};
