"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.PoolItem = void 0;
var PoolItem = /** @class */ (function () {
    function PoolItem() {
        this.free = true;
    }
    PoolItem.prototype.dispose = function () {
        this.free = true;
    };
    PoolItem.prototype[Symbol.dispose] = function () {
        this.dispose();
    };
    return PoolItem;
}());
exports.PoolItem = PoolItem;
var Pool = /** @class */ (function () {
    function Pool(factory) {
        this.factory = factory;
        this.items = [];
    }
    Pool.prototype.withReset = function (resetFunc) {
        this.reset = resetFunc;
        return this;
    };
    Pool.prototype.withInitialSize = function (size) {
        this.items = Array(size).fill(this.factory);
    };
    Pool.prototype.compact = function () {
        this.items = this.items.filter(function (item) { return !(item === null || item === void 0 ? void 0 : item.free); });
    };
    Pool.prototype.cleanup = function () {
        var _a;
        for (var i = 0; i < this.items.length; i++) {
            if ((_a = this.items[i]) === null || _a === void 0 ? void 0 : _a.free) {
                this.items[i] = null;
            }
        }
    };
    Pool.prototype.get = function () {
        for (var i = 0; i < this.items.length; i++) {
            var item_1 = this.items[i];
            if (!item_1) {
                var newItem = this.factory();
                newItem.free = false;
                this.items[i] = newItem;
                return newItem;
            }
            if (item_1 === null || item_1 === void 0 ? void 0 : item_1.free) {
                item_1.free = false;
                if (this.reset) {
                    this.reset(item_1);
                }
                return item_1;
            }
        }
        var item = this.factory();
        item.free = false;
        this.items.push(item);
        return item;
    };
    return Pool;
}());
exports.Pool = Pool;
