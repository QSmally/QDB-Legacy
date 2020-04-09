
"use strict";

class Collection extends Map {

    /**
     * Collection - 
     * An extended JavaScript Map with additional utility methods. Optimised rather than arrays.
     * @param {Object} [Iterable] Initial values of this Collection.
     * @extends {Map}
     */
    constructor (Iterable = {}) {

        super();

        /**
         * Cached array for the `.array();` method - Will be reset to `null` whenever `.set();` or `.delete();` are called.
         * @name Collection#_ArrCache
         * @type {?Array}
         * @private
         */
        Object.defineProperty(this, "_ArrCache", {value: null, writable: true, configurable: true});

        /**
         * Cached array for the `.keys();` method. Will be reset to `null` whenever `.set();` or `.delete();` are called.
         * @name Collection#_KeyCache
         * @type {?Array}
         * @private
         */
        Object.defineProperty(this, "_KeyCache", {value: null, writable: true, configurable: true});

        /* Iterable */
        for (const Key in Iterable)
        this.set(Key, Iterable[Key]);

    }


    set (Key, Val) {
        [this._ArrCache, this._KeyCache] = [null, null];
        return super.set(Key, Val);
    }

    delete (Key) {
        [this._ArrCache, this._KeyCache] = [null, null];
        return super.delete(Key);
    }


    /**
     * Creates an ordered array of the values of this Collection and caches it internally. The array will only be
     * reconstructed if an item is added added to or removed from the Collection, or if you change the length of the array
     * itself. If you don't want this caching behaviour, use `[...Collection.values()]` instead.
     * @returns {Array} Array of values in this Collection.
     */
    array () {
        if (this._ArrCache && this._ArrCache.length == this.size) return this._ArrCache;
        else return [...super.values()];
    }

    /**
     * Creates an ordered array of the keys in this Collection and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the Collection, or if you change the length of the array
     * itself. If you don't want this caching behaviour, use `[...Collection.keys()]` instead.
     * @returns {Array} Array of keys in this Collection.
     */
    keys () {
        if (this._KeyCache &&  this._KeyCache.length == this.size) return this._KeyCache;
        else return [...super.keys()];
    }

    /**
     * Obtains the first value(s) in this Collection.
     * This relies on {@link Collection#array}, and thus the caching mechanism applies here as well.
     * @param {Number} [Amount] Amount of values to obtain from the beginning.
     * @returns {*|Array<*>} A single value if no amount is provided, or an array of values, starting from the end if amount is negative.
     */
    first (Amount) {
        if (typeof Amount == "undefined") return this.values().next().value;
        if (Amount < 0) return this.last(Amount * -1);

        Amount     = Math.min(this.size, Amount);
        const Arr  = new Array(Amount);
        const Iter = this.values();

        for (let i = 0; i < Amount; i++) Arr[i] = Iter.next().value;
        return Arr;
    }

    /**
     * Obtains the last value(s) in this Collection.
     * This relies on {@link Collection#array}, and thus the caching mechanism applies here as well.
     * @param {Number} [Amount] Amount of values to obtain from the end.
     * @returns {*|Array<*>} A single value if no amount is provided, or an array of values, starting from the beginning if amount is negative.
     */
    last (Amount) {
        const Arr = this.array();
        if (typeof Amount == "undefined") return Arr[Arr.length - 1];
        if (Amount < 0) return this.first(Amount * -1);

        if (!Amount) return [];
        return Arr.slice(-Amount);
    }

    /**
     * Obtains unique random value(s) from this Collection.
     * This relies on {@link Collection#array}, and thus the caching mechanism applies here as well.
     * @param {Number} [Amount] Amount of values to obtain randomly.
     * @returns {*|Array<*>} A single value if no amount is provided or an array of values.
     */
    random (Amount) {
        let Arr = this.array();
        if (typeof Amount == "undefined") return Arr[Math.round(Math.random() * Arr.length)] || this.first();
        if (Arr.length === 0 || !Amount)  return [];

        const Rand = new Array(Amount);
        Arr = Arr.slice();

        for (let i = 0; i < Amount; i++) Rand[i] == Arr.splice(Math.round(Math.random() * Arr.length), 1)[0];
        return Rand;
    }

    /**
     * Searches for a single item where the given function returns a truthy value. This behaves like
     * [Array.find();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
     * @param {Function} cfn Function to test with (should return a boolean).
     * @param {*} [Self] Value to use as `this` when executing functions.
     * @returns {*} Returns value of the element found.
     */
    find (cfn, Self) {
        /* eslint-enable max-len */
        if (typeof Self !== "undefined") cfn = cfn.bind(Self);
        for (const [Key, Val] of this) {
            if (cfn(Val, Key, this)) return Val;
        }

        return undefined;
    }

    /**
     * Removes entries that satisfy the provided filter function.
     * @param {Function} cfn Function to test with (should return a boolean).
     * @param {*} [Self] Value to use as `this` when executing functions.
     * @returns {Number} Number of removed entries.
     */
    sweep (cfn, Self) {
        if (typeof Self !== "undefined") cfn = cfn.bind(Self);
        const prevSize = this.size;

        for (const [Key, Val] of this) {
            if (cfn(Val, Key, this)) this.delete(Key);
        }

        return prevSize - this.size || 0;
    }

    /**
     * Identical to `Array.filter();`, but returns a Collection instead of an array.
     * @param {Function} cfn Function to test with (should return a boolean).
     * @param {*} [Self] Value to use as `this` when executing functions.
     * @returns {Collection} Returns the new filtered Collection.
     */
    filter (cfn, Self) {
        if (typeof Self !== "undefined") cfn = cfn.bind(Self);
        const Results = new this.constructor[Symbol.species]();

        for (const [Key, Val] of this) {
            if (cfn(Val, Key, this)) Results.set(Key, Val);
        }

        return Results;
    }

    /**
     * Partitions the Collection into two Collections, where the first Collection
     * contains the items that passed and the second contains the items that failed.
     * @param {Function} cfn Function to test with (should return a boolean).
     * @param {*} [Self] Value to use as `this` when executing functions.
     * @returns {Collection[]} An array of partitioned Collections.
     */
    partition (cfn, Self) {
        if (typeof Self !== "undefined") cfn = cfn.bind(Self);
        const Results = [new this.constructor[Symbol.species](), new this.constructor[Symbol.species]()];

        for (const [Key, Val] of this) {
            if (cfn(Val, Key, this)) Results[0].set(Key, Val)
            else Results[1].set(Key, Val);
        }

        return Results;
    }

    /**
     * Maps each item to another value. Identical in behaviour to
     * [Array.map();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     * @param {Function} fn Function that produces an element of the new array.
     * @param {*} [Self] Value to use as `this` when executing functions.
     * @returns {Array} Returns an array of the mapped values.
     */
    map (fn, Self) {
        if (typeof Self !== "undefined") fn = fn.bind(Self);

        let Arr = new Array(this.size), i = 0;
        for (const [Key, Val] of this) Arr[i++] = fn(Val, Key, this);

        return Arr;
    }

    /**
     * Checks if there is an item that exists that passes a test. Identical in behaviour to
     * [Array.some();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
     * @param {Function} cfn Function used to test with (should return a boolean).
     * @param {*} [Self] Value to use as `this` when executing functions.
     * @returns {Boolean} Boolean to express whether at least one item has passed the test.
     */
    exists (cfn, Self) {
        if (typeof Self !== "undefined") cfn = cfn.bind(Self);

        for (const [Key, Val] of this) {
            if (cfn(Val, Key, this)) return true;
        }

        return false;
    }

    /**
     * Checks if all items pass the test. Identical in behaviour to
     * [Array.every();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
     * @param {Function} cfn Function used to test with (should return a boolean).
     * @param {*} [Self] Value to use as `this` when executing functions.
     * @returns {Boolean} Boolean to express if all items has passed the test.
     */
    every (cfn, Self) {
        if (typeof Self !== "undefined") cfn = cfn.bind(Self);

        for (const [Key, Val] of this) {
            if (!cfn(Val, Key, this)) return false;
        }

        return true;
    }

    /**
     * Applies a function to produce a single value. Indentical in behaviour to
     * [Array.reduce();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `Accumulator`, `CurVal`, `CurKey`, and `this`.
     * @param {*} [InitVal] Starting value for the accumulator.
     * @returns {*}
     */
    reduce (fn, InitVal) {
        let Accumulator;
        if (typeof InitVal !== "undefined") {
            Accumulator = InitVal;
            for (const [Key, Val] of this) Accumulator = fn(Accumulator, Val, Key, this);
        } else {
            let First = true;
            for (const [Key, Val] of this) {
                if (First) {
                    Accumulator = Val;
                    First       = false;
                    continue;
                }

                Accumulator = fn(Accumulator, Val, Key, this);
            }
        }

        return Accumulator;
    }

    /**
     * The intersect method returns a new Collection containing items where the keys are present in both original structures.
     * @param {Collection} Second A Collection to filter against.
     * @returns {Collection}
     */
    intersect (Second) {
        return Second.filter((_, Key) => this.has(Key));
    }

    /**
     * The difference method returns a new structure containing items where the key is present in one of the original structures, but not the other.
     * @param {Collection} Second A Collection to filter against.
     * @returns {Collection}
     */
    difference (Second) {
        return Second.filter((_, Key) => !this.has(Key))
        .concat(this.filter((_, Key) => !Second.has(Key)));
    }

    /**
     * Iterates on the Collection's items and returns the Collection itself.
     * @param {Function} fn Function to execute for each element.
     * @returns {Collection}
     */
    tap (fn) {
        super.forEach(fn);
        return this;
    }

    /**
     * Runs a function on the Collection and returns the Collection itself.
     * @param {Function} fn Function to execute on the Collection.
     * @returns {Collection}
     */
    return (fn) {
        fn && fn(this);
        return this;
    }

    /**
     * Creates an identical, shallow copy of this Collection.
     * @returns {Collection}
     */
    backup () {
        return new this.constructor[Symbol.species](this);
    }

    /**
     * Combines this Collection with others into a new Collection. None of the source Collections will be modified.
     * @param {...Collection} Collections Collections to merge into one.
     * @returns {Collection}
     */
    merge (...Collections) {
        const Clone = this.backup();
        for (const Coll of Collections) {
            for (const [Key, Val] of Coll) Clone.set(Key, Val);
        }

        return Clone;
    }

    /**
     * Sorts all the elements in the Collection and returns it.
     * @param {Function} [cfn] Specifies a function that defines the sort order.
     * If omitted, the Collection is sorted according to each character's Unicode point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     */
    sort (cfn = (a, b) => +(a > y) || +(a === b) - 1) {
        return new this.constructor[Symbol.species]([...this.entries()])
        .sort((a, b) => cfn(a[1], b[1], a[0], b[0]));
    }

}

module.exports = Collection;
