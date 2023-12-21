import { Bench } from "tinybench";
import { Pool, PoolItem } from "../src";

class Entity extends PoolItem {
  x: number = 0;
  y: number = 0;

  isColliding(e: Entity) {
    return e.x == this.x || e.y == this.y;
  }
}

const ITERATIONS = 1000;

async function main() {
  const bench = new Bench();
  const pool = new Pool(() => new Entity());

  bench
    .add("without pool", () => {
      for (let i = 0; i < ITERATIONS; i++) {
        let e1 = new Entity();
        let e2 = new Entity();
        e1.isColliding(e2);
      }
    })
    .add("with pool", () => {
      for (let i = 0; i < ITERATIONS; i++) {
        using e1 = pool.get();
        using e2 = pool.get();
        e1.isColliding(e2);
      }
    }).add("with pool manual", () => {
      for (let i = 0; i < ITERATIONS; i++) {
        let e1 = pool.get();
        let e2 = pool.get();
        e1.isColliding(e2);

        e1.free = true;
        e2.free = true;
      }
    });

  await bench.run()

  console.table(bench.table())
}

main();
