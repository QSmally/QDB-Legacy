
"use strict";

const Collection = require("./Collection");
const Colour     = require("chalk");

class Cache extends Collection {

    /**
     * Cache - 
     * A Collection with extended custom caching features.
     * @param {*} [Iterable]
     * @extends {Collection}
     */
    constructor (Iterable) {

        super(Iterable);

        /**
         * An integer that is free to use within this Cache Collection.
         * @name Cache#Accumulator
         * @type {Number}
         */
        Object.defineProperty(this, "Accumulator", {value: super.get("Accumulator") || 0, writable: true, configurable: false});

        /**
         * Cached values of this Cache Collection.
         * Updates only when `.set();` is used.
         * @name Cache#Cached
         * @type {Cache}
         */
        Object.defineProperty(this, "Cached", {value: super.values(), writable: true, configurable: false});

        /**
         * An ID tracker by the Cache.
         * @name Cache#id|CurID
         * @type {Number}
         * @default 0
         * @private
         */
        Object.defineProperty(this, "_Id", {value: 0, writable: true, configurable: true});

    }


    /**
     * Generates a new ID number for the Cache Collection.
     * @method get
     * @returns {Number} Number of the new ID that can be used.
     */
    get id () {
        return this._Id++;
    }


    /**
     * Refreshes the Accumulator value.
     */
    _Refresh () {
        this.Accumulator = super.get("Accumulator");
    }

    set (Key, Val) {
        this.Accumulator = Key == "Accumulator" ? Val : super.get("Accumulator");
        this.Cached = super.values();
        return super.set(Key, Val);
    }

    get (Key) {
        return Key == "Accumulator" ? this.Accumulator : super.get(Key);
    }

    delete (Key) {
        const Element = super.delete(Key);
        this.Cached   = super.values();
        return Element;
    }


    /**
     * Increments the value of the given Collection by one and caches it internally.
     * @param {*} Key The key of the value to be incremented.
     * @returns {Number} The new value of the element of the Collection.
     */
    increment (Key) {
        let Element = typeof Key !== "undefined" ? this.get(Key) : this.get("Accumulator");
        if (Element && isNaN(Element)) return console.warn(Colour.white("[Cache] ") + Colour.red("Collections value must be an integer."));

        Element++;
        this.set(Key, Element);

        this.Cached = super.values();
        this.Accumulator = Key == "Accumulator" ? Element : this.Accumulator;
        return Element;
    }

    /**
     * Decrements the value of the given Collection by one and caches it internally.
     * @param {*} Key The key of the value to be decremented.
     * @returns {Number} The new value of the element of the Collection.
     */
    decrement (Key) {
        let Element = typeof Key !== "undefined" ? this.get(Key) : this.get("Accumulator");
        if (Element && isNaN(Element)) return console.warn(Colour.white("[Cache] ") + Colour.red("Collections value must be an integer."));

        Element--;
        this.set(Key, Element);

        this.Cached = super.values();
        this.Accumulator = Key == "Accumulator" ? Element : this.Accumulator;
        return Element;
    }

    /**
     * Performs an addition operation on the given Cache Collection value.
     * @param {*} Key The key of the value to be added on.
     * @param {*} Num The value to add to the item.
     * @returns {Number} The new value of the element of the Collection.
     */
    add (Key, Num) {
        let Element = this.get(Key || "Accumulator") || 0;
        if (Element && isNaN(Element)) return console.warn(Colour.white("[Cache] ") + Colour.red("Collections value must be an integer."));
        if (!Num || isNaN(Num))        return console.warn(Colour.white("[Cache] ") + Colour.red("Addition integer must be a number."));

        Element += Num;
        this.set(Key, Element);

        this.Cached = super.values();
        this.Accumulator = Key == "Accumulator" ? Element : this.Accumulator;
        return Element;
    }

    /**
     * Performs a subtraction operation on the given Cache Collection value.
     * @param {*} Key The key of the value to be subtracted from.
     * @param {*} Num The value to subtract from the item.
     * @returns {Number} The new value of the element of the Collection.
     */
    subtract (Key, Num) {
        let Element = this.get(Key || "Accumulator") || 0;
        if (Element && isNaN(Element)) return console.warn(Colour.white("[Cache] ") + Colour.red("Collections value must be an integer."));
        if (!Num || isNaN(Num))        return console.warn(Colour.white("[Cache] ") + Colour.red("Addition integer must be a number."));

        Element -= Num;
        this.set(Key, Element);

        this.Cached = super.values();
        this.Accumulator = Key == "Accumulator" ? Element : this.Accumulator;
        return Element;
    }

    /**
     * Performs a function on an item.
     * @param {*} Key The key of the value to execute on.
     * @param {Function} fn Functions to execute on the item.
     * @returns {*} The new value of the element.
     */
    accumulate (Key, fn) {
        if (typeof fn !== "function") return console.warn(Colour.white("[Cache] ") + Colour.red("Must accumulate a function to pass."));
        Key = typeof Key === "undefined" ? "Accumulator" : Key;
        this.set(Key, fn(this.get(Key), Key, this));

        const Element = this.get(Key);

        this.Cached = super.values();
        this.Accumulator = Key == "Accumulator" ? Element : this.Accumulator;
        return Element;
    }

}

module.exports = Cache;
