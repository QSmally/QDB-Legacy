
"use strict";

class Stack {

    /**
     * Stack - 
     * A manager for temporarily storing mass data in sequence.
     * @param {Array} [Iterable] Initial values of this Stack.
     */
    constructor (Iterable = []) {

        /**
         * Main structure holding the Stack values.
         * @name Stack#Values
         * @type {Array}
         * @private
         */
        Object.defineProperty(this, "Values", {value: []});
        for (const Val of Iterable) this.Values.push(Val);
        
    }


    /**
     * Current size of this Stack.
     * @type {Number}
     * @readonly
     */
    get Size () {
        return this.Values.length;
    }

    /**
     * Pushes a new item or items to this data Stack.
     * @param {*|Array} ValueOrArr Either a value or an array of values to push to this Stack.
     * @returns {Number} The new size of the Stack.
     */
    Push (ValueOrArr) {
        if (typeof ValueOrArr == "undefined") return null;
        if (ValueOrArr instanceof Array) for (const Val of ValueOrArr) this.Values.push(Val);
        else this.Values.push(ValueOrArr);
        return this.Size;
    }

    /**
     * Pops an amount from this data Stack.
     * @param {Number?} [Amount] Amount to pop from the Stack.
     * @returns {*|Array} Popped value or an array with popped values.
     */
    Pop (Amount = 1) {
        if (typeof Amount != "number") return null;
        if (Amount > 1) {
            let Items = [];
            for (let i = 0; i < Amount; i++) Items.push(this.Values.pop());
            return Items;
        } else return this.Values.pop();
    }

    /**
     * Returns the last or an item in this data Stack.
     * @param {Number?} [PointerOffset] Amount of offset to the read/write pointer to seek from.
     * @returns {*} Item at that location in this Stack.
     */
    Seek (PointerOffset = 0) {
        if (typeof PointerOffset != "number") return null;
        return this.Values[this.Values.length - 1 - PointerOffset];
    }

    /**
     * Completely flushes this data Stack.
     * @returns {*} Returns the previous items in this Stack.
     */
    Flush () {
        return this.Values.splice(0, this.Values.length);
    }

}

module.exports = Stack;
