"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
var node_test_1 = require("node:test");
var src_1 = require("../src");
var node_assert_1 = require("node:assert");
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    function Entity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "";
        return _this;
    }
    return Entity;
}(src_1.PoolItem));
(0, node_test_1.describe)("pool without reset", function () {
    var pool;
    (0, node_test_1.beforeEach)(function () {
        pool = new src_1.Pool(function () { return new Entity(); });
    });
    (0, node_test_1.it)("reuses objects", function () {
        var env_1 = { stack: [], error: void 0, hasError: false };
        try {
            {
                var env_2 = { stack: [], error: void 0, hasError: false };
                try {
                    var e1 = __addDisposableResource(env_2, pool.get(), false);
                    node_assert_1.strict.equal(e1.name, "");
                    e1.name = "foo bar";
                }
                catch (e_1) {
                    env_2.error = e_1;
                    env_2.hasError = true;
                }
                finally {
                    __disposeResources(env_2);
                }
            }
            var e2 = __addDisposableResource(env_1, pool.get(), false);
            node_assert_1.strict.equal(e2.name, "foo bar");
        }
        catch (e_2) {
            env_1.error = e_2;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    });
    (0, node_test_1.it)("handles multiple objects", function () {
        {
            var env_3 = { stack: [], error: void 0, hasError: false };
            try {
                var e1 = __addDisposableResource(env_3, pool.get(), false);
                var e2 = __addDisposableResource(env_3, pool.get(), false);
                node_assert_1.strict.notEqual(e1, e2);
            }
            catch (e_3) {
                env_3.error = e_3;
                env_3.hasError = true;
            }
            finally {
                __disposeResources(env_3);
            }
        }
    });
    (0, node_test_1.it)("cleans up free objects", function () {
        var env_4 = { stack: [], error: void 0, hasError: false };
        try {
            {
                var env_5 = { stack: [], error: void 0, hasError: false };
                try {
                    var e1 = __addDisposableResource(env_5, pool.get(), false);
                    node_assert_1.strict.equal(e1.name, "");
                    e1.name = "foo bar";
                    var e2 = __addDisposableResource(env_5, pool.get(), false);
                    node_assert_1.strict.equal(e2.name, "");
                    e2.name = "foo bar baz";
                }
                catch (e_4) {
                    env_5.error = e_4;
                    env_5.hasError = true;
                }
                finally {
                    __disposeResources(env_5);
                }
            }
            pool.cleanup();
            var e3 = __addDisposableResource(env_4, pool.get(), false);
            node_assert_1.strict.equal(e3.name, "");
        }
        catch (e_5) {
            env_4.error = e_5;
            env_4.hasError = true;
        }
        finally {
            __disposeResources(env_4);
        }
    });
});
(0, node_test_1.describe)("pool with reset", function () {
    var pool;
    (0, node_test_1.beforeEach)(function () {
        pool = new src_1.Pool(function () { return new Entity(); }).withReset(function (item) { return item.name = ""; });
    });
    (0, node_test_1.it)("resets objects after reuse", function () {
        var env_6 = { stack: [], error: void 0, hasError: false };
        try {
            {
                var env_7 = { stack: [], error: void 0, hasError: false };
                try {
                    var e1 = __addDisposableResource(env_7, pool.get(), false);
                    node_assert_1.strict.equal(e1.name, "");
                    e1.name = "foo bar";
                }
                catch (e_6) {
                    env_7.error = e_6;
                    env_7.hasError = true;
                }
                finally {
                    __disposeResources(env_7);
                }
            }
            var e2 = __addDisposableResource(env_6, pool.get(), false);
            node_assert_1.strict.equal(e2.name, "");
        }
        catch (e_7) {
            env_6.error = e_7;
            env_6.hasError = true;
        }
        finally {
            __disposeResources(env_6);
        }
    });
});
