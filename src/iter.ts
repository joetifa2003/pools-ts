function* stream<T>(arr: T[]): Generator<T> {
  for (const v of arr) {
    yield v;
  }
}

function* map<T, U>(i: Generator<T>, f: (arg: T) => U): Generator<U> {
  for (const v of i) {
    yield f(v);
  }
}

const a = [1, 2, 3];
const b = map(stream(a), (v) => v + 1);
