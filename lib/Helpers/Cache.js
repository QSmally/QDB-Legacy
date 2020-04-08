
"use strict";

const Collection = require("./Collection");

class Cache extends Collection {

    /**
     * Cache - 
     * A Collection with extended custom caching features.
     * @param {Object} [Iterable] Initial values of this Cache.
     * @extends {Collection}
     */
    constructor (Iterable = {}) {
        
        super();

        /**
         * Cached values of this Cache Collection.
         * Updates only when `.set();` is used.
         * @name Cache#_Cached
         * @type {Array}
         */
        Object.defineProperty(this, "Cached", {value: super.values(), writable: true, configurable: false});

        /**
         * An ID tracker by the Cache.
         * @name Cache#_Id
         * @type {Number}
         * @default 0
         * @private
         */
        Object.defineProperty(this, "_Id", {value: 0, writable: true, configurable: false});

    }

    /**
     * Generates a new ID number for the Cache Collection.
     * @returns {Number} Number of the new ID that can be used.
     * @method get
     */
    get id () {
        return this._Id++;
    }


    set (Key, Val) {
        const Value = super.set(Key, Val);
        this.Cached = super.values();
        return Value;
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
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element)) return null;

        Element++;
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Decrements the value of the given Collection by one and caches it internally.
     * @param {*} Key The key of the value to be decremented.
     * @returns {Number} The new value of the element of the Collection.
     */
    decrement (Key) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element)) return null;

        Element--;
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs an addition operation on the given Cache Collection value.
     * @param {*} Key The key of the value to be added on.
     * @param {Number} Num The value to add to the item.
     * @returns {Number} The new value of the element of the Collection.
     */
    add (Key, Num) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element) || !Num || isNaN(Num)) return null;

        Element += Num;
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs a subtraction operation on the given Cache Collection value.
     * @param {*} Key The key of the value to be subtracted from.
     * @param {Number} Num The value to subtract from the item.
     * @returns {Number} The new value of the element of the Collection.
     */
    subtract (Key, Num) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element) || !Num || isNaN(Num)) return null;

        Element -= Num;
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs a multiplication operation on the given Cache Collection value.
     * @param {*} Key The key of the value to be multiplied.
     * @param {Number} Num The second value of multiplication.
     * @returns {Number} The new value of the element of the Collection.
     */
    multiply (Key, Num) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element) || !Num || isNaN(Num)) return null;

        Element *= Num;
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs a division operation on the given Cache Collection value.
     * @param {*} Key The key of the value to be divided.
     * @param {Number} Num The second value of division.
     * @returns {Number} The new value of the element of the Collection.
     */
    divide (Key, Num) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element) || !Num || isNaN(Num)) return null;

        Element /= Num;
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs a 'to the power of two' operation on the given Cache Collection value.
     * @param {*} Key The key of the value to be squared.
     * @returns {Number} The new value of the element of the Collection.
     */
    square (Key) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element)) return null;

        Element = Math.pow(Element, 2);
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs an exponential operation on the given Cache Collection value.
     * @param {*} Key The key of the base value.
     * @param {Number} Num The relative exponent value.
     * @returns {Number} The new value of the element of the Collection.
     */
    power (Key, Num) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element) || !Num || isNaN(Num)) return null;

        Element = Math.pow(Element, Num);
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs a root operation on the given Cache Collection value.
     * @param {*} Key The key of the base value.
     * @returns {Number} The new value of the element of the Collection.
     */
    root (Key) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element)) return null;
        if (Element < 0) return null;

        Element = Math.sqrt(Element);
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs an exponent on Euler's number on the given Cache Collection value.
     * @param {*} Key The key of the base value.
     * @returns {Number} The new value of the element of the Collection.
     */
    exp (Key) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element)) return null;

        Element = Math.exp(Element);
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs an 'abs' operation on the given Cache Collection value.
     * @param {*} Key The key of the base value.
     * @returns {Number} The new value of the element of the Collection.
     */
    absolute (Key) {
        let Element = this.get(Key);
        if (!Element) return undefined;
        if (isNaN(Element)) return null;

        Element = Math.abs(Element);
        this.set(Key, Element);

        this.Cached = super.values();
        return Element;
    }

    /**
     * Performs a function on an item.
     * @param {*} Key The key of the value to execute on.
     * @param {Function} fn Function to execute on the item.
     * @returns {*|Number} The new value of the element.
     */
    accumulate (Key, fn) {
        if (typeof fn !== "function") return null;
        if (!Key || !this.has(Key)) return undefined;
        this.set(Key, fn(this.get(Key), this));

        this.Cached = super.values();
        return this.get(Key);
    }

}

module.exports = Cache;
