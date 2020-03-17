
"use strict";

const Collection = require("./Collection");
const Colour     = require("chalk");

class DataStore extends Collection {

    /**
     * DataStore - 
     * Base class that manages the creation, retrieval and deletion of a specific data model with additional methods that could be added.
     * @extends {Collection}
     */
    constructor () {

        super();

        /**
         * LRR (Last Recently Resolved) -
         * Caches the last data model that got resolved.
         * @name DataStore#LRR
         * @type {DataModel}
         */
        Object.defineProperty(this, "LRR", {value: null, writable: true, configurable: false});
        
    }


    set (Key, Model) {
        if (typeof Model !== "object") return console.warn(Colour.white("[DataStore] ") + Colour.red("DataStore's value must be an object."));
        Model._DataStore = Key;
        return super.set(Key, Model);
    }


    /**
     * Resolves a data model.
     * @param {*} Key The key of the model to resolve.
     * @returns {DataModel} The data model that got resolved or cached.
     */
    resolve (Key) {
        if (this.LRR && this.LRR._DataStore === Key) return this.LRR;

        const Model = super.get(Key);
        this.LRR = Model;
        return Model;
    }

}

module.exports = DataStore;
