
"use strict";

class Queue {

    /**
     * Queue - 
     * A manager for ordening values and iterating over them.
     * @param {Array} [Iterable] Initial values of this Queue.
     */
    constructor (Iterable = []) {

        /**
         * Main structure holding the Queue values.
         * @name Queue#Values
         * @type {Set}
         * @private
         */
        Object.defineProperty(this, "Values", {value: []});
        for (const Val in Iterable) this.Values.push(Val);
        
    }


    /**
     * Current size of this Queue.
     * @type {Number}
     * @readonly
     */
    get Size () {
        return this.Values.length;
    }

    /**
     * Adds a new entry to the Queue.
     * @param {*} Value Value to be added to the Queue.
     * @returns {Number} The new size of the Queue.
     */
    Add (Value) {
        if (this.Values.includes(Value)) return null;
        this.Values.push(Value);
        return this.Size;
    }

    /**
     * Removes an element from the Queue.
     * @param {Number} Idx Index of the entry of this Queue.
     * @returns {Number} The new size of the Queue.
     */
    Remove (Idx) {
        this.Values.splice(Idx, 1);
        return this.Size;
    }

    /**
     * Fetches current value in the Queue and pops it.
     * @returns {*}
     */
    Next () {
        const Current = this.Values[0];
        this.Values.shift();
        return Current;
    }

    /**
     * Iterates over this Queue.
     * Note - This function does not shift the Queue, pop them yourself with the third argument in the function.
     * @param {Function} fn Function to execute per entry on this Queue.
     * @param {Object} [Iterable] Optional initial values for the cache of this iterate.
     * @returns {Queue}
     */
    Iterate (fn, Iterable = null) {
        const Cache = require("../Helpers/Cache");
        const IdxCache = new Cache(Iterable);

        for (const Val of this.Values) fn(Val, IdxCache, this);
        return IdxCache;
    }

}

module.exports = Queue;
