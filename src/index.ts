export interface Freeable extends Disposable {
  free: boolean;
  dispose(): void;

  [Symbol.dispose](): void;
}

export class PoolItem implements Freeable {
  free: boolean = true;

  dispose(): void {
    this.free = true;
  }

  [Symbol.dispose](): void {
    this.dispose();
  }
}

type RestFunction<T> = (obj: T) => void;

export class Pool<T extends Freeable> {
  private items: (T | null)[] = [];
  private reset?: RestFunction<T>;

  constructor(private factory: () => T) {}

  withReset(resetFunc: RestFunction<T>): Pool<T> {
    this.reset = resetFunc;
    return this;
  }

  withInitialSize(size: number): void {
    this.items = Array(size).fill(this.factory);
  }

  compact(): void {
    this.items = this.items.filter((item) => !item?.free);
  }

  cleanup(): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]?.free) {
        this.items[i] = null;
      }
    }
  }

  get(): T {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!item) {
        let newItem = this.factory();
        newItem.free = false;
        this.items[i] = newItem;
        return newItem;
      }

      if (item?.free) {
        item.free = false;
        if (this.reset) {
          this.reset(item);
        }
        return item;
      }
    }

    const item = this.factory();
    item.free = false;
    this.items.push(item);
    return item;
  }
}
