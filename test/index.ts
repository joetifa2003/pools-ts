import { beforeEach, describe, it } from "node:test"
import { Pool, PoolItem } from "../src";
import { strict as assert } from "node:assert";

class Entity extends PoolItem {
  name = "";
}

describe("pool without reset", () => {
  let pool: Pool<Entity>;
  beforeEach(() => {
    pool = new Pool(() => new Entity());
  });

  it("reuses objects", () => {
    {
      using e1 = pool.get();
      assert.equal(e1.name, "");
      e1.name = "foo bar";
    }

    using e2 = pool.get();
    assert.equal(e2.name, "foo bar")
  });

  it("handles multiple objects", () => {
    {
      using e1 = pool.get();
      using e2 = pool.get();

      assert.notEqual(e1, e2)
    }
  })

  it("cleans up free objects", () => {
    {
      using e1 = pool.get();
      assert.equal(e1.name, "");
      e1.name = "foo bar";

      using e2 = pool.get();
      assert.equal(e2.name, "");
      e2.name = "foo bar baz";
    }

    pool.cleanup();

    using e3 = pool.get();
    assert.equal(e3.name, "");
  })
});

describe("pool with reset", () => {
  let pool: Pool<Entity>;
  beforeEach(() => {
    pool = new Pool(() => new Entity()).withReset((item) => item.name = "");
  });

  it("resets objects after reuse", () => {
    {
      using e1 = pool.get();
      assert.equal(e1.name, "");
      e1.name = "foo bar";
    }

    using e2 = pool.get();
    assert.equal(e2.name, "");
  });
});
